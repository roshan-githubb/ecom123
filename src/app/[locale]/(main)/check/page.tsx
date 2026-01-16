

"use client"

import { OrderSummary, RememberUserInfo } from "@/components/organisms/CartSummary/CartItemSummary"
import CartShippingMethodsSection from "@/components/sections/CartShippingMethodsSection/CartShippingMethodsSection"
import DeliveryAddress from "@/components/sections/Checkout/DeliveryAddress"
import { retrieveCart } from "@/lib/data/cart"
import { listCartShippingMethods } from "@/lib/data/fulfillment"
import { listCartPaymentMethods } from "@/lib/data/payment"
import { Suspense, useEffect, useState } from "react"
import { CheckoutSkeleton } from "@/components/organisms/CartSkeleton/CartSkeleton"
import CartPaymentSection from "@/components/sections/CartPaymentSection/CartPaymentSection"
import { AddVariantSheet } from "@/components/molecules/AddVariantModal/AddVariantModal"
import { useProductModalStore } from "@/store/useProductModalStore"
import { useParams } from "next/navigation"


export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutPageComponent />
    </Suspense>
  )
}

function CheckoutPageComponent() {
  const [cart, setCart] = useState<any>(null)
  const [shippingMethods, setShippingMethods] = useState<any>(null)
  const [paymentMethods, setPaymentMethods] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { isOpen, product, closeModal } = useProductModalStore()
  const params = useParams()
  const locale = params?.locale as string || 'np'

  useEffect(() => {
    async function loadData() {
      try {
        const cartData = await retrieveCart()
        setCart(cartData)
        
        if (cartData) {
          const shipping = await listCartShippingMethods(cartData.id || '')
          const payment = await listCartPaymentMethods(cartData.region?.id ?? "")
          setShippingMethods(shipping)
          setPaymentMethods(payment)
        }
      } catch (error) {
        console.error('Failed to load checkout data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return <CheckoutSkeleton />
  }

  return (
    <div className="min-h-screen pb-8 overflow-x-hidden">
      <main className="max-w-md mx-auto relative z-0">
        <DeliveryAddress />
        <div className="my-4"></div>
        {cart && (
          <CartShippingMethodsSection
            cart={cart}
            availableShippingMethods={shippingMethods as any}
          />
        )}
        <OrderSummary />
      </main>
      {cart && (
        <CartPaymentSection
          cart={cart}
          availablePaymentMethods={paymentMethods}
        />
      )}
      <RememberUserInfo />
      
      {/* Global Product Modal */}
      {isOpen && product && (
        <AddVariantSheet
          product={product}
          cardPos={{ top: 0, left: 0, width: 0, height: 0 }}
          onClose={closeModal}
          products={[product]}
          currentProductIndex={0}
          onProductChange={() => {}}
        />
      )}
    </div>
  )
}
