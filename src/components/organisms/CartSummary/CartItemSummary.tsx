"use client"

import React from "react"
import { useCartStore } from "@/store/useCartStore"
import { OrderSummaryData, OrderSummaryItem } from "@/lib/mapper/cartMapper";
import Image from "next/image";

interface OrderSummaryProps {
  summary: OrderSummaryData;
}

export interface OrderItem {
  id: string
  name: string
  variant: string
  price: number
  quantity: number
  imageUrl: string
  color?: string
  options?: Record<string, string>
}


const ItemCounter: React.FC<{ quantity: number; lineItemId: string }> = ({
  quantity,
  lineItemId
}) => {
  
  const increase = useCartStore((s) => s.increase)
  const decrease = useCartStore((s) => s.decrease)

  return (
    <div className="flex items-center gap-1">

      
      <button
        className="flex justify-center items-center w-6 h-6 text-sm font-semibold text-black border border-gray-300 rounded-full"
        onClick={() => decrease(lineItemId, quantity)}
      >
        <svg width="6" height="2" viewBox="0 0 6 2" fill="none">
          <path
            d="M5.08844 0.000187397V1.41619H0.000437528V0.000187397H5.08844Z"
            fill="#3E3E3E"
          />
        </svg>
      </button>

      <span className="text-sm font-semibold text-[#0000FF] w-4 text-center">
        {quantity}
      </span>

      <button
        className="flex justify-center items-center w-6 h-6 text-sm font-semibold text-black border border-gray-300 rounded-full"
        onClick={() => increase(lineItemId, quantity)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M15.061 12.46H12.793V14.788H11.209V12.46H8.94103V10.996H11.209V8.668H12.793V10.996H15.061V12.46Z"
            fill="#3E3E3E"
          />
        </svg>
      </button>

    </div>
  )
}

export default ItemCounter


const OrderRow: React.FC<{ item: OrderSummaryItem }> = ({ item }) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <Image
        className="w-[35px] h-[35px] sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px] rounded-[8px] md:rounded-[12px] lg:rounded-[16px] object-cover"
        src={item.thumbnail || "/images/not-available/not-available.png"}
        alt={item.title}
      />
      <div className="flex-1 min-w-0">
        <p className="text-[#444444] font-medium text-[12px] md:text-sm leading-tight truncate">
          {item.title}
        </p>
        <p className="text-[#888888] text-xs">{item?.variantTitle}</p>
        
      </div>
      <div className="mr-5">
        <ItemCounter quantity={item.quantity} lineItemId={item?.lineId} />
      </div>
      <span className="text-[#444444] font-semibold text-sm w-20 text-right">
        Rs {(item.unitPrice).toLocaleString()}
      </span>
    </div>
  )
}

export function OrderSummary({ summary }: OrderSummaryProps) { 
    console.log('order summary prop received ', summary)

  // const subtotal = items.reduce(
  //   (acc, item) => acc + item.price * item.quantity,
  //   0
  // )
  // const deliveryCharge = 100
  // const serviceFee = 50
  // const totalPayable = subtotal + deliveryCharge + serviceFee

  return (
    <div className="bg-white p-4 rounded-[16px] border border-[#F5F5F6] shadow-[0_4px_4px_rgba(0,0,0,0.25)] mx-4 md:mx-0 mt-6">
      <h2 className="text-lg font-semibold text-[#333333] mb-1">
        Order Summary
      </h2>
      <div className="pb-4 border-b border-gray-100 space-y-2">
        {summary.items.map((item) => (
          <OrderRow
            key={`${item.lineId}`}
            item={item}
          />
        ))}
      </div>
      <div className="pt-4 pb-4 border-b border-gray-100">
        <div className="flex justify-between items-center py-1">
          <span className="text-sm font-medium text-[#777777]">Subtotal</span>
          <span className="text-sm font-medium text-[#444444]">
            Rs {summary?.subtotal.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-sm font-medium text-[#777777]">
            Delivery Charge
          </span>
          <span className="text-sm font-medium text-[#FF0000]">
            Rs {summary?.deliveryFee.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-sm font-medium text-[#777777]">
            Tax Total
          </span>
          <span className="text-sm font-medium text-[#444444]">
            Rs {summary?.taxTotal.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="flex justify-between items-center pt-4">
        <span className="text-[#222222] font-medium text-base">
          Total Payable
        </span>
        <span className="text-[#222222] font-semibold text-lg">
          Rs {summary?.totalPayable.toLocaleString()}
        </span>
      </div>
    </div>
  )
}