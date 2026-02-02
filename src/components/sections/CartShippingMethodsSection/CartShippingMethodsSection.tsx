"use client"

import ErrorMessage from "@/components/molecules/ErrorMessage/ErrorMessage"
import { setShippingMethod } from "@/lib/data/cart"
import { calculatePriceForShippingOption } from "@/lib/data/fulfillment"
import { convertToLocale } from "@/lib/helpers/money"
import { CheckCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { useRouter } from "next/navigation"
import { useEffect, useState, useMemo, useRef } from "react"
import { Modal } from "@/components/molecules"
import { Truck, ChevronDown } from "lucide-react"
import { removeFromCart } from "@/services/cart"
import { useCartStore } from "@/store/useCartStore"

type ExtendedStoreProduct = HttpTypes.StoreProduct & {
  seller?: {
    id: string
    name: string
  }
}

type CartItem = {
  id?: string
  product?: ExtendedStoreProduct
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
  onShippingUpdate?: () => Promise<void>
}

const CartShippingMethodsSection: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
  onShippingUpdate,
}) => {
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<Record<string, number>>({})
  const [error, setError] = useState<string | null>(null)
  const [missingModal, setMissingModal] = useState(false)
  const [missingShippingSellers, setMissingShippingSellers] = useState<string[]>([])
  const [isRemovingItems, setIsRemovingItems] = useState(false)
  const [loadingVendorId, setLoadingVendorId] = useState<string | null>(null)
  const [expandedVendors, setExpandedVendors] = useState<Set<string>>(new Set())
  const [hasInitialized, setHasInitialized] = useState(false)
  const [clientShippingMethods, setClientShippingMethods] = useState<any>(availableShippingMethods)
  // Use ref to persist cache across renders without causing re-renders
  const sellerIdCacheRef = useRef<Record<string, string>>({})

  const router = useRouter()
  const fetchCart = useCartStore(state => state.fetchCart)

 
  const sellersInCart = useMemo(() => {
    const sellers: Record<string, { id: string; name: string }> = {}
    cart.items?.forEach((item) => {
      const seller = item.product?.seller
      if (seller?.id) {
        sellers[seller.id] = {
          id: seller.id,
          name: seller.name || "Vendor"
        }
      }
    })
    return sellers
  }, [cart.items])

  
  useEffect(() => {
    if (cart.id && Object.keys(sellersInCart).length > 0) {
      const sellerIds = Object.keys(sellersInCart).sort().join(',')
      const currentCacheKey = `shipping_methods_${cart.id}_${sellerIds}`
      
      
      const needsUpdate = !localStorage.getItem(currentCacheKey)
      
      if (needsUpdate) {
       
        const validMethods: any[] = []
        
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith(`shipping_methods_${cart.id}_`)) {
            try {
              const cachedData = JSON.parse(localStorage.getItem(key) || '[]')
              cachedData.forEach((method: any) => {
               
                if (method.seller_id && sellersInCart[method.seller_id]) {
                  const exists = validMethods.some((m: any) => m.id === method.id)
                  if (!exists) {
                    validMethods.push(method)
                  }
                }
              })
            } catch (e) {
              
            }
          }
        })
        
      
        if (validMethods.length > 0) {
          localStorage.setItem(currentCacheKey, JSON.stringify(validMethods))
        }
        
      
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith(`shipping_methods_${cart.id}_`) && key !== currentCacheKey) {
            localStorage.removeItem(key)
          }
        })
      }
    }
  }, [cart.id, sellersInCart])
 
  useEffect(() => {
    const fetchAndCacheShippingMethods = async () => {
      if (cart.id) {
        
        const sellerIds = Object.keys(sellersInCart).sort().join(',')
        const cacheKey = `shipping_methods_${cart.id}_${sellerIds}`
        
        
        const allCachedMethods: any[] = []
        const cacheKeysToCleanup: string[] = []
        
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith(`shipping_methods_${cart.id}_`)) {
            try {
              const cachedData = JSON.parse(localStorage.getItem(key) || '[]')
              cachedData.forEach((method: any) => {
             
                const exists = allCachedMethods.some((m: any) => m.id === method.id)
                if (!exists) {
                  allCachedMethods.push(method)
                }
              })
            
              if (key !== cacheKey) {
                cacheKeysToCleanup.push(key)
              }
            } catch (e) {
              
            }
          }
        })
        
        
        let finalMethods: any[] = []
        
        if (availableShippingMethods && availableShippingMethods.length > 0) {
          
          finalMethods = [...availableShippingMethods]
         
          allCachedMethods.forEach((cachedMethod: any) => {
            const exists = finalMethods.some((m: any) => m.id === cachedMethod.id)
            if (!exists) {
              finalMethods.push(cachedMethod)
            }
          })
        } else if (allCachedMethods.length > 0) {
          
          finalMethods = allCachedMethods
        } else {
      
          try {
            const response = await fetch(`/api/cart/shipping-options?cart_id=${cart.id}`)
            const data = await response.json()
            if (data.shipping_options && data.shipping_options.length > 0) {
              finalMethods = data.shipping_options
            }
          } catch (error) {
          
          }
        }
        
       
        if (finalMethods.length > 0) {
          setClientShippingMethods(finalMethods)
          localStorage.setItem(cacheKey, JSON.stringify(finalMethods))
          
         
          cacheKeysToCleanup.forEach(key => localStorage.removeItem(key))
        }
      }
    }
    fetchAndCacheShippingMethods()
  }, [cart.id, availableShippingMethods, sellersInCart])


  const _shippingMethods = useMemo(() => {
    const methods = clientShippingMethods || availableShippingMethods
    const filtered = methods?.filter(
      (sm: any) =>
        sm.rules?.find((rule: any) => rule.attribute === "is_return")?.value !==
        "true"
    )
    return filtered
  }, [clientShippingMethods, availableShippingMethods])

  useEffect(() => {
    if (missingModal) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${window.scrollY}px`
      document.body.style.width = '100%'
    } else {
      const scrollY = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
    }
  }, [missingModal])

  const removeSellerItems = async (sellerIds: string[]) => {
    setIsRemovingItems(true)
    try {
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
      setError("Failed to remove items. Please try again.")
    } finally {
      setIsRemovingItems(false)
    }
  }

  // Build and cache the seller_id mapping from available shipping methods
  useEffect(() => {
    if (_shippingMethods?.length) {
      _shippingMethods.forEach((method: StoreCardShippingMethod) => {
        if (method.id && method.seller_id) {
          sellerIdCacheRef.current[method.id] = method.seller_id
        }
      })
    }
  }, [_shippingMethods])

  useEffect(() => {
    const set = new Set<string>()
    cart.items?.forEach((item) => {
      if (item?.product?.seller?.id) {
        set.add(item.product.seller.id)
      }
    })

    const sellerMethods = _shippingMethods?.map(({ seller_id }: StoreCardShippingMethod) => seller_id)
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
        .filter((sm: StoreCardShippingMethod) => sm.price_type === "calculated")
        .map((sm: StoreCardShippingMethod) => calculatePriceForShippingOption(sm.id, cart.id))

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {}
          res
            .filter((r) => r.status === "fulfilled")
            .forEach((p) => (pricesMap[p.value?.id || ""] = p.value?.amount!))

          setCalculatedPricesMap(pricesMap)
        })
      }
    }
  }, [availableShippingMethods, _shippingMethods, cart.id])

  const handleSetShippingMethod = async (id: string | null, sellerId: string) => {
    setError(null)

    if (!id) {
      return
    }

    setLoadingVendorId(sellerId)

    try {
      await setShippingMethod({
        cartId: cart.id,
        shippingMethodId: id,
      })

      await fetchCart()

      await onShippingUpdate?.()

  
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoadingVendorId(null)
    }
  }

  const toggleVendor = (sellerId: string) => {
    setExpandedVendors(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sellerId)) {
        newSet.delete(sellerId)
      } else {
        newSet.add(sellerId)
      }
      return newSet
    })
  }

  const selectedShippingByVendor = useMemo(() => {
    return cart.shipping_methods?.reduce((acc: any, method: any) => {
      // Try to find seller_id from:
      // 1. The matching method in _shippingMethods
      // 2. The cached seller_id mapping
      // 3. The shipping_option object itself (if retrieved)
      // 4. Default to first seller if only one exists in cart (risky but better than nothing)

      const matchingMethod = _shippingMethods?.find((sm: StoreCardShippingMethod) => sm.id === method.shipping_option_id)
      let sellerId = matchingMethod?.seller_id || sellerIdCacheRef.current[method.shipping_option_id]

      if (!sellerId && method.shipping_option) {
        sellerId = (method.shipping_option as any).seller_id ||
          (method.shipping_option.metadata?.seller_id)
      }

      const cartSellers = Object.keys(sellersInCart)
      if (!sellerId && cartSellers.length === 1) {
        sellerId = cartSellers[0]
      }

      if (sellerId) {
        acc[sellerId] = method
      }
      return acc
    }, {}) || {}
  }, [cart.shipping_methods, _shippingMethods, sellersInCart])

  useEffect(() => {
    if (!hasInitialized && Object.keys(sellersInCart).length > 0) {
      setExpandedVendors(new Set(Object.keys(sellersInCart)))
      setHasInitialized(true)
    }
  }, [sellersInCart, hasInitialized])

  useEffect(() => {
    if (hasInitialized) {
      const vendorsWithoutSelection = Object.keys(sellersInCart).filter(
        sellerId => !selectedShippingByVendor[sellerId]
      )
      if (vendorsWithoutSelection.length > 0) {
        setExpandedVendors(prev => {
          const newSet = new Set(prev)
          vendorsWithoutSelection.forEach(id => newSet.add(id))
          return newSet
        })
      }
    }
  }, [sellersInCart, selectedShippingByVendor, hasInitialized])

  // Group available methods by seller ID
  const groupedBySellerId = useMemo(() => {
    const acc: Record<string, any[]> = {}

    // Initialize with all sellers in cart to ensure they appear
    Object.keys(sellersInCart).forEach(id => {
      acc[id] = []
    })

    // Fill with available methods - ONLY for sellers currently in cart
    _shippingMethods?.forEach((method: StoreCardShippingMethod) => {
      const sellerId = method.seller_id!
      // Only include methods for sellers that are currently in the cart
      if (sellersInCart[sellerId]) {
        if (!acc[sellerId]) {
          acc[sellerId] = []
        }
        acc[sellerId].push(method)
      }
    })


    Object.entries(selectedShippingByVendor).forEach(([sellerId, selected]: [string, any]) => {
      // Skip if this seller is no longer in the cart
      if (!sellersInCart[sellerId]) {
        return
      }
      
      const alreadyInList = acc[sellerId]?.some((m: any) => m.id === selected.shipping_option_id)

      if (!alreadyInList) {
        if (!acc[sellerId]) acc[sellerId] = []
        acc[sellerId].push({
          id: selected.shipping_option_id,
          name: selected.name,
          amount: selected.amount,
          description: selected.description || selected.shipping_option?.description,
          seller_id: sellerId,
          is_synthetic: true
        })
      }
    })

    return acc
  }, [_shippingMethods, sellersInCart, selectedShippingByVendor])

  const missingSellers = cart.items
    ?.filter((item) =>
      missingShippingSellers.includes(item.product?.seller?.id!)
    )
    .map((item) => item.product?.seller?.name)



  const allVendorsHaveShipping = groupedBySellerId &&
    Object.keys(groupedBySellerId).every(sellerId => selectedShippingByVendor[sellerId])

  return (
    <>
      {missingModal && (
        <Modal
          heading=""
          onClose={() => router.push("/")}
          showCloseButton={false}
        >
          <div className="px-6 pb-8 max-w-sm mx-5">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <Truck className="w-8 h-8 text-orange-600" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 text-center mb-3">
              Shipping Not Available
            </h2>

            <p className="text-gray-600 text-center text-sm mb-6 leading-relaxed">
              Some sellers in your cart don&apos;t offer shipping to your location yet.
            </p>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 mb-3">
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

      <div className="max-w-md mx-auto mt-4 bg-white rounded-lg p-4">
        <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5 text-myBlue" />
          Shipping Methods
          {allVendorsHaveShipping && (
            <CheckCircleSolid className="w-5 h-5 text-green-600 ml-auto" />
          )}
        </h2>

        <div className="space-y-3">
          {Object.keys(groupedBySellerId).map((sellerId) => {
            const vendorMethods = groupedBySellerId[sellerId] || []
            const vendorName = sellersInCart[sellerId]?.name || vendorMethods[0]?.seller_name || "Vendor"
            const selectedMethod = selectedShippingByVendor[sellerId]
            const isExpanded = expandedVendors.has(sellerId)
            const isLoadingThisVendor = loadingVendorId === sellerId



            return (
              <div key={sellerId} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Vendor Header */}
                <div className="bg-gray-50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <div className={`w-2 h-2 rounded-full ${selectedMethod ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm font-semibold text-gray-900">{vendorName}</span>
                      {selectedMethod && (
                        <CheckCircleSolid className="w-4 h-4 text-green-600 ml-1" />
                      )}
                    </div>
                    <button
                      onClick={() => toggleVendor(sellerId)}
                      disabled={isLoadingThisVendor}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <ChevronDown
                        className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Selected Method Display - Shows when collapsed */}
                {selectedMethod && !isExpanded && (
                  <div className="px-3 pb-3">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <CheckCircleSolid className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm font-medium text-green-900 truncate">
                            {selectedMethod.name || selectedMethod.shipping_option?.name}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-green-900 flex-shrink-0">
                          {convertToLocale({
                            amount: selectedMethod.amount,
                            currency_code: cart.currency_code,
                          })}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleVendor(sellerId)}
                        className="mt-2 text-xs text-green-700 hover:text-green-900 font-medium underline"
                      >
                        Change shipping method
                      </button>
                    </div>
                  </div>
                )}

                {/* Shipping Options - Collapsible */}
                {isExpanded && (
                  <div className="p-3 space-y-2 relative">
                    {/* Loading Overlay for this vendor */}
                    {isLoadingThisVendor && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-myBlue border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm text-gray-700">Updating...</span>
                        </div>
                      </div>
                    )}

                    {vendorMethods.map((method: any) => {
                      const isSelected = selectedMethod?.shipping_option_id === method.id
                      const price = method.price_type === "calculated" && calculatedPricesMap[method.id]
                        ? calculatedPricesMap[method.id]
                        : (method.amount ?? 0)

                      return (
                        <div
                          key={method.id}
                          onClick={() => !isLoadingThisVendor && handleSetShippingMethod(method.id, sellerId)}
                          className={`cursor-pointer ${isLoadingThisVendor ? "pointer-events-none" : ""}`}
                        >
                          <div
                            className={`p-4 rounded-xl border-2 transition-all ${isSelected
                              ? "border-myBlue bg-gradient-to-r from-blue-50 to-blue-100 shadow-sm"
                              : "border-gray-200 bg-white hover:border-myBlue/40 hover:shadow-sm"
                              } ${isLoadingThisVendor ? "opacity-50" : ""}`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 flex-1">
                                {/* Custom Radio Circle */}
                                <div className="relative flex-shrink-0">
                                  <div
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
                                      ? "border-myBlue bg-myBlue shadow-md"
                                      : "border-gray-300 bg-white"
                                      }`}
                                  >
                                    {isSelected && (
                                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                                    )}
                                  </div>
                                  {isSelected && (
                                    <div className="absolute inset-0 rounded-full bg-myBlue/20 animate-ping" />
                                  )}
                                </div>

                                {/* Method Name */}
                                <div className="flex-1 min-w-0">
                                  <span className={`text-sm font-semibold block ${isSelected ? "text-myBlue" : "text-gray-900"}`}>
                                    {method.name}
                                  </span>
                                  {method.description && (
                                    <span className="text-xs text-gray-500 block mt-0.5">
                                      {method.description}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Price */}
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className={`text-sm font-bold ${isSelected ? "text-myBlue" : "text-gray-700"}`}>
                                  {convertToLocale({
                                    amount: price,
                                    currency_code: cart.currency_code,
                                  })}
                                </span>
                                {isSelected && (
                                  <CheckCircleSolid className="w-5 h-5 text-myBlue" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {vendorMethods.length === 0 && !isLoadingThisVendor && (
                      <div className="p-4 text-center border-2 border-dashed border-gray-200 rounded-xl">
                        <p className="text-sm text-gray-500">No any other shipping methods available for this location.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <ErrorMessage error={error} />
      </div>
    </>
  )
}

export default CartShippingMethodsSection
