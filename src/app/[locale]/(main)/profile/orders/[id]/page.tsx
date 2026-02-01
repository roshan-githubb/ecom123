import { retrieveCustomer } from "@/lib/data/customer"
import { Avatar, Button, Card } from "@/components/atoms"

import { ArrowLeftIcon } from "@/icons"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import { retrieveOrder, retrieveOrderSet } from "@/lib/data/orders"
import { OrderDetailsSection } from "@/components/sections/OrderDetailsSection/OrderDetailsSection"
import { SellerProps } from "@/types/seller"
import { HttpTypes } from "@medusajs/types"
import { OrderProductListItem } from "@/components/cells"
import { OrderAddresses } from "@/components/cells"
import { getOrderDisplayStatus, getOrderStatusColor } from "@/lib/helpers/order-status"
import { cn } from "@/lib/utils"



export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  console.log('id ', id)

  const user = await retrieveCustomer()

  const order = (await retrieveOrder(id)) as HttpTypes.StoreOrder & {
    seller: SellerProps
  }

  if (!user || !order) return redirect("/profile")

  const { seller } = order

  const displayStatus = getOrderDisplayStatus(
    order.status,
    order.fulfillment_status
  )

  console.log('order detail ', user, order)

  return (
    <main className="container">
      <h1 className="heading-md uppercase">Order #{order.display_id}</h1>
      <div className="w-full max-w-full">
        {seller && <div className="flex items-center gap-2">
          <div className="flex items-center justify-between text-secondary border border-primary py-4 px-4 rounded-sm w-full">
            <Avatar src={seller?.photo} size="large" />
            <h2 className="heading-sm uppercase  text-primary">
              {seller?.name}
            </h2>
          </div>
          <div className="flex justify-end">
            {/* <Chat
                  user={user}
                  seller={seller}
                  order_id={order.id}
                  subject={`Order #${order.display_id}: ${
                    order.items?.[0]?.product_title
                  } ${
                    order.items?.length && order.items.length > 1
                      ? `+${order.items.length - 1}`
                      : ""
                  }`}
                /> */}
          </div>
        </div>}
        <div className="my-4"></div>
        <div className="flex items-center justify-between text-secondary border border-primary bg-component-secondary py-6 px-4 rounded-sm w-full ">
          <div className="flex items-center gap-3">
            <h2 className="heading-sm uppercase text-secondary">
              Status:
            </h2>
            <span
              className={cn(
                "px-3 py-1 text-sm rounded-full font-medium border",
                getOrderStatusColor(displayStatus)
              )}
            >
              {displayStatus}
            </span>
          </div>
          <div className="flex justify-end">
            <h2 className="label-md text-secondary">
              Order date:{" "}
              <span className="text-primary">
                {format(order.created_at || "", "yyyy-MM-dd")}
              </span>
            </h2>
          </div>
        </div>

        <div className="my-4"></div>
        <Card className="px-4 pt-6 space-y-4">
          {order.items?.map((item) => (
            <OrderProductListItem
              key={item.id + item.variant_id}
              item={item}
              currency_code={order.currency_code}
            />
          ))}
        </Card>
        <div className="my-4"></div>
      </div>
      <OrderAddresses singleOrder={order} />
    </main>
  )
}
