'use client'
import { CheckoutSkeleton, DeliveryAddressSkeleton } from "@/components/organisms/CartSkeleton/CartSkeleton"
import { useAddressStore } from "@/store/addressStore"
import { MapPin, ChevronRight } from "lucide-react"
import { AddressForm } from "@/app/[locale]/(checkout)/shippinginfo/addressform/page"
import { useCartStore } from '@/store/useCartStore'
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation"

const DeliveryAddress = ({ onAddressUpdate: parentOnAddressUpdate }: { onAddressUpdate?: () => void }) => {
  const [loading, setLoading] = useState(true)
  const [hasAddress, setHasAddress] = useState(false)
  const [addressCheckTrigger, setAddressCheckTrigger] = useState(0)
  const {
    cartId,
    fetchCart,
  } = useCartStore()


  useEffect(() => {
    async function checkAddress() {
      if (!cartId) {
        setHasAddress(false)
        setLoading(false)
        return
      }

      try {
        const { retrieveCart } = await import("@/lib/data/cart")
        const cartData = await retrieveCart(cartId)
        const shippingAddr = cartData?.shipping_address

        const isValid = shippingAddr && shippingAddr.first_name && shippingAddr.address_1
        setHasAddress(!!isValid)
        setLoading(false)
      } catch (err) {
        setHasAddress(false)
      }
    }

    checkAddress()
  }, [cartId, addressCheckTrigger])

  const handleAddressUpdate = () => {

    setAddressCheckTrigger((prev) => prev + 1)

    parentOnAddressUpdate?.()
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
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const { cartId } = useCartStore()
  const [customerDefaultAddress, setCustomerDefaultAddress] = useState<any>(null)
  const [guestAddress, setGuestAddress] = useState<any>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [customerEmail, setCustomerEmail] = useState<string>('')


  useEffect(() => {
    async function loadCustomerAddress() {
      try {
        const res = await fetch("/api/customer/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        })

        if (res.ok) {
          const data = await res.json()
          const customer = data?.customer

          if (customer) {
            setIsLoggedIn(true)
            setCustomerEmail(customer.email || '')

            if (customer.addresses && customer.addresses.length > 0) {
              const defaultAddr = customer.addresses.find((addr: any) => addr.is_default_shipping)
                || customer.addresses[0]

              setCustomerDefaultAddress(defaultAddr)

              if (cartId) {
                const { retrieveCart } = await import("@/lib/data/cart")
                const cartData = await retrieveCart(cartId)
                const existingAddress = cartData?.shipping_address
                
                const needsAddressUpdate = !existingAddress || 
                  !existingAddress.first_name || 
                  !existingAddress.address_1

                if (needsAddressUpdate) {
                  const addressData = {
                    email: customer.email || "",
                    shipping_address: {
                      first_name: defaultAddr.first_name || "",
                      last_name: defaultAddr.last_name || "",
                      address_1: defaultAddr.address_1 || "",
                      address_2: defaultAddr.address_2 || "",
                      city: defaultAddr.city || "",
                      province: defaultAddr.province || "",
                      postal_code: defaultAddr.postal_code || "",
                      country_code: defaultAddr.country_code || "np",
                      phone: defaultAddr.phone || "",
                      company: defaultAddr.company || "",
                    },
                    billing_address: {
                      first_name: defaultAddr.first_name || "",
                      last_name: defaultAddr.last_name || "",
                      address_1: defaultAddr.address_1 || "",
                      address_2: defaultAddr.address_2 || "",
                      city: defaultAddr.city || "",
                      province: defaultAddr.province || "",
                      postal_code: defaultAddr.postal_code || "",
                      country_code: defaultAddr.country_code || "np",
                      phone: defaultAddr.phone || "",
                      company: defaultAddr.company || "",
                    }
                  }

                  const { setAddressesWithCartId } = await import("@/lib/data/cart")
                  await setAddressesWithCartId(cartId, addressData)
                  
                  onAddressUpdate?.()
                } else {
                  const cartMatchesDefault = existingAddress && defaultAddr &&
                    existingAddress.first_name === defaultAddr.first_name &&
                    existingAddress.last_name === defaultAddr.last_name &&
                    existingAddress.address_1 === defaultAddr.address_1 &&
                    existingAddress.city === defaultAddr.city &&
                    existingAddress.province === defaultAddr.province &&
                    existingAddress.phone === defaultAddr.phone

                  if (!cartMatchesDefault) {
                    setCustomerDefaultAddress(null)
                    setGuestAddress(existingAddress)
                  }
                  
                  onAddressUpdate?.()
                }
              }
            } else {
              setCustomerDefaultAddress(null)
            }
          } else {
            setIsLoggedIn(false)
            setCustomerDefaultAddress(null)
          }
        } else {
          setIsLoggedIn(false)
          setCustomerDefaultAddress(null)
        }
        
        if (!isLoggedIn && cartId) {
          const { retrieveCart } = await import("@/lib/data/cart")
          const cartData = await retrieveCart(cartId)
          const shippingAddr = cartData?.shipping_address
          
          if (shippingAddr && shippingAddr.first_name && shippingAddr.address_1) {
            setGuestAddress(shippingAddr)
          }
        }
      } catch (err) {
        setCustomerDefaultAddress(null)
        setIsLoggedIn(false)
      } finally {
        setLoading(false)
      }
    }

    if (cartId) {
      loadCustomerAddress()
    }
  }, [cartId])

  const handleFormClose = async () => {
    setShowForm(false)
    onAddressUpdate?.()
    
    if (cartId) {
      try {
        const { retrieveCart } = await import("@/lib/data/cart")
        const cartData = await retrieveCart(cartId)
        const shippingAddr = cartData?.shipping_address
        
        
        if (isLoggedIn) {
          try {
            const res = await fetch("/api/customer/me", {
              method: "GET",
              credentials: "include",
              cache: "no-store",
            })

            if (res.ok) {
              const data = await res.json()
              const customer = data?.customer

              if (customer && customer.addresses && customer.addresses.length > 0) {
                const defaultAddr = customer.addresses.find((addr: any) => addr.is_default_shipping)
                  || customer.addresses[0]
                
                
                const cartMatchesDefault = shippingAddr && defaultAddr &&
                  shippingAddr.first_name === defaultAddr.first_name &&
                  shippingAddr.last_name === defaultAddr.last_name &&
                  shippingAddr.address_1 === defaultAddr.address_1 &&
                  shippingAddr.city === defaultAddr.city &&
                  shippingAddr.province === defaultAddr.province &&
                  shippingAddr.phone === defaultAddr.phone


                if (cartMatchesDefault) {
                  setCustomerDefaultAddress(defaultAddr)
                  setGuestAddress(null)
                } else {
                  setCustomerDefaultAddress(null)
                  if (shippingAddr && shippingAddr.first_name && shippingAddr.address_1) {
                    setGuestAddress(shippingAddr)
                  }
                }
                
                setCustomerEmail(customer.email || '')
              } else {
                setCustomerDefaultAddress(null)
                if (shippingAddr && shippingAddr.first_name && shippingAddr.address_1) {
                  setGuestAddress(shippingAddr)
                }
              }
            }
          } catch (err) {
            console.error("Failed to reload customer address:", err)
            if (shippingAddr && shippingAddr.first_name && shippingAddr.address_1) {
              setGuestAddress(shippingAddr)
            }
          }
        } else {
          if (shippingAddr && shippingAddr.first_name && shippingAddr.address_1) {
            setGuestAddress(shippingAddr)
          }
        }
      } catch (err) {
        console.error("Failed to reload address:", err)
      }
    }
  }



  if (!cartId) return null
  if (loading) return <div className="bg-white p-4 rounded-[16px] border border-[#F5F5F6] shadow-[0_4px_4px_rgba(0,0,0,0.25)] mx-4 md:mx-0 mt-4"><CheckoutSkeleton /></div>

  const convertToAddressFormat = (addr: any, customerEmail?: string) => {
    if (!addr) return undefined
    return {
      name: `${addr.first_name || ''} ${addr.last_name || ''}`.trim(),
      email: customerEmail || addr.email || '',
      phone: addr.phone || '',
      province: addr.province || '',
      district: addr.city || '',
      line1: addr.address_1 || '',
      line2: addr.address_2 || '',
      postalCode: addr.postal_code || '',
      countryCode: addr.country_code || 'np',
      label: addr.address_name || 'Home',
      isDefault: addr.is_default_shipping || false,
    }
  }

  if (customerDefaultAddress) {
    return (
      <div className="bg-white p-4 rounded-[16px] border border-[#F5F5F6] shadow-[0_4px_4px_rgba(0,0,0,0.25)] mx-4 md:mx-0 mt-4">
        {showForm ? (
          <AddressForm
            initialData={convertToAddressFormat(customerDefaultAddress, customerEmail)}
            index={undefined}
            onClose={handleFormClose}
            isUserLoggedIn={isLoggedIn}
          />
        ) : (
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
                        {customerDefaultAddress.first_name} {customerDefaultAddress.last_name}
                      </span>
                      <span className="text-gray-400 text-[13px]">
                        {customerDefaultAddress.phone}
                      </span>
                    </div>
                    <div className="leading-snug">
                      {customerDefaultAddress.address_name && (
                        <span className="inline-block bg-[#2b5bf7] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] mr-1 align-middle">
                          {customerDefaultAddress.address_name.toUpperCase()}
                        </span>
                      )}
                      <span className="text-[13px] text-gray-600">
                        {customerDefaultAddress.address_1}
                        {customerDefaultAddress.address_2 ? `, ${customerDefaultAddress.address_2}` : ""}
                        , {customerDefaultAddress.city}, {customerDefaultAddress.province}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    )
  }

  if (guestAddress) {
    return (
      <div className="bg-white p-4 rounded-[16px] border border-[#F5F5F6] shadow-[0_4px_4px_rgba(0,0,0,0.25)] mx-4 md:mx-0 mt-4">
        {showForm ? (
          <AddressForm
            initialData={convertToAddressFormat(guestAddress)}
            index={undefined}
            onClose={handleFormClose}
            isUserLoggedIn={isLoggedIn}
          />
        ) : (
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
                        {guestAddress.first_name} {guestAddress.last_name}
                      </span>
                      <span className="text-gray-400 text-[13px]">
                        {guestAddress.phone}
                      </span>
                    </div>
                    <div className="leading-snug">
                      <span className="text-[13px] text-gray-600">
                        {guestAddress.address_1}
                        {guestAddress.address_2 ? `, ${guestAddress.address_2}` : ""}
                        , {guestAddress.city}, {guestAddress.province}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }


  return (
    <div className="bg-white p-4 rounded-[16px] border border-[#F5F5F6] shadow-[0_4px_4px_rgba(0,0,0,0.25)] mx-4 md:mx-0 mt-4">
      {showForm ? (
        <AddressForm
          initialData={undefined}
          index={undefined}
          onClose={handleFormClose}
          isUserLoggedIn={isLoggedIn}
        />
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