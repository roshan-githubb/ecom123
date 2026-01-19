"use client"

import { initiatePaymentSession } from "@/lib/data/cart"
import { RadioGroup } from "@headlessui/react"
import {
  isStripe as isStripeFunc,
  paymentInfoMap,
} from "../../../lib/constants"
import { useEffect, useState } from "react"

type StoreCardPaymentMethod = any & {
  service_zone?: {
    fulfillment_set: {
      type: string
    }
  }
}

const CartPaymentSection = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any
  availablePaymentMethods: StoreCardPaymentMethod[] | null
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )
  const [loadingPaymentMethod, setLoadingPaymentMethod] = useState<string | null>(null)

  const setPaymentMethod = async (method: string) => {
    setSelectedPaymentMethod(method)
    setLoadingPaymentMethod(method)


    try {
      await initiatePaymentSession(cart, {
        provider_id: method,
      })
    } catch (err) {
    } finally {
      setLoadingPaymentMethod(null)
    }
  }

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  return (
    <div className="max-w-md mx-auto mt-4 bg-white rounded-lg p-4 relative">

      {loadingPaymentMethod && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-myBlue border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-gray-700">Updating payment method...</p>
          </div>
        </div>
      )}

      <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <svg className="w-5 h-5 text-myBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        Payment Method
      </h2>

      {!paidByGiftcard && availablePaymentMethods?.length ? (
        <RadioGroup
          value={selectedPaymentMethod}
          onChange={setPaymentMethod}
          className="space-y-2"
        >
          {availablePaymentMethods.map((method) => {
            return (
              <RadioGroup.Option
                key={method.id}
                value={method.id}
                disabled={loadingPaymentMethod !== null}
                className={({ checked }) =>
                  `relative flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${checked
                    ? "border-myBlue bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                  } ${loadingPaymentMethod !== null ? "cursor-not-allowed" : ""}`
                }
              >
                {({ checked }) => (
                  <>

                    <div className="flex-shrink-0">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${checked
                          ? "border-myBlue bg-myBlue"
                          : "border-gray-300 bg-white"
                          }`}
                      >
                        {checked && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                    </div>


                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {paymentInfoMap[method.id]?.title || method.id}
                      </span>
                      {paymentInfoMap[method.id]?.icon && (
                        <span className="text-gray-500">
                          {paymentInfoMap[method.id]?.icon}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            )
          })}
        </RadioGroup>
      ) : paidByGiftcard ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">Paid by gift card</p>
        </div>
      ) : (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">No payment methods available</p>
        </div>
      )}
    </div>
  )
}

export default CartPaymentSection
