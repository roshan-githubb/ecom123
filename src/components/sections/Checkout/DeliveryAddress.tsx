'use client'
import { CheckoutSkeleton, DeliveryAddressSkeleton } from "@/components/organisms/CartSkeleton/CartSkeleton"
import { useAddressStore } from "@/store/addressStore"
import { MapPin, ChevronRight } from "lucide-react"
import { AddressForm } from "@/app/[locale]/(checkout)/shippinginfo/addressform/page"
import { useCartStore } from '@/store/useCartStore'
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation"

const DeliveryAddress = () => {
  const [loading, setLoading] = useState(true)
  const [hasAddress, setHasAddress] = useState(false)
  const [addressCheckTrigger, setAddressCheckTrigger] = useState(0)
  const {
    cartId,
    fetchCart,
  } = useCartStore()

  // useEffect(() => {
  //     async function load() {
  //         await fetchCart()
  //         setLoading(false)
  //     }
  //     load()
  // }, [fetchCart])

  // Check if address exists
  useEffect(() => {
    async function checkAddress() {
      if (!cartId) {
        setHasAddress(false)
        setLoading(false)
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
        setLoading(false)
        console.log("delivery Address check:", { shippingAddr, isValid })
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
  
  if (loading) return <CheckoutSkeleton />
  if (!cartId) return null
  
  return (
    <UserDetailsSection onAddressUpdate={handleAddressUpdate} />
  )
}

export default DeliveryAddress

const UserDetailsSection: React.FC<{ onAddressUpdate?: () => void }> = ({ onAddressUpdate }) => {
  const router = useRouter()
  const addresses = useAddressStore((state) => state.addresses)
  const selectedIndex = useAddressStore((state) => state.selectedAddressIndex)
  const localAddr = selectedIndex !== undefined ? addresses[selectedIndex] : null
  const [loading, setLoading] = useState(true)

  // Get cart to check for shipping address
  const [cartAddress, setCartAddress] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const { cartId } = useCartStore()
  const [customerDefaultAddress, setCustomerDefaultAddress] = useState<any>(undefined)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Load customer's default address if logged in
  useEffect(() => {
    async function loadCustomerAddress() {
      try {
        console.log("🔍 DeliveryAddress: Checking customer login status...")
        
        // First check if cart has a customer_id (simpler check)
        if (cartId) {
          const cartRes = await fetch("/api/cart/get", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cart_id: cartId }),
          })
          const cartData = await cartRes.json()
          const hasCustomer = !!cartData?.cart?.customer_id
          
          console.log("🛒 DeliveryAddress: Cart has customer_id?", hasCustomer, cartData?.cart?.customer_id)
          
          if (hasCustomer) {
            setIsLoggedIn(true)
            console.log("✅ DeliveryAddress: User IS logged in (via cart customer_id)")
          }
        }
        
        // Then try to get customer details
        const res = await fetch("/api/customer/me", {
          method: "GET",
          credentials: "include",
        })
        
        console.log("🔍 DeliveryAddress: API response status:", res.status, res.ok)
        
        if (res.ok) {
          const data = await res.json()
          const customer = data?.customer
          
          console.log("🔍 DeliveryAddress: Customer data:", customer ? "Found" : "Null", customer)
          
          if (customer) {
            setIsLoggedIn(true)
            console.log("✅ DeliveryAddress: User IS logged in (via API)")
            if (customer.addresses && customer.addresses.length > 0) {
              // Find default shipping address or use first address
              const defaultAddr = customer.addresses.find((addr: any) => addr.is_default_shipping) 
                || customer.addresses[0]
              setCustomerDefaultAddress(defaultAddr)
              console.log("📍 DeliveryAddress: Found default address:", defaultAddr)
            } else {
              setCustomerDefaultAddress(null)
              console.log("📍 DeliveryAddress: No addresses found")
            }
          } else {
            if (!cartId) {
              // Only set to false if we also don't have a cart customer
              setIsLoggedIn(false)
            }
            setCustomerDefaultAddress(null)
            console.log("❌ DeliveryAddress: User NOT logged in (customer is null)")
          }
        } else {
          if (!cartId) {
            setIsLoggedIn(false)
          }
          setCustomerDefaultAddress(null)
          console.log("❌ DeliveryAddress: User NOT logged in (API returned not ok)")
        }
      } catch (err) {
        console.error("❌ DeliveryAddress: Failed to load customer address:", err)
        setCustomerDefaultAddress(null)
      }
    }

    loadCustomerAddress()
  }, [cartId])

  useEffect(() => {
    async function fetchCartAddress() {
      if (!cartId) {
        setLoading(false)
        return
      }

      // Wait for customer address check to complete
      if (customerDefaultAddress === undefined) return

      try {
        const res = await fetch("/api/cart/get", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart_id: cartId }),
        })
        const data = await res.json()
        const shippingAddr = data?.cart?.shipping_address
        
        // If cart has no address but customer has default address, set it
        if ((!shippingAddr || !shippingAddr.first_name) && customerDefaultAddress) {
          console.log("Auto-filling customer default address to cart")
          
          // Auto-fill the cart with customer's default address
          const formData = new FormData()
          formData.set("email", data?.cart?.email || "")
          formData.set("shipping_address.first_name", customerDefaultAddress.first_name)
          formData.set("shipping_address.last_name", customerDefaultAddress.last_name)
          formData.set("shipping_address.address_1", customerDefaultAddress.address_1)
          formData.set("shipping_address.address_2", customerDefaultAddress.address_2 || "")
          formData.set("shipping_address.city", customerDefaultAddress.city)
          formData.set("shipping_address.province", customerDefaultAddress.province || "")
          formData.set("shipping_address.postal_code", customerDefaultAddress.postal_code)
          formData.set("shipping_address.country_code", customerDefaultAddress.country_code)
          formData.set("shipping_address.phone", customerDefaultAddress.phone)
          formData.set("shipping_address.company", customerDefaultAddress.company || "")
          
          const { setAddresses } = await import("@/lib/data/cart")
          await setAddresses(null, formData)
          
          // Refresh cart address
          const updatedRes = await fetch("/api/cart/get", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cart_id: cartId }),
          })
          const updatedData = await updatedRes.json()
          setCartAddress(updatedData?.cart?.shipping_address)
        } else if (shippingAddr) {
          setCartAddress(shippingAddr)
        }
        
        setLoading(false)
      } catch (err) {
        console.error("Failed to fetch cart address:", err)
        setLoading(false)
      }
    }

    fetchCartAddress()
  }, [cartId, customerDefaultAddress])
  
  if (!cartId) return null
  if (loading) return <div className="bg-white p-4 rounded-[16px] border border-[#F5F5F6] shadow-[0_4px_4px_rgba(0,0,0,0.25)] mx-4 md:mx-0 mt-4"><CheckoutSkeleton /></div>

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

  console.log("🎨 DeliveryAddress: Rendering form with isLoggedIn =", isLoggedIn)

  return (
    <div className="bg-white p-4 rounded-[16px] border border-[#F5F5F6] shadow-[0_4px_4px_rgba(0,0,0,0.25)] mx-4 md:mx-0 mt-4">
      {showForm ? (
        <AddressForm
          initialData={localAddr || undefined}
          index={selectedIndex}
          onClose={handleFormClose}
          isUserLoggedIn={isLoggedIn}
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

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant: "primary" | "ghost"
  }
> = ({ variant, children, className = "", ...props }) => {
  const baseClasses = "font-semibold rounded-2xl transition-colors duration-200"
  const variantClasses =
    variant === "primary"
      ? "bg-myBlue text-white w-full h-9 font-medium text-sm hover:opacity-90"
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