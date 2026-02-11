"use client"

import { Button } from "@/components/atoms"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { XCircleSolid } from "@medusajs/icons"
import { Container, Heading, Text } from "@medusajs/ui"
import { useSearchParams } from "next/navigation"

export default function PaymentFailedPage() {
  const searchParams = useSearchParams()

  const pidx = searchParams.get("pidx")
  const orderId = searchParams.get("order_id")
  const status = searchParams.get("status")

  const getStatusMessage = (status: string | null) => {
    switch (status) {
      case "User canceled":
        return "You cancelled the payment."
      case "Expired":
        return "The payment session has expired."
      default:
        return "The payment could not be completed."
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <Container className="max-w-md text-center">
        <XCircleSolid className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <Heading level="h1" className="text-2xl mb-4">
          Payment Failed
        </Heading>
        <Text className="text-ui-fg-subtle mb-6">
          {getStatusMessage(status)}
        </Text>
        <div className="flex flex-col gap-3">
          <LocalizedClientLink href="/checkout?step=payment">
            <Button variant="text" className="w-full">
              Try Again
            </Button>
          </LocalizedClientLink>
          <LocalizedClientLink href="/cart">
            <Button className="w-full">
              Return to Cart
            </Button>
          </LocalizedClientLink>
        </div>
      </Container>
    </div>
  )
}
