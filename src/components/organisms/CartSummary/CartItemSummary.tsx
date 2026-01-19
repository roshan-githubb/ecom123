"use client"

import { FiShoppingCart } from "react-icons/fi"
import React, { useEffect, useState } from "react"
import { useCartStore } from "@/store/useCartStore"
import { mapCartToOrderSummary, OrderSummaryData, OrderSummaryItem } from "@/lib/mapper/cartMapper";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/sections/Checkout/DeliveryAddress";
import { Modal } from "@/components/molecules/Modal/Modal";
import { useRouter } from "next/navigation";
import { placeOrder } from "@/lib/data/cart";
import { AuthErrorModal } from "@/components/molecules/InvalidAuthModal/InvalidAuthModal";
import { useParams } from "next/navigation";
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink";

interface OrderSummaryProps {
  summary: OrderSummaryData;
}

export interface OrderItem {
  id: string
  name: string
  variant: string
  price: number
  quantity: number
  imageUrl: string
  color?: string
  options?: Record<string, string>
}


const ItemCounter: React.FC<{ quantity: number; lineItemId: string; variantId?: string; totalItems: number }> = ({
  quantity,
  lineItemId,
  variantId,
  totalItems
}) => {
  const [isIncreasing, setIsIncreasing] = useState(false)
  const [isDecreasing, setIsDecreasing] = useState(false)
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const router = useRouter()

  const increase = useCartStore((s) => s.increase)
  const decrease = useCartStore((s) => s.decrease)

  const handleIncrease = async () => {
    if (isIncreasing) return

    setIsIncreasing(true)
    const currentQuantity = quantity

    try {
      await increase(lineItemId, quantity)


      setTimeout(() => {
        const { items } = useCartStore.getState()
        const updatedItem = items.find(item => item.id === lineItemId)

        if (updatedItem && updatedItem.quantity === currentQuantity) {
          // Quantity didn't increase, show out of stock toast
          const { cartToast } = require("@/lib/cart-toast")
          cartToast.showOutOfStockToast("Cannot add more items. It is out of stock.")
        }
        setIsIncreasing(false)
      }, 200)

    } catch (error) {
      const { cartToast } = require("@/lib/cart-toast")
      cartToast.showOutOfStockToast("Cannot add more items. It is out of stock.")
      setIsIncreasing(false)
    }
  }

  const handleDecrease = async () => {
    if (isDecreasing) return


    if (quantity === 1 && totalItems === 1) {
      setShowRemoveModal(true)
      return
    }

    setIsDecreasing(true)

    try {
      await decrease(lineItemId, quantity)
    } catch (error) {
      const { cartToast } = require("@/lib/cart-toast")
      cartToast.showErrorToast("Failed to update quantity. Please try again.")
    } finally {
      setIsDecreasing(false)
    }
  }

  const handleConfirmRemove = async () => {
    setShowRemoveModal(false)
    
    try {
      // Remove the last item
      await decrease(lineItemId, quantity)
      
      // Clear local cart state
      const { useCartStore } = await import("@/store/useCartStore")
      useCartStore.getState().clearLocal()
      
      // Small delay to ensure state is cleared
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Redirect to homepage
      router.push('/')
    } catch (error) {
      console.error("Failed to remove last item:", error)
      router.push('/')
    }
  }

  return (
    <>
      <div className="flex items-center gap-1">
        <button
          className={`flex justify-center items-center w-6 h-6 text-sm font-semibold border border-gray-300 rounded-full transition-all duration-200 ${isDecreasing
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'text-black hover:bg-gray-50 active:scale-95'
            }`}
          onClick={handleDecrease}
          disabled={isDecreasing}
        >
          {isDecreasing ? (
            <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg width="6" height="2" viewBox="0 0 6 2" fill="none">
              <path
                d="M5.08844 0.000187397V1.41619H0.000437528V0.000187397H5.08844Z"
                fill="currentColor"
              />
            </svg>
          )}
        </button>

        <span className="text-sm font-semibold text-myBlue w-4 text-center">
          {quantity}
        </span>

        <button
          className={`flex justify-center items-center w-6 h-6 text-sm font-semibold border border-gray-300 rounded-full transition-all duration-200 ${isIncreasing
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'text-black hover:bg-gray-50 active:scale-95'
            }`}
          onClick={handleIncrease}
          disabled={isIncreasing}
        >
          {isIncreasing ? (
            <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15.061 12.46H12.793V14.788H11.209V12.46H8.94103V10.996H11.209V8.668H12.793V10.996H15.061V12.46Z"
                fill="currentColor"
              />
            </svg>
          )}
        </button>
      </div>


      {showRemoveModal && (
        <Modal heading="" onClose={() => setShowRemoveModal(false)} showCloseButton={false}>
          <div className="px-6 pb-6 max-w-sm">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 text-center mb-3">
              Remove Last Item?
            </h2>

            <p className="text-gray-600 text-center text-sm mb-6 leading-relaxed">
              This is the last item in your cart. Removing it will empty your cart and redirect you to the homepage.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleConfirmRemove}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all"
              >
                Remove Item
              </button>

              <button
                onClick={() => setShowRemoveModal(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold text-sm transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

export default ItemCounter

const OrderRow: React.FC<{ item: any; totalItems: number }> = ({ item, totalItems }) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <LocalizedClientLink
        href={`/products/${item.productId}`}
        className="flex-shrink-0 active:scale-95 active:opacity-80 transition-transform"
      >
        <Image
          height={50}
          width={35}
          className="w-[35px] h-[35px] sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px] rounded-[8px] md:rounded-[12px] lg:rounded-[16px] object-cover hover:opacity-80 transition-opacity"
          src={item.thumbnail || "/images/not-available/not-available.png"}
          alt={item.title}
        />
      </LocalizedClientLink>
      <div className="flex-1 min-w-0">
        <LocalizedClientLink
          href={`/products/${item.productId}`}
          className="text-left w-full active:scale-95 transition-transform"
        >
          <p className="text-[#222222] font-medium text-sm truncate active:text-myBlue transition-colors">
            {item.title}
          </p>
        </LocalizedClientLink>
        {item.variantTitle && (
          <p className="text-xs text-gray-600 font-medium">
            {item.variantTitle}
          </p>
        )}
      </div>
      <div className="mr-5">
        <ItemCounter quantity={item.quantity} lineItemId={item?.lineId} variantId={item?.variantId} totalItems={totalItems} />
      </div>
      <span className="text-[#444444] font-semibold text-sm w-20 text-right">
        Rs {(item.unitPrice).toLocaleString()}
      </span>
    </div>
  )
}

export function OrderSummary() {
  const [loading, setLoading] = useState(true)

  const {
    cartId,
    items,
    subtotal,
    taxTotal,
    deliveryFee,
    serviceFee,
    totalPayable,
    currency,
    fetchCart,
    discountTotal,
    promotions
  } = useCartStore()


  const summary = {
    currency,
    subtotal,
    discountTotal,
    taxTotal,
    deliveryFee,
    serviceFee,
    totalPayable,
    items,
    cartId,
    promotions
  }

  useEffect(() => {
    const fetchCartData = async () => {
      setLoading(true)
      await fetchCart();
      setLoading(false)
    }
    fetchCartData()
  }, [fetchCart])




  if (loading || !cartId) {
    return (
      <div className="bg-white p-4 rounded-[16px] border border-[#F5F5F6] shadow-[0_4px_4px_rgba(0,0,0,0.25)] mx-4 md:mx-0 mt-6 animate-pulse">
        <div className="h-5 w-32 bg-gray-200 rounded mb-4"></div>


        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2 mb-3">
            <div className="w-[35px] h-[35px] bg-gray-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-4 w-32 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="h-6 w-20 bg-gray-200 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </div>
        ))}

        <div className="border-t pt-4 mt-4 space-y-3">
          <div className="flex justify-between">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-4 w-12 bg-gray-200 rounded"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-4 w-28 bg-gray-200 rounded"></div>
            <div className="h-4 w-14 bg-gray-200 rounded"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
            <div className="h-4 w-12 bg-gray-200 rounded"></div>
          </div>
        </div>

        <div className="border-t pt-4 mt-4 flex justify-between">
          <div className="h-5 w-24 bg-gray-200 rounded"></div>
          <div className="h-5 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }



  const cartSummary = mapCartToOrderSummary(summary)

  return (
    <div className="bg-white p-4 rounded-[16px] border border-[#F5F5F6] shadow-[0_4px_4px_rgba(0,0,0,0.25)] mx-4 md:mx-0 mt-6">
      <h2 className="text-lg font-semibold text-[#333333] mb-1">
        Order Summary
      </h2>
      <div className="pb-4 border-b border-gray-100 space-y-2">
        {cartSummary.items.map((item: any) => (
          <OrderRow
            key={`${item.lineId}`}
            item={item}
            totalItems={cartSummary.items.length}
          />
        ))}
      </div>
      <div className="pt-4 pb-4 border-b border-gray-100">
        <div className="flex justify-between items-center py-1">
          <span className="text-sm font-medium text-[#777777]">Subtotal</span>
          <span className="text-sm font-medium text-[#444444]">
            Rs {summary?.subtotal.toLocaleString()}
          </span>
        </div>
        {summary.discountTotal > 0 && (
          <div className="flex justify-between items-center py-1">
            <span className="text-sm font-medium text-green-600">
              Promotion ({summary.promotions.map(p => p.code).join(", ")})
            </span>
            <span className="text-sm font-medium text-green-600">
              − Rs {summary.discountTotal.toLocaleString()}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center py-1">
          <span className="text-sm font-medium text-[#777777]">
            Delivery Charge
          </span>
          <span className="text-sm font-medium text-[#FF0000]">
            Rs {summary?.deliveryFee.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-sm font-medium text-[#777777]">
            Tax Total
          </span>
          <span className="text-sm font-medium text-[#444444]">
            Rs {summary?.taxTotal.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="flex justify-between items-center pt-4">
        <span className="text-[#222222] font-medium text-base">
          Total Payable
        </span>
        <span className="text-[#222222] font-semibold text-lg">
          Rs {summary?.totalPayable.toLocaleString()}
        </span>
      </div>
    </div>
  )
}

export const RememberUserInfo = ({ isReady = true }: { isReady?: boolean }) => {
  const [checked, setChecked] = useState(false)
  const [hasAddress, setHasAddress] = useState(false)
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false)
  const [hasShippingMethod, setHasShippingMethod] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [isCheckingAddress, setIsCheckingAddress] = useState(false)
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showAuthInvalidModal, setShowAuthInvalidModal] = useState(false)
  const {
    cartId,
    fetchCart,
    totalPayable
  } = useCartStore()

  const onPaymentCompleted = async () => {
    try {
      const res = await placeOrder()
      if (res?.status === 401) {
        setShowAuthInvalidModal(true)
      } else if (!res?.error) {
        const { useCartStore } = await import("@/store/useCartStore");
        useCartStore.getState().clearLocal();
      }
      if (res?.success) {
        localStorage.removeItem("cart_id")
        localStorage.removeItem("global-cart")


        useCartStore.getState().reset()


        router.push(`/order/${res.orderId}/confirmed`)
      }
    }
    catch (err: any) {
      if (err.message === "NEXT_REDIRECT") {
        const { useCartStore } = await import("@/store/useCartStore");
        useCartStore.getState().clearLocal();
      } else {
        setErrorMessage(err.message)
      }
    }
  }

  const handlePlaceOrderClick = async () => {
    if (!hasAddress) {
      const { cartToast } = await import("@/lib/cart-toast")
      cartToast.showErrorToast("Please add a delivery address to continue")
      return
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const res = await fetch("/api/cart/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart_id: cartId }),
      })
      const data = await res.json()
      const cart = data?.cart

      if (!cart) {
        const { cartToast } = await import("@/lib/cart-toast")
        cartToast.showErrorToast("Failed to load cart. Please try again.")
        return
      }

      const uniqueSellers = new Set(
        cart.items?.map((item: any) => item.product?.seller?.id).filter(Boolean)
      )
      const vendorCount = uniqueSellers.size
      const shippingMethodCount = cart.shipping_methods?.length ?? 0

      const hasShippingMethods = cart.shipping_methods && cart.shipping_methods.length > 0
      const allVendorsHaveShipping = vendorCount > 0 && shippingMethodCount >= vendorCount

      const hasPaymentSession = cart.payment_collection?.payment_sessions?.some(
        (session: any) => session.status === "pending"
      )

      const missingItems: string[] = []

      if (!hasShippingMethods) {
        if (vendorCount > 1) {
          missingItems.push("shipping methods for all vendors")
        } else {
          missingItems.push("shipping method")
        }
      } else if (vendorCount > 1 && !allVendorsHaveShipping) {
        const { cartToast } = await import("@/lib/cart-toast")
        cartToast.showErrorToast(`Please select shipping methods for all ${vendorCount} vendors`)
        return
      }

      if (!hasPaymentSession) {
        missingItems.push("payment method")
      }

      // Show appropriate error message
      if (missingItems.length > 0) {
        const { cartToast } = await import("@/lib/cart-toast")
        if (missingItems.length === 1) {
          cartToast.showErrorToast(`Please add a ${missingItems[0]} to continue`)
        } else if (missingItems.length === 2) {
          cartToast.showErrorToast(`Please add ${missingItems[0]} and ${missingItems[1]} to continue`)
        }
        return
      }

      router.push('/order-summary')
    } catch (err) {
      console.error("Failed to validate checkout:", err)
      const { cartToast } = await import("@/lib/cart-toast")
      cartToast.showErrorToast("Failed to validate checkout. Please try again.")
      return
    }
  }

  useEffect(() => {
    checkAddress()
    
    const handleAddressUpdate = () => {
      checkAddress()
    }
    
    const handleShippingUpdate = () => {
      checkAddress()
    }
    
    const handlePaymentUpdate = () => {
      checkAddress()
    }
    
    window.addEventListener('addressUpdated', handleAddressUpdate)
    window.addEventListener('shippingUpdated', handleShippingUpdate)
    window.addEventListener('paymentUpdated', handlePaymentUpdate)
    
    return () => {
      window.removeEventListener('addressUpdated', handleAddressUpdate)
      window.removeEventListener('shippingUpdated', handleShippingUpdate)
      window.removeEventListener('paymentUpdated', handlePaymentUpdate)
    }
  }, [cartId])

  async function checkAddress() {
    if (!cartId) {
      setHasAddress(false)
      setHasPaymentMethod(false)
      setHasShippingMethod(false)
      return
    }

    setIsCheckingAddress(true)
    try {
      const res = await fetch("/api/cart/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart_id: cartId }),
      })
      const data = await res.json()
      const cart = data?.cart
      
      const shippingAddr = cart?.shipping_address
      const isValid = shippingAddr && shippingAddr.first_name && shippingAddr.address_1
      setHasAddress(!!isValid)
      
      const hasShipping = cart?.shipping_methods && cart.shipping_methods.length > 0
      setHasShippingMethod(!!hasShipping)
      
      const hasPayment = cart?.payment_collection?.payment_sessions?.some(
        (session: any) => session.status === "pending"
      )
      setHasPaymentMethod(!!hasPayment)
    } catch (err) {
      console.error("Failed to check address:", err)
      setHasAddress(false)
      setHasPaymentMethod(false)
      setHasShippingMethod(false)
    } finally {
      setIsCheckingAddress(false)
    }
  }

  if (!cartId) return null;



  return (
    <>

      <div className="bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-100 mt-4 z-10 max-w-md mx-auto">
        {!isCheckingAddress && (
          <>
            {hasAddress && !hasShippingMethod && (
              <p className="text-xs text-red-600 mb-2 text-center font-medium">
                Please add shipping method to continue
              </p>
            )}
            
            {hasAddress && hasShippingMethod && !hasPaymentMethod && isReady && (
              <p className="text-xs text-red-600 mb-2 text-center font-medium">
                Please select a payment method to enable Place Order
              </p>
            )}
          </>
        )}
        
        <Button
          variant="primary"
          onClick={handlePlaceOrderClick}
          disabled={isCheckingAddress || !isReady || !hasPaymentMethod}
          className={`flex items-center justify-center gap-2 ${
            isCheckingAddress || !isReady || !hasPaymentMethod
              ? 'bg-gray-400 cursor-not-allowed opacity-50'
              : 'bg-myBlue hover:opacity-90'
          }`}
        >
          {isCheckingAddress ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Checking...
            </>
          ) : (
            'Place Order'
          )}
        </Button>
      </div>
      <AuthErrorModal
        open={showAuthInvalidModal}
        onOpenChange={setShowAuthInvalidModal}
      />
    </>
  )
}


export function EmptyCartCard() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <FiShoppingCart className="h-8 w-8 text-gray-400" />
        </div>

        {/* Text */}
        <h2 className="mb-2 text-lg font-semibold text-myBlue">
          Your cart is empty
        </h2>
        <p className="mb-6 text-sm text-gray-500">
          Looks like you haven’t added anything to your cart yet.
        </p>

        {/* CTA */}
        <LocalizedClientLink
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-myBlue px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          Continue shopping
        </LocalizedClientLink>
      </div>
    </div>
  )
}
