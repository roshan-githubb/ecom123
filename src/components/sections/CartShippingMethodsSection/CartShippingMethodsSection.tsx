"use client"

import ErrorMessage from "@/components/molecules/ErrorMessage/ErrorMessage"
import { setShippingMethod } from "@/lib/data/cart"
import { calculatePriceForShippingOption } from "@/lib/data/fulfillment"
import { convertToLocale } from "@/lib/helpers/money"
import { CheckCircleSolid, ChevronUpDown } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Fragment, useEffect, useState } from "react"
import { Modal } from "@/components/molecules"
import { CartShippingMethodRow } from "./CartShippingMethodRow"
import { Listbox, Transition } from "@headlessui/react"
import { Truck } from "lucide-react"
import { removeFromCart, getCart } from "@/services/cart"
import { useCartStore } from "@/store/useCartStore"

// Extended cart item product type to include seller
type ExtendedStoreProduct = HttpTypes.StoreProduct & {
  seller?: {
    id: string
    name: string
  }
}

// Cart item type definition
type CartItem = {
  id?: string
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
  const [isRemovingItems, setIsRemovingItems] = useState(false)

  const router = useRouter()
  const { fetchCart } = useCartStore()

  // Lock/unlock body scroll when modal opens/closes
  useEffect(() => {
    if (missingModal) {
      // Lock scroll
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${window.scrollY}px`
      document.body.style.width = '100%'
    } else {
      // Unlock scroll and restore position
      const scrollY = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
    }
  }, [missingModal])

  // Function to remove all items from specific sellers
  const removeSellerItems = async (sellerIds: string[]) => {
    setIsRemovingItems(true)
    try {
      // Get all items that belong to the missing sellers
      const itemsToRemove = cart.items?.filter(item => 
        item.product?.seller?.id && sellerIds.includes(item.product.seller.id)
      ) || []

      for (const item of itemsToRemove) {
        if (item.id) {
          await removeFromCart(item.id)
        }
      }

      await fetchCart()
      
      setMissingModal(false)
      router.push("/check")
    } catch (error) {
      console.error("Error removing seller items:", error)
      setError("Failed to remove items. Please try again.")
    } finally {
      setIsRemovingItems(false)
    }
  }




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
          heading=""
          onClose={() => router.push("/")}
        >
          <div className="px-6 py-8 max-w-sm mx-auto">
          
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <Truck className="w-8 h-8 text-orange-600" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 text-center mb-3">
              Shipping Not Available
            </h2>

            <p className="text-gray-600 text-center text-sm mb-6 leading-relaxed">
              Some sellers in your cart don't offer shipping to your location yet.
            </p>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                Affected Sellers
              </h3>
              <div className="space-y-1">
                {missingSellers?.map((seller, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-700">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                    {seller}
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-2 flex-shrink-0"></div>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => removeSellerItems(missingShippingSellers)}
                disabled={isRemovingItems}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-red-300 disabled:to-red-400 text-white px-6 py-4 rounded-xl font-semibold text-sm shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed"
              >
                {isRemovingItems ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Removing Items...
                  </div>
                ) : (
                  "Remove These Items"
                )}
              </button>
              
              <button
                onClick={() => router.push("/")}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-4 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-[1.02]"
              >
                Go to homepage
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
              You can also contact the sellers directly to request shipping to your area.
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
