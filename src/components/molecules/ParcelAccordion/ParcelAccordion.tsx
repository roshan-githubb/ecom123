"use client"

import { CalendarIcon } from "@/icons"
import { cn } from "@/lib/utils"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { format } from "date-fns"
import { convertToLocale } from "@/lib/helpers/money"
import { getOrderDisplayStatus, getOrderStatusColor } from "@/lib/helpers/order-status"
import { Store, ShoppingCart } from "lucide-react"

export const ParcelAccordion = ({
  orderId,
  createdAt,
  total,
  currency_code = "npr",
  items,
  status,
  fulfillmentStatus,
  vendorName = "Seller",
}: {
  orderId: string
  createdAt: string | Date
  total: number
  currency_code?: string
  items: any[]
  status?: string
  fulfillmentStatus?: string
  vendorName?: string
}) => {
  const displayStatus =
    status && fulfillmentStatus
      ? getOrderDisplayStatus(status, fulfillmentStatus)
      : status
        ? formatOrderStatus(status)
        : "Unknown"

  return (
    <div className="rounded-lg border border-gray-300 bg-component-secondary p-4 space-y-4">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
            <Store className="w-4 h-4" />
            {vendorName}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarIcon className="w-3.5 h-3.5" />
            {format(new Date(createdAt), "MMM dd, yyyy")}
          </div>
        </div>

        {displayStatus && (
          <span
            className={cn(
              "px-2.5 py-0.5 text-xs rounded-full font-medium border h-fit",
              getOrderStatusColor(displayStatus)
            )}
          >
            {displayStatus}
          </span>
        )}
      </div>

      {/* ITEMS */}
      <div className="divide-y">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 py-3 items-start"
          >
            {/* Image */}
            <img
              src={item.thumbnail}
              alt={item.product_title}
              className="w-14 h-14 rounded-md object-cover border shrink-0"
            />

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-sm font-medium text-secondary leading-snug line-clamp-2">
                {item.product_title}
              </p>

              <p className="text-xs text-muted-foreground">
                Qty {item.quantity} ×{" "}
                {convertToLocale({
                  amount: item.unit_price,
                  currency_code,
                })}
              </p>

              <div className="flex gap-2 mt-2">
                {/* <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-gray-100"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Buy again
                </button> */}

                {/*
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-md border border-red-400 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Return
                </button>
                */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Order total</p>
          <p className="text-sm font-semibold text-secondary">
            {convertToLocale({ amount: total, currency_code })}
          </p>
        </div>

        <LocalizedClientLink
          href={`/profile/orders/${orderId}`}
          className="inline-flex items-center justify-center rounded-md bg-myBlue px-4 py-2 text-xs font-medium text-white hover:bg-myBlue/90 transition-colors"
        >
          View details
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export const formatOrderStatus = (status: string) =>
  status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
