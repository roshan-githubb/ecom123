'use client'
import { Package, ShoppingBag } from 'lucide-react'
import React from 'react'
import LocalizedLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { listOrders } from '@/lib/data/orders'
import { LoginForm } from '@/components/molecules'
import { retrieveCustomer } from '@/lib/data/customer'


const OrderHistory = () => {
const [recentOrders, setRecentOrders] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isLoggedIn, setIsLoggedIn] = React.useState(true)

  React.useEffect(() => {
    const load = async () => {
      const user = await retrieveCustomer()

      if (!user) {
        // setIsLoggedIn(false)
        setLoading(false)
        return
      }

      const orders = await listOrders()
      setRecentOrders(orders.orders || [])
      setLoading(false)
    }

    load()
  }, [])
  console.log("Recent Orders:", recentOrders)

  if (loading) return <div>Loading…</div>
  if (!isLoggedIn) return <LoginForm />

    return (
        <div className="space-y-3">
            {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                <ShoppingBag className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium text-sm">Order #{order.display_id}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            {/* <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                {formatOrderStatus(order.status)}
                            </span> */}
                            <p className="text-sm font-medium mt-1">
                                ${(order.total / 100).toFixed(2)}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-4 text-gray-500">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No orders yet</p>
                    <LocalizedLink href="/">
                        <button className="text-blue-600 text-sm hover:underline mt-1">
                            Start shopping
                        </button>
                    </LocalizedLink>
                </div>
            )}
        </div>
    )
}

export default OrderHistory