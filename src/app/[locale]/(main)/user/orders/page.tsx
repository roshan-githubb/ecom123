import { UserNavigation } from "@/components/molecules"
// import { retrieveCustomer } from "@/lib/data/customer"
// import { listOrders } from "@/lib/data/orders"
import { OrderCard } from "@/components/molecules/OrderCard/OrderCard"
import { Button } from "@/components/atoms"
import { Input } from "@medusajs/ui"

const MOCK_ORDERS = [
  {
    id: "order_1",
    displayId: "123-4567890-1234567",
    createdAt: "12 December 2023",
    total: "€ 45.00",
    status: "Delivered 15 December 2023",
    items: [
      {
        id: "prod_1",
        title: "Wireless Noise Cancelling Headphones, Bluetooth 5.0 Over Ear Headset",
        thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
        quantity: 1,
        price: "€ 45.00",
      },
    ],
  },
  {
    id: "order_2",
    displayId: "234-5678901-2345678",
    createdAt: "20 November 2023",
    total: "€ 120.50",
    status: "Delivered 25 November 2023",
    items: [
      {
        id: "prod_2",
        title: "Smart Watch with Heart Rate Monitor, GPS, Waterproof Fitness Tracker",
        thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
        quantity: 1,
        price: "€ 80.00",
      },
      {
        id: "prod_3",
        title: "Portable Bluetooth Speaker, Waterproof, 24 Hour Playtime",
        thumbnail: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1000&auto=format&fit=crop",
        quantity: 1,
        price: "€ 40.50",
      },
    ],
  },
]

export default async function UserPage({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>
}) {
  // const user = await retrieveCustomer()
  // if (!user) return <LoginForm />
  // const orders = await listOrders()

  return (
    <main className="container">
      <div className="grid grid-cols-1 md:grid-cols-4 mt-6 gap-5 md:gap-8">
        {/* <UserNavigation /> */}
        <div className="md:col-span-3 space-y-6">
          <div className="flex flex-col gap-4">
            <h1 className="heading-md">Your Orders</h1>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="w-full sm:w-1/2">
                <Input placeholder="Search all orders" className="w-full" />
              </div>
              <Button className="w-full sm:w-auto bg-myBlue text-white rounded-full px-6">Search Orders</Button>
            </div>

            <div className="border-b border-secondary overflow-x-auto">
              <div className="flex gap-6 min-w-max">
                <button className="pb-2 border-b-2 border-action text-action font-medium text-sm">Orders</button>
                <button className="pb-2 border-b-2 border-transparent text-action hover:text-action-hover font-medium text-sm">Not Yet Shipped</button>
                <button className="pb-2 border-b-2 border-transparent text-action hover:text-action-hover font-medium text-sm">Cancelled Orders</button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-secondary">
              <span><span className="font-bold text-primary">{MOCK_ORDERS.length} orders</span> placed in</span>
              <select className="bg-component-secondary border border-secondary rounded-md px-2 py-1 text-sm">
                <option>past 3 months</option>
                <option>2023</option>
                <option>2022</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {MOCK_ORDERS.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
