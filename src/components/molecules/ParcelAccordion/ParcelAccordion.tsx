"use client"

import { Button, Card } from "@/components/atoms"
import { CalendarIcon, CollapseIcon } from "@/icons"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { format } from "date-fns"
import { convertToLocale } from "@/lib/helpers/money"
import { getOrderDisplayStatus, getOrderStatusColor } from "@/lib/helpers/order-status"
import {
  Package,
  Layers,
  Hash,
  Banknote,
} from "lucide-react"

export const ParcelAccordion = ({
  orderId,
  orderDisplayId,
  createdAt,
  total,
  currency_code = "eur",
  items,
  status,
  fulfillmentStatus,
  defaultOpen = false,
}: {
  orderId: string
  orderDisplayId: string
  createdAt: string | Date
  total: number
  currency_code?: string
  items: any[]
  status?: string
  fulfillmentStatus?: string
  defaultOpen?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [height, setHeight] = useState(0)
  const contentRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight)
    }
  }, [items])

  const displayStatus = status && fulfillmentStatus 
    ? getOrderDisplayStatus(status, fulfillmentStatus)
    : status 
      ? formatOrderStatus(status)
      : "Unknown"

  return (
    <>
     <div className="border border-gray-300 bg-component-secondary rounded-md px-4 py-3">
  <div className="flex items-start justify-between gap-4">
    {/* LEFT */}
    <div className="flex flex-col gap-2">
      {/* Order ID */}
      <h2 className="text-sm font-semibold text-secondary">
        ORDER {orderDisplayId}
      </h2>

      {/* Status (right below ID) */}
      {displayStatus && (
        <span
          className={cn(
            "w-fit px-2.5 py-0.5 text-xs rounded-full font-medium border",
            getOrderStatusColor(displayStatus)
          )}
        >
          {displayStatus}
        </span>
      )}

      {/* Meta info */}
      <div className="flex justify-between gap-4 text-xs text-muted-foreground mt-1 w-full">
        {/* Date */}
        <div className="flex justify-between gap-1.5">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>{format(new Date(createdAt), "MMM dd, yyyy")}</span>
        </div>

        {/* Total */}
        <div className="flex justify-between gap-1.5 font-medium text-secondary">
          <Banknote className="w-3.5 h-3.5" />
          <span>
            {convertToLocale({ amount: total, currency_code })}
          </span>
        </div>
      </div>
    </div>

    <div className="flex flex-col items-end gap-2 shrink-0">
      <LocalizedClientLink
        href={`/profile/orders/${orderId}`}
        className="inline-flex items-center justify-center rounded-md bg-myBlue px-3 py-1.5 text-xs font-medium text-white hover:bg-myBlue/90 transition-colors min-h-[32px]"
      >
        View order
      </LocalizedClientLink>

      {/* Cancel Order to be implemented */}
      {/*
      {displayStatus === "pending" && (
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-red-500 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors min-h-[32px]"
          onClick={handleCancelOrder}
        >
          Cancel order
        </button>
      )}
      */}
    </div>
  </div>
</div>


    
    </>
  )
}


export const formatOrderStatus = (status: string) => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

