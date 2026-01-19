"use client"

import { Button, Card } from "@/components/atoms"
import { CalendarIcon, CollapseIcon } from "@/icons"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { format } from "date-fns"
import { convertToLocale } from "@/lib/helpers/money"
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
  defaultOpen = false,
}: {
  orderId: string
  orderDisplayId: string
  createdAt: string | Date
  total: number
  currency_code?: string
  items: any[]
  status?: string
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

  return (
    <>
      {/* HEADER */}
      <div
        onClick={() => setIsOpen((p) => !p)}
        className="border border-gray-400 bg-component-secondary rounded-sm px-4 py-3 cursor-pointer"
      >
        <div className="flex items-center justify-between gap-4">
          {/* LEFT */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-secondary">
                ORDER {orderDisplayId}
              </h2>

              {status && (
                <span
                  className={cn(
                    "px-2 py-0.5 text-xs rounded-full font-medium",
                    getStatusColor(status)
                  )}
                >
                  {formatOrderStatus(status)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {/* Date */}
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>{format(new Date(createdAt), "MMM dd, yyyy")}</span>
              </div>

              {/* Total */}
              <div className="flex items-center gap-1.5 font-medium text-secondary">
                <Banknote className="w-3.5 h-3.5" />
                <span>
                  {convertToLocale({ amount: total, currency_code })}
                </span>
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-1">
            <LocalizedClientLink href={`/profile/orders/${orderId}`}>
              <Button
                variant="tonal"
                className="bg-myBlue text-white hover:bg-myBlue/90 text-[12px] py-1"
                onClick={(e) => e.stopPropagation()}
              >
                View order
              </Button>

            </LocalizedClientLink>

            <CollapseIcon
              size={18}
              className={cn(
                "transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </div>
        </div>
      </div>

      {/* EXPANDED CONTENT */}
      <Card
        className="overflow-hidden transition-all"
        style={{
          maxHeight: isOpen ? `${height}px` : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        {isOpen && (
          <ul ref={contentRef} className="divide-y px-4 py-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between gap-4 py-3"
              >
                {/* LEFT */}
                <div className="flex gap-3">
                  <Package className="w-4 h-4 text-myBlue mt-0.5" />

                  <div className="text-sm">
                    <p className="font-medium text-secondary">
                      {item.title}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <Layers className="w-3 h-3" />
                      <span>{item.variant_title || "Default"}</span>

                      <Hash className="w-3 h-3 ml-2" />
                      <span>Qty {item.quantity}</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="text-sm font-medium text-secondary whitespace-nowrap">
                  {convertToLocale({
                    amount: item.total || item.unit_price * item.quantity,
                    currency_code,
                  })}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  )
}


export const formatOrderStatus = (status: string) => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'canceled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

