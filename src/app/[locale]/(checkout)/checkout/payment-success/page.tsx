"use client"

import { Button } from "@/components/atoms"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { placeOrder } from "@/lib/data/cart"
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
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <Container className="max-w-md text-center">
        <CheckCircleSolid className="w-32 h-32 text-green-500 mx-auto mb-4" />
        <Heading level="h1" className="text-2xl mb-4">
          Payment Successful!
        </Heading>
        <Text className="text-ui-fg-subtle mb-2">
          Transaction ID: {transactionId}
        </Text>
        <Text className="text-ui-fg-subtle mb-2">
          Order ID: {orderId}
        </Text>
        <Text className="text-ui-fg-subtle mb-6">
          Your order has been received and is being processed.
        </Text>
        <div className="flex flex-row gap-3 justify-center items-center w-full mt-6 px-4">
            <LocalizedClientLink href={`/profile/orders}`}>
              <button 
                className="px-4 py-2 text-sm whitespace-nowrap rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              >
                Order Details
              </button>
            </LocalizedClientLink>
            
            <LocalizedClientLink href="/">
              <button 
                className="px-4 py-2 text-sm whitespace-nowrap rounded-md bg-myBlue text-white hover:opacity-90 transition-opacity"
              >
                Keep Shopping
              </button>
            </LocalizedClientLink>
          </div>
      </Container>
    </div>
  )
}
