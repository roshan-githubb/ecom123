"use client"
import { RadioGroup } from "@headlessui/react"
import {
  isCod,
  isStripe as isStripeFunc,
  paymentInfoMap,
} from "../../../lib/constants"
import { SetStateAction, useState } from "react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { Text } from "@medusajs/ui"

type StoreCardPaymentMethod = any & {
  service_zone?: {
    fulfillment_set: {
      type: string
    }
  }
}

const CartPaymentSection = ({
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  cart,
  availablePaymentMethods,
  onPaymentUpdate,
  isMultiSeller,
}: {
  selectedPaymentMethod: string
  setSelectedPaymentMethod: (value: SetStateAction<string>) => void
  cart: any
  availablePaymentMethods: StoreCardPaymentMethod[] | null
  onPaymentUpdate?: () => void
  isMultiSeller?: boolean
}) => {
  // const activeSession = cart.payment_collection?.payment_sessions?.find(
  //   (paymentSession: any) => paymentSession.status === "pending"
  // )

  // const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
  //   activeSession?.provider_id ?? ""
  // )
  const [loadingPaymentMethod, setLoadingPaymentMethod] = useState<
    string | null
  >(null)
  const [isProcessingEsewa, setIsProcessingEsewa] = useState(false)
  const [isProcessingKhalti, setIsProcessingKhalti] = useState(false)
  const { toast } = useToast()

  const setPaymentMethod = async (method: string) => {
    setSelectedPaymentMethod(method)
    // notify other components that payment selection changed
    try {
      window.dispatchEvent(new CustomEvent("paymentUpdated"))
      onPaymentUpdate?.()
    } catch (e) {
      // no-op
    }
    // setLoadingPaymentMethod(method)

    // try {
    //   await initiatePaymentSession(cart, {
    //     provider_id: method,
    //   })
    //   await new Promise(resolve => setTimeout(resolve, 200))
    //   onPaymentUpdate?.()
    // } catch (err) {
    // } finally {
    //   setLoadingPaymentMethod(null)
    // }
  }

  // const handleEsewaPayment = async () => {
  //   if (isProcessingEsewa || isProcessingKhalti) return

  //   const total = cart?.total || 0

  //   if (total <= 0) {
  //     toast({
  //       title: "Invalid Amount",
  //       description: "Invalid payment amount. Please check your cart.",
  //       variant: "destructive",
  //     })
  //     return
  //   }

  //   setIsProcessingEsewa(true)
  //   try {
  //     const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`

  //     // toast({
  //     //   title: "Processing Payment",
  //     //   description: "Initiating eSewa payment...",
  //     // })

  //     const response = await fetch("/api/initiate-payment", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         method: "esewa",
  //         amount: total.toString(),
  //         productName: `Order from Marketplace (${cart.items?.length || 0} items)`,
  //         transactionId: transactionId,
  //       }),
  //     })

  //     if (!response.ok) {
  //       throw new Error(`Payment initiation failed: ${response.statusText}`)
  //     }

  //     const paymentData = await response.json()

  //     toast({
  //       title: "Redirecting to eSewa",
  //       description: "Please complete your payment on eSewa...",
  //     })

  //     const form = document.createElement("form")
  //     form.method = "POST"
  //     form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form"

  //     const esewaPayload = {
  //       amount: paymentData.amount,
  //       tax_amount: paymentData.esewaConfig.tax_amount,
  //       total_amount: paymentData.esewaConfig.total_amount,
  //       transaction_uuid: paymentData.esewaConfig.transaction_uuid,
  //       product_code: paymentData.esewaConfig.product_code,
  //       product_service_charge: paymentData.esewaConfig.product_service_charge,
  //       product_delivery_charge: paymentData.esewaConfig.product_delivery_charge,
  //       success_url: paymentData.esewaConfig.success_url,
  //       failure_url: paymentData.esewaConfig.failure_url,
  //       signed_field_names: paymentData.esewaConfig.signed_field_names,
  //       signature: paymentData.esewaConfig.signature,
  //     }

  //     Object.entries(esewaPayload).forEach(([key, value]) => {
  //       const input = document.createElement("input")
  //       input.type = "hidden"
  //       input.name = key
  //       input.value = String(value)
  //       form.appendChild(input)
  //     })

  //     document.body.appendChild(form)
  //     form.submit()
  //     document.body.removeChild(form)
  //   } catch (error) {
  //     console.error("eSewa payment error:", error)
  //     toast({
  //       title: "Payment Failed",
  //       description: "Failed to initiate eSewa payment. Please try again.",
  //       variant: "destructive",
  //     })
  //     setIsProcessingEsewa(false)
  //   }
  // }

  // const handleKhaltiPayment = async () => {
  //   if (isProcessingEsewa || isProcessingKhalti) return

  //   const total = cart?.total || 0
  //   const cartId = cart?.id

  //   if (!cartId) {
  //     toast({
  //       title: "Cart Error",
  //       description: "Cart ID not found. Please refresh the page.",
  //       variant: "destructive",
  //     })
  //     return
  //   }

  //   if (total <= 0) {
  //     toast({
  //       title: "Invalid Amount",
  //       description: "Invalid payment amount. Please check your cart.",
  //       variant: "destructive",
  //     })
  //     return
  //   }

  //   setIsProcessingKhalti(true)
  //   try {
  //     const transactionId = `${cartId}_${Date.now()}`

  //     const response = await fetch("/api/initiate-payment", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         method: "khalti",
  //         amount: total.toString(),
  //         productName: `Order from Marketplace (${cart.items?.length || 0} items)`,
  //         transactionId: transactionId,
  //         cartId: cartId,
  //       }),
  //     })

  //     if (!response.ok) {
  //       const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
  //       console.error("Khalti API response error:", errorData)
  //       throw new Error(errorData.details || errorData.error || `Payment initiation failed: ${response.statusText}`)
  //     }

  //     const data = await response.json()

  //     if (!data.khaltiPaymentUrl) {
  //       throw new Error("Khalti payment URL not received")
  //     }

  //     window.location.href = data.khaltiPaymentUrl
  //   } catch (error) {
  //     console.error("Khalti payment error:", error)
  //     const errorMessage = error instanceof Error ? error.message : "Failed to initiate Khalti payment. Please try again."
  //     toast({
  //       title: "Payment Failed",
  //       description: errorMessage,
  //       variant: "destructive",
  //     })
  //     setIsProcessingKhalti(false)
  //   }
  // }

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const isProcessing = isProcessingEsewa || isProcessingKhalti

  return (
    <div className="max-w-md mx-auto mt-4 bg-white rounded-lg p-4 relative">
      {loadingPaymentMethod && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-myBlue border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-gray-700">
              Updating payment method...
            </p>
          </div>
        </div>
      )}

      <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-myBlue"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
        Payment Method
      </h2>

      {!paidByGiftcard && availablePaymentMethods?.length ? (
        <RadioGroup
  value={selectedPaymentMethod}
  onChange={setPaymentMethod}
  className="space-y-3 mb-4"
>
  {availablePaymentMethods.map((method) => {
    const isCodDisabled = isCod(method.id) && isMultiSeller
    const isDisabled =
      loadingPaymentMethod !== null || isProcessing || isCodDisabled

    return (
      <RadioGroup.Option
        key={method.id}
        value={method.id}
        disabled={isDisabled}
        className={({ checked }) =>
          [
            "relative rounded-lg border-2 transition-all",
            "p-4 flex flex-col gap-2",
            isDisabled
              ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
              : checked
              ? "border-myBlue bg-blue-50 cursor-pointer"
              : "border-gray-200 bg-white hover:border-gray-300 cursor-pointer",
          ].join(" ")
        }
      >
        {({ checked }) => (
          <>
            {/* Top row */}
            <div className="flex items-center gap-3">
              {/* Radio indicator (hidden when disabled) */}
              {!isDisabled && (
                <div className="flex-shrink-0">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      checked
                        ? "border-myBlue bg-myBlue"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {checked && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </div>
              )}

              {/* Label + icon */}
              <div className="flex-1 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  {paymentInfoMap[method.id]?.title || method.id}
                </span>

                {paymentInfoMap[method.id]?.icon && (
                  <span className="text-gray-500">
                    {paymentInfoMap[method.id]?.icon}
                  </span>
                )}
              </div>
            </div>

            {/* Disabled reason – full width, below */}
            {isCodDisabled && (
              <div className="pl-0">
                <p className="text-xs text-gray-500">
                  Not available for orders from multiple sellers
                </p>
              </div>
            )}
          </>
        )}
      </RadioGroup.Option>
    )
  })}
</RadioGroup>

      ) : paidByGiftcard ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">Paid by gift card</p>
        </div>
      ) : (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">No payment methods available</p>
        </div>
      )}
    </div>
  )
}

export default CartPaymentSection
