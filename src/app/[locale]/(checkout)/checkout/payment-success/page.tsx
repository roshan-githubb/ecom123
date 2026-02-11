"use client"

import { Button } from "@/components/atoms"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { placeOrder } from "@/lib/data/cart"
import { useCartStore } from "@/store/useCartStore"
import { CheckCircleSolid } from "@medusajs/icons"
import { Container, Heading, Text } from "@medusajs/ui"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null)

  const pidx = searchParams.get("pidx")
  const transactionId = searchParams.get("transaction_id")
  const orderId = searchParams.get("order_id")
  const status = searchParams.get("status")

  useEffect(() => {
    const completeOrder = async () => {
      try {
        // Get cart ID from localStorage (stored before redirect)
        const cartId = localStorage.getItem("khalti_cart_id")

        if (!cartId) {
          setError("Cart session expired. Please try again.")
          setIsProcessing(false)
          return
        }

        // Complete the order
        const result = await placeOrder(cartId)

        // Clear the stored cart ID
        localStorage.removeItem("khalti_cart_id")

        localStorage.removeItem("cart_id")
        localStorage.removeItem("global-cart")
        useCartStore.getState().reset()

        // Navigate to order confirmation

        // Check if order was placed successfully
        console.log("Order placement result:", result)
        if (result?.success && result?.orderId) {
          setSuccessOrderId(result.orderId)
          setIsProcessing(false)
          // setTimeout(() => {
          //   router.push(`/order-summary?order_id=${result.orderId}`)
          // }, 2000)
        } else if (result?.error) {
          setError(result.message || "Failed to complete order")
          setIsProcessing(false)
        } else {
          setError("Unexpected response from order completion")
          setIsProcessing(false)
        }
      } catch (err: any) {
        // NEXT_REDIRECT is expected when placeOrder redirects
        if (err.message !== "NEXT_REDIRECT") {
          setError(err.message || "Failed to complete order")
          setIsProcessing(false)
        }
      }
    }

    if (status === "success") {
      completeOrder()
    } else {
      setIsProcessing(false)
    }
  }, [status, router])

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ui-fg-base"></div>
        <Text className="text-ui-fg-subtle">Processing your payment...</Text>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <Container className="max-w-md text-center">
          <Heading level="h1" className="text-2xl mb-4">
            Payment Error
          </Heading>
          <Text className="text-ui-fg-subtle mb-6">{error}</Text>
          <LocalizedClientLink href="/cart">
            <Button variant="text">Return to Cart</Button>
          </LocalizedClientLink>
        </Container>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4 bg-gray-50">
      <Container className="w-full max-w-md">
        <div className="rounded-2xl bg-white shadow-sm border border-gray-200 p-6 text-center">
          {/* Success Icon */}
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-7 w-7 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Heading */}
          <Heading level="h1" className="text-2xl font-semibold mb-2">
            Payment Successful
          </Heading>

          <Text className="text-sm text-ui-fg-subtle mb-6">
            Your payment was completed successfully. We’re processing your order
            now.
          </Text>

          {/* Order Info */}
          <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-left space-y-1 mb-6">
            <div className="flex flex-col text-sm">
              <span className="text-gray-500">Transaction ID</span>
              <span className="font-medium text-gray-900">{transactionId}</span>
            </div>
            <div className="my-4"></div>
            <div className="flex flex-col text-sm">
              <span className="text-gray-500">Order ID</span>
              <span className="font-medium text-gray-900">{orderId}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <LocalizedClientLink href={`/profile/orders`} className="w-full">
              <button className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
                View Order
              </button>
            </LocalizedClientLink>

            <LocalizedClientLink href="/" className="w-full">
              <button className="w-full rounded-md bg-myBlue px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition">
                Continue Shopping
              </button>
            </LocalizedClientLink>
          </div>
        </div>
      </Container>
    </div>
  )
}
