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
import { useParams, useRouter } from "next/navigation"


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
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { isOpen, product, closeModal } = useProductModalStore()
  const params = useParams()
  const router = useRouter()
  const locale = params?.locale as string || 'np'

  const loadData = async () => {

    try {
      const cartData = await retrieveCart()
      setCart(cartData)

      if (cartData) {
        const [shipping, payment] = await Promise.all([
          listCartShippingMethods(cartData.id || ''),
          listCartPaymentMethods(cartData.region?.id ?? "")
        ])

        setShippingMethods(shipping)
        setPaymentMethods(payment)
      } else {
        setCart(null)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [refreshTrigger])

  const handleAddressUpdate = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleShippingUpdate = async () => {
    await loadData()
  }

  if (loading) {
    return <CheckoutSkeleton />
  }

  // Show empty cart message if cart is empty
  if (cart && cart.items && cart.items.length === 0) {
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
            Looks like you haven't added anything to your cart yet.
          </p>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex items-center justify-center rounded-lg bg-myBlue px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            Continue shopping
          </button>
        </div>
      </div>
    )
  }



  return (
    <div className="min-h-screen pb-8 overflow-x-hidden">
      <main className="max-w-md mx-auto relative z-0">
        <OrderSummary />
        <DeliveryAddress onAddressUpdate={handleAddressUpdate} />
        <div className="my-4"></div>
        {cart && shippingMethods && (
          <CartShippingMethodsSection
            cart={cart}
            availableShippingMethods={shippingMethods as any}
            onShippingUpdate={handleShippingUpdate}
          />
        )}
      </main>
      {cart && paymentMethods && (
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
          onProductChange={() => { }}
        />
      )}
    </div>
  )
}
