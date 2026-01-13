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
    <div className="max-w-md mx-auto mt-4 bg-white p-4 rounded-[16px] border border-[#F5F5F6] shadow-[0_4px_4px_rgba(0,0,0,0.25)] ">
      <div className="space-y-4 px-4 md:px-0 mt-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-[#e3e8ec] rounded-md flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] bg-[length:4px_4px]" />
            <CreditCard className="w-5 h-5 text-[#2b5bf7] relative z-10" />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                Payment
                {!isOpen && paymentReady && (
                  <CheckCircleSolid className="w-4 h-4 text-[#2b5bf7]" />
                )}
              </h2>

              {!isOpen && (
                <button
                  onClick={handleEdit}
                  className="text-[13px] font-medium text-[#2b5bf7]"
                >
                  Edit
                </button>
              )}
            </div>

            <div className="mt-2 border-t border-gray-200 pt-3">
              {isOpen ? (
                <div className="space-y-4">
                  {!paidByGiftcard && availablePaymentMethods?.length && (
                    <RadioGroup
                      value={selectedPaymentMethod}
                      onChange={setPaymentMethod}
                      className="space-y-3"
                    >
                      {availablePaymentMethods.map((method) => (
                        <div key={method.id}>
                          {isStripeFunc(method.id) ? (
                            <StripeCardContainer paymentProviderId={method.id} selectedPaymentOptionId={selectedPaymentMethod} paymentInfoMap={paymentInfoMap} setCardBrand={setCardBrand} setError={setError} setCardComplete={setCardComplete} />
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
                  )}

                  <ErrorMessage error={error} />

                  <button
                    onClick={handleSubmit}
                    disabled={
                      (isStripe && !cardComplete) ||
                      (!selectedPaymentMethod && !paidByGiftcard)
                    }
                    className="w-full h-11 rounded-md bg-myBlue text-white text-[13px] font-medium disabled:opacity-50"
                  >
                    Proceed
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-[11px] text-gray-400">Payment method</p>
                  <p className="text-[13px] text-gray-700">
                    {paymentInfoMap[activeSession?.provider_id]?.title ||
                      activeSession?.provider_id}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPaymentSection
