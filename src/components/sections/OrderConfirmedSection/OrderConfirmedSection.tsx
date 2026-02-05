import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import OrderConfirmationHeading from "./OrderConfirmationHeading"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

export const OrderConfirmedSection = ({
  order,
}: {
  order: HttpTypes.StoreOrder
}) => {
  console.log("order confirmed section order:", order)
  return (
    <div className="py-6">
      <div className="content-container flex flex-col justify-center items-center gap-y-10 max-w-4xl h-full w-full mx-auto">
        <div
          className="flex flex-col gap-4 max-w-4xl h-full bg-white w-full py-10"
          data-testid="order-complete-container"
        >
          <div className="text-center w-full space-y-3">
            <OrderConfirmationHeading/>
            <Text className="text-sm text-gray-600 px-4">
              We have sent the order confirmation details to{" "}
              <span
                className="text-gray-900 font-medium"
                data-testid="order-email"
              >
                {order.email}
              </span>
            </Text>
          </div>

          <div className="flex flex-row gap-3 justify-center items-center w-full mt-6 px-4">
            <LocalizedClientLink href={`/profile/orders/${order.id}`}>
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
          
          {/* <OrderDetails order={order} />
          <OrderItems order={order} />
          <OrderTotals totals={order} />
          <OrderShipping order={order} /> */}
          {/*<PaymentDetails order={order} />
          <Help /> */}
        </div>
      </div>
    </div>
  )
}
