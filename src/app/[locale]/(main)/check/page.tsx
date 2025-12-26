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
import { AddressForm } from "@/app/[locale]/(checkout)/shippinginfo/addressform/page"

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

const UserDetailsSection: React.FC<{ onAddressUpdate?: () => void }> = ({ onAddressUpdate }) => {
  const router = useRouter()
  const addresses = useAddressStore((state) => state.addresses)
  const selectedIndex = useAddressStore((state) => state.selectedAddressIndex)
  const localAddr = selectedIndex !== undefined ? addresses[selectedIndex] : null
  
  // Get cart to check for shipping address
  const [cartAddress, setCartAddress] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const { cartId } = useCartStore()

  useEffect(() => {
    async function fetchCartAddress() {
      if (!cartId) return
      
      try {
        const res = await fetch("/api/cart/get", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart_id: cartId }),
        })
        const data = await res.json()
        if (data?.cart?.shipping_address) {
          setCartAddress(data.cart.shipping_address)
        }
      } catch (err) {
        console.error("Failed to fetch cart address:", err)
      }
    }
    
    fetchCartAddress()
  }, [cartId])

  // Use cart address if available, otherwise use local address
  const addr = cartAddress || localAddr
  
  // Check if address has actual data (not just null properties)
  const hasValidAddress = addr && (
    (cartAddress && cartAddress.first_name) || 
    (localAddr && localAddr.name)
  )

  const handleFormClose = () => {
    setShowForm(false)
    // Refresh cart address after form closes
    if (cartId) {
      fetch("/api/cart/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart_id: cartId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.cart?.shipping_address) {
            setCartAddress(data.cart.shipping_address)
          }
          // Notify parent to re-check address
          onAddressUpdate?.()
        })
        .catch((err) => console.error("Failed to refresh cart address:", err))
    }
  }

  return (
    <div className="bg-white p-4 rounded-[16px] border border-[#F5F5F6] shadow-[0_4px_4px_rgba(0,0,0,0.25)] mx-4 md:mx-0 mt-4">
      {showForm ? (
        <AddressForm
          initialData={localAddr || undefined}
          index={selectedIndex}
          onClose={handleFormClose}
        />
      ) : hasValidAddress ? (
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-[#e3e8ec] rounded-md flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] bg-[length:4px_4px]"></div>
                <MapPin className="w-5 h-5 text-[#2b5bf7] fill-[#2b5bf7] relative z-10" />
              </div>
            </div>
            <div
              className="flex-1 cursor-pointer min-w-0"
              onClick={() => setShowForm(true)}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-sm text-gray-900">
                      {cartAddress 
                        ? `${cartAddress.first_name} ${cartAddress.last_name}`
                        : addr.name}
                    </span>
                    <span className="text-gray-400 text-[13px]">
                      {cartAddress ? cartAddress.phone : addr.phone}
                    </span>
                  </div>
                  <div className="leading-snug">
                    {!cartAddress && addr.label && (
                      <span className="inline-block bg-[#2b5bf7] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] mr-1 align-middle">
                        {addr.label.toUpperCase()}
                      </span>
                    )}
                    <span className="text-[13px] text-gray-600">
                      {cartAddress
                        ? `${cartAddress.address_1}${cartAddress.address_2 ? ", " + cartAddress.address_2 : ""}, ${cartAddress.city}, ${cartAddress.province}`
                        : `${addr.line1}${addr.line2 ? ", " + addr.line2 : ""}, ${addr.district}, ${addr.province}`}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </div>
            </div>
          </div>
          
          <div
            className="flex items-start gap-3 pl-[52px] cursor-pointer"
            onClick={() => router.push("/np/pickupaddress")}
          >
            <div className="flex-1 border-t border-gray-200 pt-3 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-black font-medium leading-tight mb-1">
                    Collect your parcels from a nearby location at a minimal
                    delivery fee.
                  </p>
                  <p className="text-[11px] text-gray-400">
                    9 suggested collection point(s) nearby
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-gray-700 font-medium mb-1">No delivery address</p>
            <p className="text-gray-500 text-sm">Please add your delivery address to continue</p>
          </div>
          <Button
            variant="primary"
            className="px-6 py-2 text-sm"
            onClick={() => setShowForm(true)}
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
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hasAddress, setHasAddress] = useState(false)
  const [addressCheckTrigger, setAddressCheckTrigger] = useState(0)
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
    fetchCart,
    discountTotal,
    promotions
  } = useCartStore()
  const summary = {
    currency,
    subtotal,
    discountTotal,
    taxTotal,
    deliveryFee,
    serviceFee,
    totalPayable,
    items,
    cartId,
    promotions
  }

  useEffect(() => {
    async function load() {
      await fetchCart()
      setLoading(false)
    }
    load()
  }, [fetchCart])

  // Check if address exists
  useEffect(() => {
    async function checkAddress() {
      if (!cartId) {
        setHasAddress(false)
        return
      }

      try {
        const res = await fetch("/api/cart/get", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart_id: cartId }),
        })
        const data = await res.json()
        const shippingAddr = data?.cart?.shipping_address
        // Check if address exists AND has actual data (not just null properties)
        const isValid = shippingAddr && shippingAddr.first_name && shippingAddr.address_1
        setHasAddress(!!isValid)
        console.log("Address check:", { shippingAddr, isValid })
      } catch (err) {
        console.error("Failed to check address:", err)
        setHasAddress(false)
      }
    }

    checkAddress()
  }, [cartId, addressCheckTrigger])

  const handleAddressUpdate = () => {
    // Trigger address re-check
    setAddressCheckTrigger((prev) => prev + 1)
  }

  const handlePlaceOrder = () => {
    console.log("Place order clicked, hasAddress:", hasAddress)
    if (!hasAddress) {
      // Use the existing cart toast system
      const { cartToast } = require("@/lib/cart-toast")
      cartToast.showErrorToast("Please add a delivery address first")
      return
    }

    router.push("/np/payment")
  }

  if (loading) return <CheckoutSkeleton />
  const cartSummary = mapCartToOrderSummary(summary)

  if (cartSummary && !cartSummary?.items.length) {
    return <div className="text-center mt-10">Your cart is empty</div>
  }

  return (
    <div className="min-h-screen pb-8 overflow-x-hidden">
      <main className="max-w-md mx-auto relative z-0">
        <UserDetailsSection onAddressUpdate={handleAddressUpdate} />

        <OrderSummary summary={cartSummary} />
      </main>

      <div className="max-w-md mx-auto mt-4">
        <label className="bg-white p-4 rounded-[16px] border border-[#F5F5F6] shadow-[0_4px_4px_rgba(0,0,0,0.25)] mx-4 md:mx-0 mt-6 flex items-center gap-3 cursor-pointer">
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
        <Button variant="primary" onClick={handlePlaceOrder}>
          Place Order
        </Button>
      </div>
    </div>
  )
}

export default CheckoutPage
