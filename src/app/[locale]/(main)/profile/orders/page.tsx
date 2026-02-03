import { LoginForm } from "@/components/molecules"
import { retrieveCustomer } from "@/lib/data/customer"
import { OrdersPagination } from "@/components/sections"
import { isEmpty } from "lodash"
import { listOrders } from "@/lib/data/orders"
import { OrdersPageClient } from "./OrdersPageClient"

export default async function UserPage() {
  const user = await retrieveCustomer()

  if (!user) return <LoginForm />

  const orders = await listOrders()

  return (
    <main className="container">
      <div className="flex justify-center">
        <div className="md:col-span-3 w-full">
          {isEmpty(orders) ? (
            <div className="text-center space-y-4">
              <h1 className="heading-md capitalize">Order history</h1>
              <div>
                <h3 className="heading-lg text-primary uppercase">No orders</h3>
                <p className="text-lg text-secondary mt-2">
                  You haven&apos;t placed any order yet. Once you place an order,
                  it will appear here.
                </p>
              </div>
            </div>
          ) : (
            <>
              <OrdersPageClient orders={orders} />
              {/* TODO - pagination */}
              <OrdersPagination pages={1} />
            </>
          )}
        </div>
      </div>
    </main>
  )
}




