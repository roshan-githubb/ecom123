"use client"

import React, { useState } from "react"
import { useAddressStore, Address } from "@/store/addressStore"
import { MapPin, Loader2 } from "lucide-react"
import { applySelectedAddressToCart } from "@/lib/actions/address-selection"

interface AddressFormProps {
  initialData?: Address
  index?: number
  onClose: () => void
}

export const AddressForm: React.FC<AddressFormProps> = ({
  initialData,
  index,
  onClose,
}) => {
  const addAddress = useAddressStore((state) => state.addAddress)
  const updateAddress = useAddressStore((state) => state.updateAddress)
  const deleteAddress = useAddressStore((state) => state.deleteAddress)

  const [name, setName] = useState(initialData?.name || "")
  const [phone, setPhone] = useState(initialData?.phone || "")
  const [province, setProvince] = useState(initialData?.province || "")
  const [district, setDistrict] = useState(initialData?.district || "")
  const [line1, setLine1] = useState(initialData?.line1 || "")
  const [line2, setLine2] = useState(initialData?.line2 || "")
  const [label, setLabel] = useState(initialData?.label || "Home")
  const [email, setEmail] = useState(initialData?.email || "")
  const [postalCode, setPostalCode] = useState(initialData?.postalCode || "")
  const [countryCode, setCountryCode] = useState(
    initialData?.countryCode || "np"
  )
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  React.useEffect(() => {
    async function loadCartEmail() {
      if (initialData?.email) return
      
      const cartId = localStorage.getItem("cart_id")
      if (!cartId) return

      try {
        const res = await fetch("/api/cart/get", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart_id: cartId }),
        })
        const data = await res.json()
        
        if (data?.cart?.email) {
          setEmail(data.cart.email)
        }
      } catch (err) {
        console.error("Failed to fetch cart email:", err)
      }
    }

    loadCartEmail()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveError(null)

    const addr: Address = {
      name,
      email, 
      phone,
      province,
      district,
      line1,
      line2,
      postalCode, 
      countryCode,
      label,
      isDefault: initialData?.isDefault || false,
    }

    try {
      
      if (typeof index === "number") {
        updateAddress(index, addr)
      } else {
        addAddress(addr)
      }

      
      const error = await applySelectedAddressToCart(addr)
      
      if (error) {
        setSaveError(error)
        setIsSaving(false)
        return
      }

      setIsSaving(false)
      
      
      window.scrollTo({ top: 0, behavior: 'smooth' })
      
      onClose()
    } catch (err: any) {
      setSaveError(err.message || "Failed to save address")
      setIsSaving(false)
    }
  }

  const handleDelete = () => {
    if (typeof index === "number") {
      deleteAddress(index)
      onClose()
    }
  }

  const handleCancel = () => {
    onClose()
  }

  const handleUseCurrentLocation = () => {
    setIsLoadingLocation(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
      setIsLoadingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'YourAppName/1.0' 
              }
            }
          )

          if (!response.ok) {
            throw new Error("Failed to fetch address")
          }

          const data = await response.json()
          const address = data.address

          if (address.state) setProvince(address.state)
          if (address.city || address.town || address.village) {
            setDistrict(address.city || address.town || address.village)
          }
          if (address.road || address.suburb) {
            setLine1(address.road || address.suburb || "")
          }
          if (address.postcode) setPostalCode(address.postcode)
          if (address.country_code) {
            setCountryCode(address.country_code.toLowerCase())
          }

          setIsLoadingLocation(false)
        } catch (error) {
          console.error("Error fetching address:", error)
          setLocationError("Failed to get address from location")
          setIsLoadingLocation(false)
        }
      },
      (error) => {
        console.error("Geolocation error:", error)
        setLocationError("Unable to retrieve your location. Please enable location access.")
        setIsLoadingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  return (
    <form className="bg-white p-4 rounded-md space-y-3" onSubmit={handleSubmit}>
      {saveError && (
        <div className="bg-red-100 text-red-700 p-2 rounded text-sm">
          {saveError}
        </div>
      )}

      <button
        type="button"
        onClick={handleUseCurrentLocation}
        disabled={isLoadingLocation}
        className="w-full border-2 border-myBlue text-myBlue font-bold text-[14px] py-2.5 flex items-center justify-center gap-2 rounded hover:bg-[#00bfa5] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoadingLocation ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Getting location...
          </>
        ) : (
          <>
            <MapPin className="w-4 h-4" />
            Use Current Location
          </>
        )}
      </button>

      {locationError && (
        <div className="bg-red-100 text-red-700 p-2 rounded text-sm">
          {locationError}
        </div>
      )}

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full rounded"
        required
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border p-2 w-full rounded"
        required
      />
      <input
        type="text"
        placeholder="Province"
        value={province}
        onChange={(e) => setProvince(e.target.value)}
        className="border p-2 w-full rounded"
        required
      />
      <input
        type="text"
        placeholder="District / City"
        value={district}
        onChange={(e) => setDistrict(e.target.value)}
        className="border p-2 w-full rounded"
        required
      />
      <input
        type="text"
        placeholder="Address Line 1"
        value={line1}
        onChange={(e) => setLine1(e.target.value)}
        className="border p-2 w-full rounded"
        required
      />
      <input
        type="text"
        placeholder="Address Line 2"
        value={line2}
        onChange={(e) => setLine2(e.target.value)}
        className="border p-2 w-full rounded"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full rounded"
        required
      />

      <input
        type="text"
        placeholder="Postal Code"
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
        className="border p-2 w-full rounded"
        required
      />

      <select
        value={countryCode}
        onChange={(e) => setCountryCode(e.target.value)}
        className="border p-2 w-full rounded"
      >
        <option value="np">Nepal</option>
        <option value="in">India</option>
      </select>
      
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSaving}
          className="bg-[#00bfa5] text-white py-2 flex-1 rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-sm flex items-center justify-center gap-2">
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSaving ? "Saving..." : "Save"}
          </span>
        </button>
        {typeof index === "number" && (
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white py-2 flex-1 rounded font-bold"
          >
            <span className="text-sm">Delete</span>
          </button>
        )}
        <button
          type="button"
          onClick={handleCancel}
          className="bg-gray-300 text-gray-800 text-sm py-2 flex-1 rounded font-bold"
        >
          <span className="text-sm">Cancel</span>
        </button>
      </div>
    </form>
  )
}
