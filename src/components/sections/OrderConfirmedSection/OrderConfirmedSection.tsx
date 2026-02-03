import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import OrderConfirmationHeading from "./OrderConfirmationHeading"
import { Button } from "@/components/atoms/Button/Button"
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
              <Button 
                variant="tonal" 
                size="small"
                className="px-4 text-sm whitespace-nowrap"
              >
                Order Details
              </Button>
            </LocalizedClientLink>
            
            <LocalizedClientLink href="/">
              <Button 
                variant="filled" 
                size="small"
                className="px-4 text-sm whitespace-nowrap"
              >
                Keep Shopping
              </Button>
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
