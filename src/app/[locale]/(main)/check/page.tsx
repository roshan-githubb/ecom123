"use client"

import React, { useEffect, useState } from "react"
import { useCartStore } from "@/store/useCartStore"
import { mapCartToOrderSummary } from "@/lib/mapper/cartMapper"
import { OrderItem, OrderSummary } from "@/components/organisms/CartSummary/CartItemSummary"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { CheckoutSkeleton } from "@/components/organisms/CartSkeleton/CartSkeleton"
import { useAddressStore } from "@/store/addressStore"
import { MapPin, ChevronRight } from "lucide-react"

interface SelectCircleProps {
  selected: boolean
}

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

const SelectCircle: React.FC<SelectCircleProps> = ({ selected }) => {
  return selected ? (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="10" cy="10" r="10" fill="#222222" />
      <circle cx="10" cy="10" r="4" fill="#F6F6F6" />
    </svg>
  ) : (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="10" cy="10" r="10" fill="#999999" />
      <circle cx="10" cy="10" r="4" fill="#F6F6F6" />
    </svg>
  )
}

const BankPaymentButton: React.FC<{
  checked: boolean
  onClick: () => void
}> = ({ checked, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 py-1 pr-3 rounded-2xl cursor-pointer"
  >
    <SelectCircle selected={checked} />
    <p
      className={`font-semibold text-sm ${checked ? "text-black" : "text-gray-500"
        }`}
    >
      Bank Account
    </p>
  </button>
)

const KhaltiButton: React.FC<{ checked: boolean; onClick: () => void }> = ({
  checked,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`cursor-pointer flex py-0 px-2 justify-center items-center gap-2 rounded-2xl border w-fit h-[25px] ${checked ? "bg-[#EEEEEE]" : "bg-white border-[#EFEFEF]"
      }`}
  >
    <Image
      src="/images/icons/khalti.png"
      height={20}
      width={20}
      alt="khalti_logo"
    />
    <p className="text-[#800080] font-poppins text-base font-semibold leading-[1.4em] w-fit">
      Khalti
    </p>
  </button>
)



interface Address {
  country: string
  address: string
  label: string
  phone: string
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
                  <p className="text-[13px] text-black font-medium leading-tight mb-0.5">
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
            onClick={() => router.push("/np/shippinginfo")}
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
  const [address, setAddress] = useState<Address | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter()


  const {
    cartId,
    items,
    subtotal,
    taxTotal,
    deliveryFee,
    serviceFee,
    totalPayable,
    currency,
    fetchCart
  } = useCartStore();
  const summary = {
    currency,
    subtotal,
    taxTotal,
    deliveryFee,
    serviceFee,
    totalPayable,
    items,
    cartId
  };



  useEffect(() => {
    async function load() {
      await fetchCart();
      setLoading(false);
    }
    load();
  }, [fetchCart]);

  if (loading) return <CheckoutSkeleton/>
  // if (!cart) return <p className="text-center my-4">No cart found.</p>;
  // const nestedCart = cart?.cart
  const cartSummary = mapCartToOrderSummary(summary)
  // console.log('mapper output ', cartSummary)



  if (cartSummary && !cartSummary?.items.length) {
    return <div className="text-center mt-10">Your cart is empty</div>
  }


  return (
    <div className="min-h-screen pb-8 overflow-x-hidden">
      <main className="max-w-md mx-auto relative z-0">
       <UserDetailsSection />

        <OrderSummary summary={cartSummary} />
        {/* <PaymentMethodSection
          selected={selectedPayment}
          onSelect={setSelectedPayment}
        /> */}
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
        <Button variant="primary" onClick={() => router.push("/np/payment")}>
          Place Order
        </Button>
      </div>
    </div>
  )
}

export default CheckoutPage
