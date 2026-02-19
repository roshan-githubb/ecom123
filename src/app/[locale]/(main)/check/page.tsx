"use client"

import { useEffect, useState, Suspense } from "react"
import { useCartStore } from "@/store/useCartStore"
import { retrieveCart } from "@/lib/data/cart"
import { listCartShippingMethods } from "@/lib/data/fulfillment"
import { listCartPaymentMethods } from "@/lib/data/payment"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { CheckoutClient } from "@/components/sections/Checkout/CheckoutClient"
import { CheckoutSkeleton } from "@/components/organisms/CartSkeleton/CartSkeleton"

function CheckoutContent() {
  const [cart, setCart] = useState<any>(null)
  const [shippingMethods, setShippingMethods] = useState<any>(null)
  const [paymentMethods, setPaymentMethods] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const fetchCartStore = useCartStore((state) => state.fetchCart)

  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        await fetchCartStore()
        const freshCart = await retrieveCart()
        
        if (!freshCart || !freshCart.items || freshCart.items.length === 0) {
          setCart(null)
          setIsLoading(false)
          return
        }

        setCart(freshCart)

        const hasAddress = freshCart.shipping_address && 
          freshCart.shipping_address.first_name && 
          freshCart.shipping_address.address_1

        if (hasAddress) {
          const [shipping, payment] = await Promise.all([
            listCartShippingMethods(freshCart.id || ''),
            listCartPaymentMethods(freshCart.region?.id ?? "")
          ])
          setShippingMethods(shipping)
          setPaymentMethods(payment)
        }
      } catch (error) {
        console.error('Failed to load checkout data:', error)
        setCart(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadCheckoutData()
  }, [fetchCartStore])

  if (isLoading) {
    return <CheckoutSkeleton />
  }

  // Show empty cart message if cart is empty
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>

          <h2 className="mb-2 text-lg font-semibold text-myBlue">
            Your cart is empty
          </h2>
          <p className="mb-6 text-sm text-gray-500">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>

          <LocalizedClientLink
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-myBlue px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 font-poppins"
          >
            Continue shopping
          </LocalizedClientLink>
        </div>
      </div>
    )
  }

  return (
    <CheckoutClient
      initialCart={cart}
      initialShippingMethods={shippingMethods}
      initialPaymentMethods={paymentMethods}
      shippingAddress={cart.shipping_address}
    />
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutContent />
    </Suspense>
  )
}
