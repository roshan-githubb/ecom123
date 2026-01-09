"use client"

import ErrorMessage from "@/components/molecules/ErrorMessage/ErrorMessage"
import { initiatePaymentSession } from "@/lib/data/cart"
import { RadioGroup } from "@headlessui/react"
import {
  isStripe as isStripeFunc,
  paymentInfoMap,
} from "../../../lib/constants"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Container, Heading, Text } from "@medusajs/ui"
import PaymentContainer, {
  StripeCardContainer,
} from "../../organisms/PaymentContainer/PaymentContainer"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/atoms"

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

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()


  const isStripe = isStripeFunc(selectedPaymentMethod)

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setIsOpen(false)
    setSelectedPaymentMethod(method)
    if (isStripeFunc(method)) {
      await initiatePaymentSession(cart, {
        provider_id: method,
      })
    }
  }

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    setIsOpen(true)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setIsOpen(false)
    try {
      const shouldInputCard =
        isStripeFunc(selectedPaymentMethod) && !activeSession

      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      if (!shouldInputCard) {
        // return router.push(
        //   pathname + "?" + createQueryString("step", "review"),
        //   {
        //     scroll: false,
        //   }
        // )
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <div className="bg-white p-4 rounded-[16px] border border-[#F5F5F6] shadow-[0_4px_4px_rgba(0,0,0,0.25)] mx-4 md:mx-0 mt-4">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-[#e3e8ec] rounded-md flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] bg-[length:4px_4px]" />
          <CreditCard className="w-5 h-5 text-[#2b5bf7] relative z-10" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-900">
                Payment
              </h2>
              {!isOpen && paymentReady && (
                <CheckCircleSolid className="w-4 h-4 text-[#2b5bf7]" />
              )}
            </div>
            {!isOpen && activeSession && (
              <button
                onClick={handleEdit}
                className="text-[13px] font-medium text-[#2b5bf7]"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="border-t border-gray-200 pt-3">
        {isOpen ? (
          <div className="space-y-6">
            {!paidByGiftcard && availablePaymentMethods?.length ? (
              <div className="space-y-4">
                <RadioGroup
                  value={selectedPaymentMethod}
                  onChange={setPaymentMethod}
                  className="space-y-3"
                >
                  {availablePaymentMethods.map((method) => (
                    <div key={method.id} className="border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors">
                      {isStripeFunc(method.id) ? (
                        <StripeCardContainer 
                          paymentProviderId={method.id} 
                          selectedPaymentOptionId={selectedPaymentMethod} 
                          paymentInfoMap={paymentInfoMap} 
                          setCardBrand={setCardBrand} 
                          setError={setError} 
                          setCardComplete={setCardComplete} 
                        />
                      ) : (
                        <PaymentContainer
                          paymentProviderId={method.id}
                          paymentInfoMap={paymentInfoMap}
                          selectedPaymentOptionId={selectedPaymentMethod}
                        />
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ) : paidByGiftcard ? (
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircleSolid className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800">Paid by Gift Card</p>
                    <p className="text-xs text-green-600">Your order is fully covered by gift cards</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">No payment methods available</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex-shrink-0 mt-0.5"></div>
                  <div>
                    <p className="text-sm font-medium text-red-800">Payment Error</p>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={
                isLoading ||
                (isStripe && !cardComplete) ||
                (!selectedPaymentMethod && !paidByGiftcard)
              }
              className="w-full h-12 rounded-xl bg-blue-600 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                "Continue to Review"
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {activeSession ? (
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Payment Method</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {paymentInfoMap[activeSession?.provider_id]?.title || activeSession?.provider_id}
                    </p>
                  </div>
                </div>
                <CheckCircleSolid className="w-5 h-5 text-green-500" />
              </div>
            ) : paidByGiftcard ? (
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-xs text-green-600 uppercase tracking-wide">Payment Status</p>
                    <p className="text-sm font-medium text-green-800 mt-1">Paid by Gift Card</p>
                  </div>
                </div>
                <CheckCircleSolid className="w-5 h-5 text-green-500" />
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mb-4">No payment method selected</p>
                <button
                  onClick={handleEdit}
                  className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Select Payment Method
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )

}

export default CartPaymentSection
