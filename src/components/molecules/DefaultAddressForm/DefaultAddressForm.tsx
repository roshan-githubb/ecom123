"use client"

import { useState, FormEvent } from "react"
import { HttpTypes } from "@medusajs/types"
import { Loader2 } from "lucide-react"
import { addCustomerAddress, updateCustomerAddress } from "@/lib/data/customer"
import { useRouter } from "next/navigation"

interface DefaultAddressFormProps {
  customer: HttpTypes.StoreCustomer
  currentDefaultAddress?: HttpTypes.StoreCustomerAddress
  onClose: () => void
}

export const DefaultAddressForm = ({ 
  customer, 
  currentDefaultAddress, 
  onClose 
}: DefaultAddressFormProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize form with current default address or empty values
  const [formData, setFormData] = useState({
    addressName: currentDefaultAddress?.address_name || "Home",
    firstName: currentDefaultAddress?.first_name || customer.first_name || "",
    lastName: currentDefaultAddress?.last_name || customer.last_name || "",
    address1: currentDefaultAddress?.address_1 || "",
    address2: currentDefaultAddress?.address_2 || "",
    city: currentDefaultAddress?.city || "",
    province: currentDefaultAddress?.province || "",
    postalCode: currentDefaultAddress?.postal_code || "",
    countryCode: currentDefaultAddress?.country_code || "np",
    phone: currentDefaultAddress?.phone || customer.phone || "",
    company: currentDefaultAddress?.company || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const addressFormData = new FormData()
      
      if (currentDefaultAddress?.id) {
        // Update existing address
        addressFormData.set("addressId", currentDefaultAddress.id)
      }
      
      addressFormData.set("address_name", formData.addressName)
      addressFormData.set("first_name", formData.firstName)
      addressFormData.set("last_name", formData.lastName)
      addressFormData.set("address_1", formData.address1)
      addressFormData.set("address_2", formData.address2)
      addressFormData.set("city", formData.city)
      addressFormData.set("province", formData.province)
      addressFormData.set("postal_code", formData.postalCode)
      addressFormData.set("country_code", formData.countryCode)
      addressFormData.set("phone", formData.phone)
      addressFormData.set("company", formData.company)
      addressFormData.set("isDefaultShipping", "true")

      let result
      if (currentDefaultAddress?.id) {
        result = await updateCustomerAddress(addressFormData)
      } else {
        result = await addCustomerAddress(addressFormData)
      }

      if (result.success) {
        router.refresh()
        onClose()
      } else {
        setError(result.error || "Failed to save address")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address Label *
        </label>
        <select
          name="addressName"
          value={formData.addressName}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="Home">Home</option>
          <option value="Office">Office</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address Line 1 *
        </label>
        <input
          type="text"
          name="address1"
          value={formData.address1}
          onChange={handleChange}
          placeholder="Street address, P.O. box"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address Line 2
        </label>
        <input
          type="text"
          name="address2"
          value={formData.address2}
          onChange={handleChange}
          placeholder="Apartment, suite, unit, building, floor, etc."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Province/State *
          </label>
          <input
            type="text"
            name="province"
            value={formData.province}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Postal Code *
          </label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country *
          </label>
          <select
            name="countryCode"
            value={formData.countryCode}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="np">Nepal</option>
            <option value="in">India</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number *
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Company (Optional)
        </label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save as Default"
          )}
        </button>
      </div>
    </form>
  )
}
