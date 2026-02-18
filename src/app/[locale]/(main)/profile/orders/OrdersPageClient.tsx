"use client"

import { ParcelAccordion } from "@/components/molecules"
import { RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"

interface OrdersPageClientProps {
  orders: Array<
    HttpTypes.StoreOrder & {
      seller: { id: string; name: string; reviews?: any[] }
    }
  >
}

export function OrdersPageClient({ orders }: OrdersPageClientProps) {
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      router.refresh()
      setLastRefresh(new Date())
    } finally {
      setTimeout(() => setIsRefreshing(false), 500)
    }
  }

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const timeSinceLastRefresh = Date.now() - lastRefresh.getTime()
        if (timeSinceLastRefresh > 5 * 60 * 1000) {
          handleRefresh()
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [lastRefresh])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="heading-md capitalize">Order history</h1>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-myBlue hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
          aria-label="Refresh orders"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      <div className="w-full max-w-full flex flex-col gap-y-3">
        {orders.map((order) => (
          <ParcelAccordion
            key={order.id}
            orderId={order.id}
            // orderDisplayId={`#${order.display_id}`}
            createdAt={order.created_at}
            total={order.total}
            items={order.items || []}
            currency_code={order.currency_code}
            status={order.status}
            fulfillmentStatus={order.fulfillment_status}
          />
        ))}
      </div>
    </div>
  )
}
