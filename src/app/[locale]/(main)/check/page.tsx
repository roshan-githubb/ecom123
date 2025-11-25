"use client"

import React, { useState } from "react"
import { useCartStore } from "@/store/useCartStore"
import { useAddressStore } from "@/store/addressStore"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { MapPin, ChevronRight } from "lucide-react"

// Reusable Button
const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant: "primary" | "ghost"
  }
> = ({ variant, children, className = "", ...props }) => {
  const baseClasses = "font-semibold rounded-2xl transition-colors duration-200"
  const variantClasses =
    variant === "primary"
      ? "bg-[#0000FF] text-white w-full h-9 font-medium text-sm hover:bg-blue-700"
      : "bg-transparent text-indigo-600 hover:text-indigo-700 shadow-none p-0"
  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

// Item Counter
const ItemCounter: React.FC<{ productId: string; initial?: number }> = ({
  productId,
  initial = 1,
}) => {
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const product = items.find((i) => i.id === productId)
  const count = product?.quantity ?? initial

  return (
    <div className="flex items-center gap-1">
      <button
        className="flex justify-center items-center w-6 h-6 text-sm font-semibold text-black border border-gray-300 rounded-full"
        onClick={() => updateQuantity(productId, Math.max(count - 1, 0))}
      >
        <svg width="6" height="2" viewBox="0 0 6 2" fill="none">
          <path
            d="M5.08844 0.000187397V1.41619H0.000437528V0.000187397H5.08844Z"
            fill="#3E3E3E"
          />
        </svg>
      </button>
      <span className="text-sm font-semibold text-[#0000FF] w-4 text-center">
        {count}
      </span>
      <button
        className="flex justify-center items-center w-6 h-6 text-sm font-semibold text-black border border-gray-300 rounded-full"
        onClick={() => updateQuantity(productId, count + 1)}
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

// OrderRow
interface OrderItem {
  id: string
  name: string
  variant: string
  price: number
  quantity: number
  imageUrl: string
  color?: string
  options?: Record<string, string>
}
const OrderRow: React.FC<{ item: OrderItem }> = ({ item }) => (
  <div className="flex items-center justify-between gap-2">
    <Image
      src={item.imageUrl}
      alt={item.name}
      width={60}
      height={60}
      className="w-[35px] h-[35px] sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px] rounded-[8px] md:rounded-[12px] lg:rounded-[16px] object-cover"
    />
    <div className="flex-1 min-w-0">
      <p className="text-[#444444] font-medium text-[12px] md:text-sm leading-tight truncate">
        {item.name}
      </p>
      {item.color ? (
        <p className="text-[#888888] text-xs">{item.color}</p>
      ) : item.variant ? (
        <p className="text-[#888888] text-xs">{item.variant}</p>
      ) : null}
    </div>
    <div className="mr-5">
      <ItemCounter productId={item.id} />
    </div>
    <span className="text-[#444444] font-semibold text-sm w-20 text-right">
      Rs {(item.price * item.quantity).toLocaleString()}
    </span>
  </div>
)

// Order Summary
const OrderSummarySection: React.FC<{ items: OrderItem[] }> = ({ items }) => {
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )
  const deliveryCharge = 100
  const serviceFee = 50
  const totalPayable = subtotal + deliveryCharge + serviceFee

  return (
    <div className="bg-white p-4 rounded-[16px] border border-[#F5F5F6] shadow-[0_4px_4px_rgba(0,0,0,0.25)] mx-4 md:mx-0 mt-6">
      <h2 className="text-lg font-semibold text-[#333333] mb-1">
        Order Summary
      </h2>
      <div className="pb-4 border-b border-gray-100 space-y-2">
        {items.map((item) => (
          <OrderRow
            key={`${item.id}-${JSON.stringify(item.options || {})}`}
            item={item}
          />
        ))}
      </div>
      <div className="pt-4 pb-4 border-b border-gray-100">
        <div className="flex justify-between items-center py-1">
          <span className="text-sm font-medium text-[#777777]">Subtotal</span>
          <span className="text-sm font-medium text-[#444444]">
            Rs {subtotal.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-sm font-medium text-[#777777]">
            Delivery Charge
          </span>
          <span className="text-sm font-medium text-[#FF0000]">
            Rs {deliveryCharge.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-sm font-medium text-[#777777]">
            Service Fee
          </span>
          <span className="text-sm font-medium text-[#444444]">
            Rs {serviceFee.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="flex justify-between items-center pt-4">
        <span className="text-[#222222] font-medium text-base">
          Total Payable
        </span>
        <span className="text-[#222222] font-semibold text-lg">
          Rs {totalPayable.toLocaleString()}
        </span>
      </div>
    </div>
  )
}

const UserDetailsSection: React.FC = () => {
  const router = useRouter()
  const addresses = useAddressStore((state) => state.addresses)
  const selectedIndex = useAddressStore((state) => state.selectedAddressIndex)
  const addr = selectedIndex !== undefined ? addresses[selectedIndex] : null

  return (
    <div className="bg-white p-4 rounded-[16px] border border-[#F5F5F6] shadow-[0_4px_4px_rgba(0,0,0,0.25)] flex flex-col gap-3 mx-4 md:mx-0 mt-4">
      {addr ? (
        <div>
          <div className="flex items-start gap-3">
            <div className="mt-1 flex-shrink-0">
              <div className="w-10 h-10 bg-[#e3e8ec] rounded-md flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] bg-[length:4px_4px]"></div>
                <MapPin className="w-5 h-5 text-[#2b5bf7] fill-[#2b5bf7] relative z-10" />
              </div>
            </div>
            <div
              className="flex-1 cursor-pointer"
              onClick={() => router.push("/in/shippinginfo")}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-gray-900">
                    {addr.name}
                  </span>
                  <span className="text-gray-400 text-[13px]">
                    {addr.phone}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 mt-8 flex-shrink-0" />
              </div>
              <div className="leading-snug">
                <span className="inline-block bg-[#2b5bf7] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] mr-1 align-middle">
                  {addr.label.toUpperCase()}
                </span>
                <span className="text-[13px] text-gray-600">
                  {`${addr.line1}${addr.line2 ? ", " + addr.line2 : ""}, ${
                    addr.district
                  }, ${addr.province}${
                    addr.landmark ? ", Near " + addr.landmark : ""
                  }`}
                </span>
              </div>
            </div>
          </div>
          <div
            className="flex items-start gap-3 pl-[52px]"
            onClick={() => router.push("/in/pickupaddress")}
          >
            <div className="flex-1 border-t border-gray-50 pt-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[13px] text-[#2b5bf7] font-medium leading-tight mb-0.5">
                    Collect your parcels from a nearby location at a minimal
                    delivery fee.
                  </p>
                  <p className="text-[11px] text-gray-400">
                    9 suggested collection point(s) nearby
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-between">
          <span className="text-gray-500 text-sm">Address not added</span>
          <Button
            variant="primary"
            className="px-4 py-2 w-auto min-w-[100px] text-sm"
            onClick={() => router.push("/in/shippinginfo")}
          >
            Add Address
          </Button>
        </div>
      )}
    </div>
  )
}

const CheckoutPage: React.FC = () => {
  const cartItems = useCartStore((state) => state.items)
  const [checked, setChecked] = useState(false)
  const router = useRouter()

  const items: OrderItem[] = cartItems.map((i) => ({
    id: i.id,
    name: i.title,
    variant: "",
    price: i.price,
    quantity: i.quantity ?? 1,
    imageUrl: i.image,
    color: i.color,
  }))

  if (!items.length)
    return <div className="text-center mt-10">Your cart is empty</div>

  return (
    <div className="min-h-screen pb-8 overflow-x-hidden">
      <main className="max-w-md mx-auto relative z-0">
        <UserDetailsSection />
        <OrderSummarySection items={items} />
      </main>

<div className="max-w-md mx-auto mt-4">
  <label
    className="bg-white p-4 rounded-[16px] border border-[#F5F5F6] shadow-[0_4px_4px_rgba(0,0,0,0.25)] 
    mx-4 md:mx-0 mt-6 flex items-center gap-3 cursor-pointer"
  >
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
      className="w-6 h-6 accent-blue-600 rounded border-gray-300"
    />
    <span className="text-[#555] font-poppins text-sm font-normal leading-[1.4em]">
      Save my information for a faster checkout
    </span>
  </label>
</div>


      <div className="bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-100 mt-4 z-10 max-w-md mx-auto">
        <Button variant="primary" onClick={() => router.push("/in/payment")}>
          Place Order
        </Button>
      </div>
    </div>
  )
}

export default CheckoutPage
