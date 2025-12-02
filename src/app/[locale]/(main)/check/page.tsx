"use client"

import React, { useEffect, useState } from "react"
import { useCartStore } from "@/store/useCartStore"
import { getCart } from "@/services/cart"
import { mapCartToOrderSummary } from "@/lib/mapper/cartMapper"
import { OrderItem, OrderSummary } from "@/components/organisms/CartSummary/CartItemSummary"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface SelectCircleProps {
  selected: boolean
}

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

const UserForm: React.FC<{
  onSave: (address: Address) => void
  initialData?: Address
}> = ({ onSave, initialData }) => {
  const [address, setAddress] = useState(initialData?.address || "")
  const [label, setLabel] = useState(initialData?.label || "Home")
  const [phone, setPhone] = useState(initialData?.phone || "")
  const [country, setCountry] = useState(initialData?.country || "Nepal")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      country,
      address,
      label,
      phone,
    })
  }

  return (
    <form
      className="flex flex-col gap-4 bg-white p-4 rounded-lg border border-gray-300 mx-4 md:mx-0 mt-4"
      onSubmit={handleSubmit}
    >
      <div className="font-semibold text-base">Delivery</div>

      {/* Country */}
      <div className="flex flex-col items-start w-full">
        <p className="font-poppins text-sm w-fit">Country*</p>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="flex p-2.5 rounded-[5px] border border-[#606060] w-full h-10 text-xs"
        >
          <option value="Nepal">Nepal</option>
          <option value="India">India</option>
        </select>
      </div>

      {/* Address */}
      <div className="flex flex-col items-start w-full">
        <p className="text-[#333] text-sm w-fit">Address</p>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your address"
          className="flex p-2.5 rounded-[5px] border border-[#606060] w-full h-10 text-xs"
          required
        />
      </div>

      {/* Address Type */}
      <div className="flex flex-col items-start w-full">
        <p className="text-[#333] text-sm w-fit">Address Type</p>
        <select
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="flex p-2.5 rounded-[5px] border border-[#606060] w-full h-10 text-xs"
        >
          <option value="Home">Home</option>
          <option value="Work">Work</option>
        </select>
      </div>

      {/* Phone Number */}
      <div className="flex flex-col items-start w-full">
        <p className="text-[#333] text-sm w-fit">Phone number</p>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="9801234567"
          className="flex p-2.5 rounded-[5px] border border-[#606060] w-full h-10 text-xs"
          required
        />
      </div>

      <Button variant="primary" type="submit">
        Save
      </Button>
    </form>
  )
}

const UserDetailsSection: React.FC<{
  address: Address | null
  onChange: () => void
  onAdd: () => void
}> = ({ address, onChange, onAdd }) => {
  const router = useRouter()

  const displayValue = (val: string, missingText: string) => val || missingText

  return (
    <div className="bg-white p-4 rounded-[16px] border border-[#F5F5F6] shadow-[0_4px_4px_rgba(0,0,0,0.25)] flex flex-col gap-3 mx-4 md:mx-0 mt-4">
      <div className="flex justify-between items-start gap-[54px]">
        <div className="flex flex-col gap-2 w-[178px]">
          <h2 className="text-lg leading-[25px] font-semibold text-[#333333]">
            Your Details
          </h2>
          <p className="text-sm leading-[20px] font-medium text-[#444]">
            Sabina Pandit
          </p>
          <p className="text-sm leading-[20px] font-normal text-[#777]">
            {displayValue(address?.country || "", "Country is missing")}
          </p>
          <p className="text-sm leading-[20px] font-normal text-[#777]">
            {displayValue(address?.address || "", "Address is missing")}
          </p>
          <p className="text-sm leading-[20px] font-normal text-[#777]">
            {displayValue(address?.label || "", "Address Type is missing")}
          </p>
          <p className="text-sm leading-[20px] font-normal text-[#777]">
            {displayValue(address?.phone || "", "Phone number is missing")}
          </p>
        </div>
        <div className="ml-auto flex flex-col gap-2">
          {address ? (
            <Button variant="ghost" onClick={onChange}>
              Change
            </Button>
          ) : (
            <Button
              variant="primary"
              // onClick={onAdd}
              onClick={() => router.push("/in/shippinginfo")}

              className="w-full sm:w-auto min-w-[120px] rounded-md px-4 py-2 text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap text-center"
            >
              Add Address
            </Button>
          )}
        </div>
      </div>
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

  if (loading) return <p className="text-center my-4">Loading cart...</p>;
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
        {isEditing ? (
          <UserForm
            initialData={address || undefined}
            onSave={(addr) => {
              setAddress(addr)
              setIsEditing(false)
            }}
          />
        ) : (
          <UserDetailsSection
            address={address}
            onChange={() => setIsEditing(true)}
            onAdd={() => setIsEditing(true)}
          />
        )}

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
        <Button variant="primary" onClick={() => router.push("/in/payment")}>
          Place Order
        </Button>
      </div>
    </div>
  )
}

export default CheckoutPage
