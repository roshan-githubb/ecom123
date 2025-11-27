"use client"

import React, { useEffect, useState } from "react"
import { useCartStore } from "@/store/useCartStore"
import { getCart } from "@/services/cart"
import { mapCartToOrderSummary } from "@/lib/mapper/cartMapper"
import { OrderItem, OrderSummary } from "@/components/organisms/CartSummary/CartItemSummary"

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
    <img
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
              onClick={onAdd}
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



const PaymentMethodSection: React.FC<{
  selected: string
  onSelect: (method: string) => void
}> = ({ selected, onSelect }) => (
  <div className="bg-white p-4 rounded-[16px] border border-[#F5F5F6] shadow-[0_4px_4px_rgba(0,0,0,0.25)] mx-4 md:mx-0 mt-6">
    <h2 className="text-lg font-semibold text-[#333333] mb-4">
      Select Payment Method
    </h2>
    <div className="flex justify-start gap-3 mb-4">
      <BankPaymentButton
        checked={selected === "bank"}
        onClick={() => onSelect("bank")}
      />
      <KhaltiButton
        checked={selected === "khalti"}
        onClick={() => onSelect("khalti")}
      />
    </div>

    {selected === "bank" && (
      <div className="flex flex-col gap-1 mb-4">
        <label className="text-sm font-medium text-[#444]">
          Account Number
        </label>
        <input
          type="text"
          placeholder="001-234-345-2345"
          className="border border-gray-300 rounded-xs p-2 text-sm font-normal"
          onFocus={(e) => (e.currentTarget.placeholder = "")}
        />
      </div>
    )}

    {selected === "khalti" && (
      <div className="flex flex-col gap-1 mb-4">
        <label className="text-sm font-medium text-[#444]">Khalti Number</label>
        <input
          type="text"
          placeholder="9823435126"
          className="border border-gray-300 rounded-xs p-2 text-sm font-normal"
          onFocus={(e) => (e.currentTarget.placeholder = "")}
        />
      </div>
    )}
  </div>
)

const CheckoutPage: React.FC = () => {


  const cartItems = useCartStore((state) => state.items)
  const [selectedPayment, setSelectedPayment] = React.useState("bank")
  const [checked, setChecked] = useState(false)
  const [address, setAddress] = useState<Address | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

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
  


  if (cartSummary && !cartSummary?.items.length){
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
        <PaymentMethodSection
          selected={selectedPayment}
          onSelect={setSelectedPayment}
        />
      </main>

      <div className="max-w-md mx-auto mt-4">
        <div
          className="bg-white p-4 rounded-[16px] border border-[#F5F5F6] shadow-[0_4px_4px_rgba(0,0,0,0.25)] flex items-center gap-2 cursor-pointer"
          onClick={() => setChecked(!checked)}
        >
          <div className="w-6 h-6 relative flex items-center justify-center">
            {/* checkbox SVGs */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute"
            >
              <path
                d="M17.1309 2.39062H2.0691C1.52034 2.39097 0.994162 2.59108 0.606191 2.947C0.21822 3.30291 0.000187741 3.78551 0 4.28877V18.1017C9.3969e-05 18.6049 0.218118 19.0875 0.60613 19.4433C0.994142 19.7991 1.52037 19.9991 2.0691 19.9992H17.1309C17.6797 19.9991 18.206 19.7991 18.594 19.4432C18.982 19.0873 19.2 18.6046 19.2 18.1013V4.28877C19.1999 3.78549 18.9819 3.30284 18.5939 2.9469C18.2059 2.59097 17.6797 2.39088 17.1309 2.39062ZM18.0949 17.1662C18.095 17.3868 18.0477 17.6051 17.9558 17.8089C17.8638 18.0127 17.729 18.1978 17.559 18.3538C17.389 18.5098 17.1872 18.6336 16.9651 18.718C16.7429 18.8024 16.5048 18.8459 16.2643 18.846H2.93743C2.69687 18.8461 2.45865 18.8027 2.23638 18.7183C2.01412 18.6339 1.81216 18.5102 1.64206 18.3542C1.47196 18.1982 1.33704 18.013 1.24503 17.8091C1.15301 17.6053 1.1057 17.3868 1.10579 17.1662V4.94499C1.10579 4.72442 1.15317 4.50601 1.24522 4.30224C1.33728 4.09846 1.4722 3.91331 1.64229 3.75736C1.81238 3.60141 2.0143 3.47771 2.23652 3.39333C2.45874 3.30896 2.69692 3.26555 2.93743 3.26559H16.2643C16.7499 3.26585 17.2154 3.44289 17.5587 3.7578C17.902 4.07271 18.0948 4.49973 18.0949 4.94499V17.1662Z"
                fill="#0671E0"
              />
            </svg>
            {checked && (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                className="absolute"
              >
                <path
                  d="M6 12L10 16L18 8"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-fit">
            <p className="text-[#555] font-poppins text-sm font-normal leading-[1.4em]">
              Save my information for a faster checkout
            </p>
          </div>
        </div>
      </div>
      <div className="bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-100 mt-4 z-10 max-w-md mx-auto">
        <Button variant="primary" onClick={() => alert("Order Placed!")}>
          Place Order & Pay
        </Button>
      </div>
    </div>
  )
}

export default CheckoutPage
