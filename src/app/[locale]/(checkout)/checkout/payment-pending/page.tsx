"use client"

import { Button } from "@/components/atoms"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { Clock } from "@medusajs/icons"
import { Container, Heading, Text } from "@medusajs/ui"
import { useSearchParams } from "next/navigation"

export default function PaymentPendingPage() {
  const searchParams = useSearchParams()

  const pidx = searchParams.get("pidx")
  const orderId = searchParams.get("order_id")

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <Container className="max-w-md text-center">
        <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <Heading level="h1" className="text-2xl mb-4">
          Payment Pending
        </Heading>
        <Text className="text-ui-fg-subtle mb-4">
          Your payment is being processed by Khalti. This may take a few moments.
        </Text>
        <Text className="text-ui-fg-subtle mb-6">
          If you completed the payment, please wait or check your order status.
          If payment was not completed, you can try again.
        </Text>
        <div className="flex flex-col gap-3">
          <LocalizedClientLink href="/checkout?step=payment">
            <Button variant="text" className="w-full">
              Try Again
            </Button>
          </LocalizedClientLink>
          <LocalizedClientLink href="/">
            <Button className="w-full">
              Continue Shopping
            </Button>
          </LocalizedClientLink>
        </div>
      </Container>
    </div>
  )
}
