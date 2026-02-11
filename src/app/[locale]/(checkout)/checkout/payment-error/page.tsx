"use client"

import { Button } from "@/components/atoms"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { ExclamationCircleSolid } from "@medusajs/icons"
import { Container, Heading, Text } from "@medusajs/ui"
import { useSearchParams } from "next/navigation"

export default function PaymentErrorPage() {
  const searchParams = useSearchParams()

  const error = searchParams.get("error")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "verification_failed":
        return "We could not verify your payment. Please contact support if the amount was deducted."
      default:
        return "An unexpected error occurred during payment processing."
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <Container className="max-w-md text-center">
        <ExclamationCircleSolid className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        <Heading level="h1" className="text-2xl mb-4">
          Payment Error
        </Heading>
        <Text className="text-ui-fg-subtle mb-6">{getErrorMessage(error)}</Text>
        <div className="flex flex-col gap-3">
          <LocalizedClientLink href="/checkout?step=payment">
            <Button variant="text" className="w-full">
              Try Again
            </Button>
          </LocalizedClientLink>
          <LocalizedClientLink href="/cart">
            <Button  className="w-full">
              Return to Cart
            </Button>
          </LocalizedClientLink>
        </div>
      </Container>
    </div>
  )
}
