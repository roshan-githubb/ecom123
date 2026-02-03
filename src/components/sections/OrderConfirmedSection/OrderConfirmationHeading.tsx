'use client'
import { Heading } from "@medusajs/ui"

const OrderConfirmationHeading = () => {
    

    return (
        <>
            <Heading
                level="h1"
                className="flex flex-col gap-y-2 text-gray-800 mb-2"
            >
                <span className="text-2xl font-bold">Thank you!</span>
                <span className="text-base font-normal text-gray-600">Your order was placed successfully.</span>
            </Heading>
        </>
    )
}

export default OrderConfirmationHeading