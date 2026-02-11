"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { initiatePaymentSession, retrieveCart } from "@/lib/data/cart"
import { CheckoutSkeleton } from "@/components/organisms/CartSkeleton/CartSkeleton"
import { convertToLocale } from "@/lib/helpers/money"
import { MapPin, Truck, CreditCard, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { placeOrder } from "@/lib/data/cart"
import { useCartStore } from "@/store/useCartStore"
import { paymentInfoMap } from "@/lib/constants"
import { AuthErrorModal } from "@/components/molecules/InvalidAuthModal/InvalidAuthModal"

function OrderSummaryPage() {
  const [cart, setCart] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [showAuthInvalidModal, setShowAuthInvalidModal] = useState(false)
  
  const router = useRouter()


  useEffect(() => {
    async function loadCart() {
      try {
        const cartData = await retrieveCart()
        setCart(cartData)
      } catch (error) {
        console.error("Failed to load cart:", error)
        router.push("/check")
      } finally {
        setLoading(false)
      }
    }
    loadCart()
  }, [router])

  useEffect(() => {
    if (!loading) {
      if (!cart || !cart.items || cart.items.length === 0) {
        router.push("/check")
      }
    }
  }, [cart, loading, router])

  
  useEffect(() => {
    async function loadCart() {
      try {
        const cartData = await retrieveCart()
        setCart(cartData)
      } catch (error) {
        console.error("Failed to load cart:", error)
        router.push("/check")
      } finally {
        setLoading(false)
      }
    }
    loadCart()
  }, [router])

  const getPaymentProvider = () => cart?.payment_collection?.payment_sessions[0]?.provider_id

  const initializeKhaltiPayment = async (): Promise<string | null> => {
    const response = await initiatePaymentSession(cart, {
      provider_id: "pp_khalti_khalti",
    })
    return (response?.payment_collection?.payment_sessions?.[0]?.data as any)?.payment_url || null
  }

  const handleKhaltiPayment = async () => {
    try {
      const paymentUrl = await initializeKhaltiPayment()
      if (!paymentUrl) {
        console.error("Failed to get Khalti payment URL")
        throw new Error("Payment initialization failed")
      }
      localStorage.setItem("khalti_cart_id", cart.id)
      window.location.href = paymentUrl
    } catch (error: any) {
      console.error("Khalti payment error:", error)
      const { cartToast } = await import("@/lib/cart-toast")
      cartToast.showErrorToast(error.message || "Failed to initialize payment")
      setIsPlacingOrder(false)
    }
  }

  const clearCartData = () => {
    localStorage.removeItem("cart_id")
    localStorage.removeItem("global-cart")
    useCartStore.getState().reset()
  }

  const handleRegularPayment = async () => {
    try {
      const res = await placeOrder()

      if (res?.status === 401) {
        setShowAuthInvalidModal(true)
        return
      }

      if (res?.success) {
        clearCartData()
        router.push(`/order/${res.orderId}/confirmed`)
      } else {
        throw new Error("Order placement failed")
      }
    } catch (error: any) {
      console.error("Order placement error:", error)
      const { cartToast } = await import("@/lib/cart-toast")
      cartToast.showErrorToast(error.message || "Failed to place order. Please try again.")
      setIsPlacingOrder(false)
    }
  }

  const handleConfirmOrder = async () => {
    setIsPlacingOrder(true)
    const paymentProvider = getPaymentProvider()

    if (paymentProvider === "pp_khalti_khalti") {
      await handleKhaltiPayment()
    } else {
      await handleRegularPayment()
    }
  }

  if (loading) {
    return <CheckoutSkeleton />
  }


  if (!cart || !cart.items || cart.items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-myBlue text-white p-4">
          <h1 className="text-lg font-semibold text-center">Order Summary</h1>
        </div>

        <div className="p-4 space-y-6">
          {/* Delivery Address */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-myBlue" />
              <h2 className="font-semibold text-gray-900">Delivery Address</h2>
            </div>
            {cart.shipping_address ? (
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900">
                  {cart.shipping_address.first_name}{" "}
                  {cart.shipping_address.last_name}
                </p>
                <p>
                  {cart.shipping_address.address_1},{" "}
                  {cart.shipping_address.postal_code}
                </p>
                {cart.shipping_address.address_2 && (
                  <p>{cart.shipping_address.address_2}</p>
                )}
                <p>
                  {cart.shipping_address.city}, {cart.shipping_address.province}
                </p>
                <p>{cart.shipping_address.phone}</p>
              </div>
            ) : (
              <p className="text-sm text-red-600">No address selected</p>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBag className="w-5 h-5 text-myBlue" />
              <h2 className="font-semibold text-gray-900">
                Order Items ({cart.items.length})
              </h2>
            </div>
            <div className="space-y-3">
              {cart.items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-3">
                  <Image
                    src={
                      item.thumbnail ||
                      "/images/not-available/not-available.png"
                    }
                    alt={item.title}
                    width={50}
                    height={50}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {item.title}
                    </p>
                    {item.variant?.title && (
                      <p className="text-xs text-gray-500">
                        {item.variant.title}
                      </p>
                    )}
                    <p className="text-xs text-gray-600">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {convertToLocale({
                      amount: item.unit_price * item.quantity,
                      currency_code: cart.currency_code,
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Methods */}
          {cart.shipping_methods && cart.shipping_methods.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Truck className="w-5 h-5 text-myBlue" />
                <h2 className="font-semibold text-gray-900">
                  Shipping Methods
                </h2>
              </div>
              <div className="space-y-2">
                {cart.shipping_methods.map((method: any) => (
                  <div
                    key={method.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-gray-600">{method.name}</span>
                    <span className="font-medium">
                      {convertToLocale({
                        amount: method.amount,
                        currency_code: cart.currency_code,
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Method */}
          {cart.payment_collection?.payment_sessions && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-5 h-5 text-myBlue" />
                <h2 className="font-semibold text-gray-900">Payment Method</h2>
              </div>
              {cart.payment_collection.payment_sessions
                .filter((session: any) => session.status === "pending")
                .map((session: any) => (
                  <p key={session.id} className="text-sm text-gray-600">
                    {paymentInfoMap[session.provider_id]?.title ||
                      session.provider_id}
                  </p>
                ))}
            </div>
          )}

          {/* Order Total */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>
                  {convertToLocale({
                    amount: cart.subtotal,
                    currency_code: cart.currency_code,
                  })}
                </span>
              </div>
              {cart.shipping_total > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span>
                    {convertToLocale({
                      amount: cart.shipping_total,
                      currency_code: cart.currency_code,
                    })}
                  </span>
                </div>
              )}
              {cart.tax_total > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span>
                    {convertToLocale({
                      amount: cart.tax_total,
                      currency_code: cart.currency_code,
                    })}
                  </span>
                </div>
              )}
              <div className="border-t border-gray-300 pt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-myBlue">
                    {convertToLocale({
                      amount: cart.total,
                      currency_code: cart.currency_code,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <button
              onClick={handleConfirmOrder}
              disabled={isPlacingOrder}
              className={` rounded-2xl transition-colors duration-200 bg-myBlue text-white w-full h-9 font-medium text-sm hover:opacity-90 flex items-center justify-center gap-2 ${
                isPlacingOrder ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isPlacingOrder ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Placing Order...
                </>
              ) : (
                "Confirm Order"
              )}
            </button>

            <button
              onClick={() => router.back()}
              disabled={isPlacingOrder}
              className=" rounded-2xl transition-colors duration-200 bg-gray-300 text-gray-800 w-full h-9 font-medium text-sm hover:bg-gray-200 disabled:opacity-50"
            >
              Back to Checkout
            </button>
          </div>
        </div>
      </div>
      <AuthErrorModal
        open={showAuthInvalidModal}
        onOpenChange={setShowAuthInvalidModal}
      />
    </div>
  )
}

export default OrderSummaryPage
