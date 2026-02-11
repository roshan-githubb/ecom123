import { retrieveCartWithTimeout } from "@/lib/data/cart"
import { listCartShippingMethods } from "@/lib/data/fulfillment"
import { listCartPaymentMethods } from "@/lib/data/payment"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { CheckoutClient } from "@/components/sections/Checkout/CheckoutClient"

export default async function CheckoutPage() {
 
  const cart = await retrieveCartWithTimeout(3000)

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

  const hasAddress = cart.shipping_address && 
    cart.shipping_address.first_name && 
    cart.shipping_address.address_1

    // console.log('cart ', cart)
  let shippingMethods = null
  let paymentMethods = null

  if (hasAddress) {
    
    [shippingMethods, paymentMethods] = await Promise.all([
      listCartShippingMethods(cart.id || ''),
      listCartPaymentMethods(cart.region?.id ?? "")
    ])
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
