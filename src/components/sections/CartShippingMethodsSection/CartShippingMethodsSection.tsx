"use client"

import ErrorMessage from "@/components/molecules/ErrorMessage/ErrorMessage"
import { setShippingMethod } from "@/lib/data/cart"
import { calculatePriceForShippingOption } from "@/lib/data/fulfillment"
import { convertToLocale } from "@/lib/helpers/money"
import { CheckCircleSolid, ChevronUpDown, Loader } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { clx, Heading, Text } from "@medusajs/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Fragment, useEffect, useState } from "react"
import { Button } from "@/components/atoms"
import { Modal, SelectField } from "@/components/molecules"
import { CartShippingMethodRow } from "./CartShippingMethodRow"
import { Listbox, Transition } from "@headlessui/react"
import clsx from "clsx"
import { Truck } from "lucide-react"

// Extended cart item product type to include seller
type ExtendedStoreProduct = HttpTypes.StoreProduct & {
  seller?: {
    id: string
    name: string
  }
}


// Cart item type definition
type CartItem = {
  product?: ExtendedStoreProduct
  // Include other cart item properties as needed
}

export type StoreCardShippingMethod = HttpTypes.StoreCartShippingOption & {
  seller_id?: string
  service_zone?: {
    fulfillment_set: {
      type: string
    }
  }
}

type ShippingProps = {
  cart: Omit<HttpTypes.StoreCart, "items"> & {
    items?: CartItem[]
  }
  availableShippingMethods:
  | (StoreCardShippingMethod &
    { rules: any; seller_id: string; price_type: string; id: string }[])
  | null
}

const CartShippingMethodsSection: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
}) => {
  const [isLoadingPrices, setIsLoadingPrices] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({})
  const [error, setError] = useState<string | null>(null)
  const [missingModal, setMissingModal] = useState(false)
  const [missingShippingSellers, setMissingShippingSellers] = useState<
    string[]
  >([])

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()




  const _shippingMethods = availableShippingMethods?.filter(
    (sm) =>
      sm.rules?.find((rule: any) => rule.attribute === "is_return")?.value !==
      "true"
  )

  useEffect(() => {
    const set = new Set<string>()
    cart.items?.forEach((item) => {
      if (item?.product?.seller?.id) {
        set.add(item.product.seller.id)
      }
    })

    const sellerMethods = _shippingMethods?.map(({ seller_id }) => seller_id)

    const missingSellerIds = [...set].filter(
      (sellerId) => !sellerMethods?.includes(sellerId)
    )

    setMissingShippingSellers(Array.from(missingSellerIds))

    if (missingSellerIds.length > 0 && !cart.shipping_methods?.length) {
      setMissingModal(true)
    }
  }, [cart])

  useEffect(() => {
    if (_shippingMethods?.length) {
      const promises = _shippingMethods
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cart.id))

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {}
          res
            .filter((r) => r.status === "fulfilled")
            .forEach((p) => (pricesMap[p.value?.id || ""] = p.value?.amount!))

          setCalculatedPricesMap(pricesMap)
          setIsLoadingPrices(false)
        })
      }
    }
  }, [availableShippingMethods])



  const handleSetShippingMethod = async (id: string | null) => {
    setIsLoadingPrices(true)
    setError(null)

    if (!id) {
      setIsLoadingPrices(false)
      return
    }

    await setShippingMethod({ cartId: cart.id, shippingMethodId: id }).catch(
      (err) => {
        setError(err.message)
      }
    )
    setIsOpen(false)
    setIsLoadingPrices(false)
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  const groupedBySellerId = _shippingMethods?.reduce((acc: any, method) => {
    const sellerId = method.seller_id!

    if (!acc[sellerId]) {
      acc[sellerId] = []
    }

    acc[sellerId].push(method)
    return acc
  }, {})

  const handleEdit = () => {
    setIsOpen(true)
  }

  const missingSellers = cart.items
    ?.filter((item) =>
      missingShippingSellers.includes(item.product?.seller?.id!)
    )
    .map((item) => item.product?.seller?.name)

  return (
    <div className="bg-white p-4 rounded-[16px] border border-[#F5F5F6] shadow-[0_4px_4px_rgba(0,0,0,0.25)] mx-4 md:mx-0 mt-4">
      {missingModal && (
        <Modal
          heading="Missing seller shipping option"
          onClose={() => router.push("/")}
        >
          <div className="p-4">
            <h2 className="heading-sm">
              Some of the sellers in your cart do not have shipping options.
            </h2>

            <p className="text-md mt-3">
              Please remove the{" "}
              <span className="font-bold">
                {missingSellers?.map(
                  (seller, index) =>
                    `${seller}${index === missingSellers.length - 1 ? " " : ", "
                    }`
                )}
              </span>{" "}
              items or contact{" "}
              {missingSellers && missingSellers?.length > 1 ? "them" : "him"} to
              get the shipping options.
            </p>
          </div>
        </Modal>
      )}
      <div className="space-y-4 px-4 md:px-0 mt-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-[#e3e8ec] rounded-md flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] bg-[length:4px_4px]" />
            <Truck className="w-5 h-5 text-[#2b5bf7] relative z-10" />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                Shipping Method
                {!isOpen && (cart.shipping_methods?.length ?? 0) > 0 && (
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

            {/* Content */}
            <div className="mt-2 border-t border-gray-200 pt-3">
              {isOpen ? (
                <div className="space-y-4">
                  {Object.keys(groupedBySellerId).map((key) => (
                    <div key={key}>
                      <p className="text-[13px] font-medium text-gray-900 mb-1">
                        {groupedBySellerId[key][0].seller_name}
                      </p>

                      <Listbox
                        value={cart.shipping_methods?.[0]?.id}
                        onChange={handleSetShippingMethod}
                      >
                        <div className="relative">
                          <Listbox.Button className="w-full h-11 px-3 border border-gray-200 rounded-md text-[13px] text-gray-600 flex justify-between items-center">
                            Choose shipping option
                            <ChevronUpDown className="w-4 h-4 text-gray-400" />
                          </Listbox.Button>

                          <Transition as={Fragment}>
                            <Listbox.Options className="absolute z-20 w-full bg-white border border-gray-200 rounded-md mt-1 max-h-56 overflow-auto">
                              {groupedBySellerId[key].map((option: any) => (
                                <Listbox.Option
                                  key={option.id}
                                  value={option.id}
                                  className="px-4 py-3 text-[13px] text-gray-700 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                >
                                  {option.name} —{" "}
                                  {convertToLocale({
                                    amount: option.amount!,
                                    currency_code: cart.currency_code,
                                  })}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                    </div>
                  ))}
                  {cart && (cart.shipping_methods?.length ?? 0) > 0 && (
                    <div className="flex flex-col">
                      {cart.shipping_methods?.map((method) => (
                        <CartShippingMethodRow
                          key={method.id}
                          method={method}
                          currency_code={cart.currency_code}
                        />
                      ))}
                    </div>
                  )}

                  <ErrorMessage error={error} />
                </div>
              ) : (
                <div className="space-y-2">
                  {cart.shipping_methods?.map((method) => (
                    <div key={method.id}>
                      <p className="text-[13px] text-gray-700">
                        {method.name} —{" "}
                        {convertToLocale({
                          amount: method.amount!,
                          currency_code: cart.currency_code,
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}

export default CartShippingMethodsSection
