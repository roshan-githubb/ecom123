"use client"

import { Card } from "@/components/atoms"
import { HttpTypes } from "@medusajs/types"
import { MapPin, Edit2 } from "lucide-react"
import { useState } from "react"
import { Modal } from "@/components/molecules"
import { AddressForm } from "@/app/[locale]/(checkout)/shippinginfo/addressform/page"
import { Address } from "@/store/addressStore"

interface DefaultAddressSectionProps {
  customer: HttpTypes.StoreCustomer
}

export const DefaultAddressSection = ({ customer }: DefaultAddressSectionProps) => {
  const [showForm, setShowForm] = useState(false)


  const defaultAddress = customer.addresses?.find(addr => addr.is_default_shipping) || customer.addresses?.[0]


  const convertToLocalAddress = (addr: HttpTypes.StoreCustomerAddress | undefined): Address | undefined => {
    if (!addr) return undefined

    return {
      name: `${addr.first_name} ${addr.last_name}`,
      email: customer.email || "",
      phone: addr.phone || "",
      province: addr.province || "",
      district: addr.city || "",
      line1: addr.address_1 || "",
      line2: addr.address_2 || "",
      postalCode: addr.postal_code || "",
      countryCode: addr.country_code || "np",
      label: addr.address_name || "Home",
      isDefault: addr.is_default_shipping || false,
    }
  }

  const handleFormClose = () => {
    setShowForm(false)

    window.location.reload()
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Default Delivery Address
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="text-blue-600 text-sm hover:underline flex items-center gap-1"
          >
            <Edit2 className="w-4 h-4" />
            {defaultAddress ? 'Change' : 'Add'}
          </button>
        </div>

        {defaultAddress ? (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {defaultAddress.first_name} {defaultAddress.last_name}
                  </p>
                  {defaultAddress.address_name && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded mt-1">
                      {defaultAddress.address_name}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p>{defaultAddress.address_1}</p>
                {defaultAddress.address_2 && <p>{defaultAddress.address_2}</p>}
                <p>
                  {defaultAddress.city}, {defaultAddress.province} {defaultAddress.postal_code}
                </p>
                <p className="uppercase">{defaultAddress.country_code}</p>
              </div>

              {defaultAddress.phone && (
                <div className="text-sm text-gray-600 pt-2 border-t border-gray-200">
                  <p className="font-medium">Phone: {defaultAddress.phone}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600 mb-2">No default address set</p>
            <p className="text-sm text-gray-500 mb-4">
              Add a default address to speed up checkout
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Add Default Address
            </button>
          </div>
        )}
      </Card>

      {showForm && (
        <Modal
          heading={defaultAddress ? "Change Default Address" : "Add Default Address"}
          onClose={() => setShowForm(false)}
          showCloseButton={false}
        >
          <AddressForm
            initialData={convertToLocalAddress(defaultAddress)}
            onClose={handleFormClose}
            isUserLoggedIn={true}
            hideCheckbox={true}
          />
        </Modal>
      )}
    </>
  )
}
