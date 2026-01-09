

import { OrderSummary, RememberUserInfo } from "@/components/organisms/CartSummary/CartItemSummary"
import CartShippingMethodsSection from "@/components/sections/CartShippingMethodsSection/CartShippingMethodsSection"
import DeliveryAddress from "@/components/sections/Checkout/DeliveryAddress"
import { retrieveCart } from "@/lib/data/cart"
import { listCartShippingMethods } from "@/lib/data/fulfillment"
import { listCartPaymentMethods } from "@/lib/data/payment"
import { Metadata } from "next"
import { Suspense } from "react"
import { 
  CheckoutSkeleton
} from "@/components/organisms/CartSkeleton/CartSkeleton"
import CartPaymentSection from "@/components/sections/CartPaymentSection/CartPaymentSection"


export const metadata: Metadata = {
  title: "Checkout",
  description: "My cart page - Checkout",
}

export default async function CheckoutPage({ }) {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutPageComponent />
    </Suspense>
  )
}

async function CheckoutPageComponent({ }) {
  // Fetch all data together to prevent partial loading states
  const cart = await retrieveCart()
  const shippingMethods = await listCartShippingMethods(cart?.id || '')
  const paymentMethods = await listCartPaymentMethods(cart?.region?.id ?? "")

  return (
    <div className="min-h-screen pb-8 overflow-x-hidden">
      <main className="max-w-md mx-auto relative">
        <DeliveryAddress />
        <div className="my-4"></div>

        <OrderSummary />
        
        {cart && (
          <CartShippingMethodsSection
            cart={cart}
            availableShippingMethods={shippingMethods as any}
          />
        )}
      </main>

       
      
      {cart && (
        <CartPaymentSection
          cart={cart}
          availablePaymentMethods={paymentMethods}
        />
      )}
      
      <RememberUserInfo />
    </div>
  )
}
