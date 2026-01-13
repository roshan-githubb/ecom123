'use client'
import { Heading } from "@medusajs/ui"

const OrderConfirmationHeading = () => {
    

    return (
        <>
            <Heading
                level="h1"
                className="flex flex-col gap-y-3 text-ui-fg-base text-3xl mb-4"
            >
                <span>Thank you!</span>
                <span>Your order was placed successfully.</span>
            </Heading>
        </>
    )
}

export default OrderConfirmationHeading