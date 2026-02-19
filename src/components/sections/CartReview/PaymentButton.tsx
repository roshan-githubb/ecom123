"use client"

import ErrorMessage from "@/components/molecules/ErrorMessage/ErrorMessage"
import { isManual, isStripe } from "../../../lib/constants"
import { placeOrder } from "@/lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useEffect, useState } from "react"
import { Button } from "@/components/atoms"
import { toast } from "@/lib/helpers/toast"
import { logPurchase } from "@/lib/firebase/analytics"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  // Check for missing requirements
  const hasAddress = cart.shipping_address && cart.billing_address && cart.email
  const hasShippingMethods = (cart.shipping_methods?.length ?? 0) >= 1
  const hasPaymentMethod = cart.payment_collection?.payment_sessions?.some(
    (session: any) => session.status === "pending"
  )

  // Count unique sellers/vendors in cart
  const uniqueSellers = new Set(
    cart.items?.map((item: any) => item.product?.seller?.id).filter(Boolean)
  )
  const vendorCount = uniqueSellers.size
  const shippingMethodCount = cart.shipping_methods?.length ?? 0

  // Check if all vendors have shipping methods selected
  const allVendorsHaveShipping = vendorCount > 0 && shippingMethodCount >= vendorCount

  const notReady = !hasAddress || !hasShippingMethods || !hasPaymentMethod

  // Custom click handler to show specific error messages
  const handleButtonClick = (e: React.MouseEvent, originalHandler?: () => void) => {
    const missingItems: string[] = []

    if (!hasAddress) {
      missingItems.push("delivery address")
    }

    if (!hasShippingMethods) {
      if (vendorCount > 1) {
        missingItems.push("shipping methods for all vendors")
      } else {
        missingItems.push("shipping method")
      }
    } else if (vendorCount > 1 && !allVendorsHaveShipping) {
      // Some vendors are missing shipping methods
      toast.error({ title: `Please select shipping methods for all ${vendorCount} vendors` })
      e.preventDefault()
      return
    }

    if (!hasPaymentMethod) {
      missingItems.push("payment method")
    }

    if (missingItems.length > 0) {
      if (missingItems.length === 1) {
        toast.error({ title: `Please add a ${missingItems[0]} to continue` })
      } else if (missingItems.length === 2) {
        toast.error({ title: `Please add ${missingItems[0]} and ${missingItems[1]} to continue` })
      } else {
        toast.error({ title: `Please add ${missingItems.slice(0, -1).join(", ")}, and ${missingItems[missingItems.length - 1]} to continue` })
      }
      e.preventDefault()
      return
    }

    // All checks passed, call original handler
    originalHandler?.()
  }

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  switch (true) {
    case isStripe(paymentSession?.provider_id):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
          onButtonClick={handleButtonClick}
        />
      )
    case isManual(paymentSession?.provider_id):
      return (
        <ManualTestPaymentButton 
          notReady={notReady} 
          data-testid={dataTestId}
          onButtonClick={handleButtonClick}
        />
      )
    default:
      return (
        <Button 
          disabled 
          className="w-full"
          onClick={(e) => {
            e.preventDefault()
            toast.error({ title: "Please select a payment method to continue" })
          }}
        >
          Select a payment method
        </Button>
      )
  }
}

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
  onButtonClick,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
  onButtonClick?: (e: React.MouseEvent, handler?: () => void) => void
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [disabled, setDisabled] = useState(true)

  const onPaymentCompleted = async () => {
    try {
      const res = await placeOrder()
      if (!res.ok) {
        setErrorMessage(res.error?.message)
      } else {
        if (cart && res.order) {
          const items = cart.items?.map((item: any) => ({
            item_id: item.product_id || item.variant_id,
            item_name: item.product_title || item.title,
            price: item.unit_price || 0,
            quantity: item.quantity || 1,
          })) || []
          
          logPurchase(
            res.order.id || 'unknown',
            cart.total || 0,
            items
          )
        }
        
        const { useCartStore } = await import("@/store/useCartStore");
        useCartStore.getState().clearLocal();
      }
    } catch (error: any) {
      if (error?.message !== "NEXT_REDIRECT") {
        setErrorMessage(
          error?.message?.replace("Error setting up the request: ", "")
        )
      } else {
        // Order was successful and redirecting, clear cart
        const { useCartStore } = await import("@/store/useCartStore");
        useCartStore.getState().clearLocal();
      }
    } finally {
      setSubmitting(false)
    }
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  useEffect(() => {
    //@ts-ignore
    setDisabled(!card?._complete)
  }, [card, stripe, elements, cart])

  const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }

    await stripe
      .confirmCardPayment(session?.data.client_secret as string, {
        payment_method: {
          card: card,
          billing_details: {
            name:
              cart.billing_address?.first_name +
              " " +
              cart.billing_address?.last_name,
            address: {
              city: cart.billing_address?.city ?? undefined,
              country: cart.billing_address?.country_code ?? undefined,
              line1: cart.billing_address?.address_1 ?? undefined,
              line2: cart.billing_address?.address_2 ?? undefined,
              postal_code: cart.billing_address?.postal_code ?? undefined,
              state: cart.billing_address?.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billing_address?.phone ?? undefined,
          },
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent

          if (
            (pi && pi.status === "requires_capture") ||
            (pi && pi.status === "succeeded")
          ) {
            onPaymentCompleted()
          }

          setErrorMessage(error.message || null)
          return
        }

        if (
          (paymentIntent && paymentIntent.status === "requires_capture") ||
          paymentIntent.status === "succeeded"
        ) {
          return onPaymentCompleted()
        }

        return
      })
  }

  return (
    <>
      <Button
        disabled={disabled || notReady}
        onClick={(e) => {
          if (onButtonClick) {
            onButtonClick(e, handlePayment)
          } else {
            handlePayment()
          }
        }}
        loading={submitting}
        className="w-full"
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="stripe-payment-error-message"
      />
    </>
  )
}

const ManualTestPaymentButton = ({ 
  notReady,
  onButtonClick,
}: { 
  notReady: boolean
  onButtonClick?: (e: React.MouseEvent, handler?: () => void) => void
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    try {
      const res = await placeOrder()
      if (!res.ok) {
        setErrorMessage(res.error?.message)
      } else {
        if (res.order) {
          const items = res.order.items?.map((item: any) => ({
            item_id: item.product_id || item.variant_id,
            item_name: item.product_title || item.title,
            price: item.unit_price || 0,
            quantity: item.quantity || 1,
          })) || []
          
          logPurchase(
            res.order.id || 'unknown',
            res.order.total || 0,
            items
          )
        }
        
        // Clear cart state only after successful order placement
        const { useCartStore } = await import("@/store/useCartStore");
        useCartStore.getState().clearLocal();
      }
    } catch (error: any) {
      if (error?.message !== "NEXT_REDIRECT") {
        setErrorMessage(
          error?.message?.replace("Error setting up the request: ", "")
        )
      } else {
        // Order was successful and redirecting, clear cart
        const { useCartStore } = await import("@/store/useCartStore");
        useCartStore.getState().clearLocal();
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handlePayment = () => {
    setSubmitting(true)
    onPaymentCompleted()
  }

  return (
    <>
      <Button
        disabled={notReady}
        onClick={(e) => {
          if (onButtonClick) {
            onButtonClick(e, handlePayment)
          } else {
            handlePayment()
          }
        }}
        className="w-full"
        loading={submitting}
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

export default PaymentButton
