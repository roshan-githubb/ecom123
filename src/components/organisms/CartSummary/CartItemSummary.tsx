"use client"

import { FiShoppingCart } from "react-icons/fi"
import React, { useEffect, useState } from "react"
import { useCartStore } from "@/store/useCartStore"
import { mapCartToOrderSummary, OrderSummaryData, OrderSummaryItem } from "@/lib/mapper/cartMapper";
import Image from "next/image";
import Link from "next/link";
// import { CheckoutSkeleton } from "../CartSkeleton/CartSkeleton";
import { Button } from "@/components/sections/Checkout/DeliveryAddress";
import { Modal } from "@/components/molecules/Modal/Modal";
import { useRouter } from "next/navigation";
import { placeOrder } from "@/lib/data/cart";
import { AuthErrorModal } from "@/components/molecules/InvalidAuthModal/InvalidAuthModal";

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


const ItemCounter: React.FC<{ quantity: number; lineItemId: string; variantId?: string; }> = ({
  quantity,
  lineItemId,
  variantId
}) => {
  const [optimisticQuantity, setOptimisticQuantity] = useState(quantity)
  const [updateTimeout, setUpdateTimeout] = useState<NodeJS.Timeout | null>(null)
  const [isIncreasing, setIsIncreasing] = useState(false)

  const increase = useCartStore((s) => s.increase)
  const decrease = useCartStore((s) => s.decrease)

  // Update optimistic quantity when prop changes
  useEffect(() => {
    setOptimisticQuantity(quantity)
  }, [quantity])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeout) {
        clearTimeout(updateTimeout)
      }
    }
  }, [updateTimeout])

  const handleQuantityChange = async (newQuantity: number, action: 'increase' | 'decrease') => {
    // Clear existing timeout
    if (updateTimeout) {
      clearTimeout(updateTimeout)
    }

    // For decrease operations, we can still do optimistic updates since we're reducing quantity
    if (action === 'decrease') {
      setOptimisticQuantity(newQuantity)

      // Debounce API call
      const timeout = setTimeout(async () => {
        try {
          await decrease(lineItemId, quantity)
        } catch (error) {
          // Revert optimistic update on error
          setOptimisticQuantity(quantity)
          console.error('Failed to decrease quantity:', error)
          
          const { cartToast } = require("@/lib/cart-toast")
          cartToast.showErrorToast("Failed to update quantity. Please try again.")
        }
      }, 300) // 300ms debounce

      setUpdateTimeout(timeout)
    }
  }

  const handleIncrease = async () => {
    if (isIncreasing) return // Prevent multiple clicks
    
    setIsIncreasing(true)
    const currentQuantity = optimisticQuantity
    
    try {
      await increase(lineItemId, quantity)
      
      // Check if quantity actually increased after a short delay
      setTimeout(() => {
        const { items } = useCartStore.getState()
        const updatedItem = items.find(item => item.id === lineItemId)
        
        if (updatedItem && updatedItem.quantity === currentQuantity) {
          // Quantity didn't increase, show out of stock toast
          const { cartToast } = require("@/lib/cart-toast")
          cartToast.showOutOfStockToast("Cannot add more items. It is out of stock.")
        }
        setIsIncreasing(false)
      }, 200) // Small delay to let the store update
      
    } catch (error) {
      console.error('Failed to increase quantity:', error)
      
      // Show toast for any API error
      const { cartToast } = require("@/lib/cart-toast")
      cartToast.showOutOfStockToast("Cannot add more items. It is out of stock.")
      setIsIncreasing(false)
    }
  }

  const handleDecrease = () => {
    if (optimisticQuantity > 1) {
      handleQuantityChange(optimisticQuantity - 1, 'decrease')
    } else {
      // For quantity 1, handle removal immediately
      decrease(lineItemId, quantity)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button
        className="flex justify-center items-center w-6 h-6 text-sm font-semibold text-black border border-gray-300 rounded-full hover:bg-gray-50 active:scale-95 transition-all duration-200"
        onClick={handleDecrease}
      >
        <svg width="6" height="2" viewBox="0 0 6 2" fill="none">
          <path
            d="M5.08844 0.000187397V1.41619H0.000437528V0.000187397H5.08844Z"
            fill="currentColor"
          />
        </svg>
      </button>

      <span className="text-sm font-semibold text-myBlue w-4 text-center">
        {optimisticQuantity}
      </span>

      <button
        className={`flex justify-center items-center w-6 h-6 text-sm font-semibold border border-gray-300 rounded-full transition-all duration-200 ${
          isIncreasing 
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
  )
}

export default ItemCounter


const OrderRow: React.FC<{ item: OrderSummaryItem }> = ({ item }) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <Image
        height={50}
        width={35}
        className="w-[35px] h-[35px] sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px] rounded-[8px] md:rounded-[12px] lg:rounded-[16px] object-cover"
        src={item.thumbnail || "/images/not-available/not-available.png"}
        alt={item.title}
      />
      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.productId}`}>
          <p className="text-[#222222] font-medium text-sm truncate">
            {item.title}
          </p>
        </Link>
        {item.variantTitle && (
          <p className="text-xs text-gray-600 font-medium">
            {item.variantTitle}
          </p>
        )}
      </div>
      <div className="mr-5">
        <ItemCounter quantity={item.quantity} lineItemId={item?.lineId} variantId={item?.variantId} />
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

  console.log('delivery fee ', deliveryFee)

  // Show loading skeleton while fetching
  if (loading || !cartId) {
    return (
      <div className="bg-white p-4 rounded-[16px] border border-[#F5F5F6] shadow-[0_4px_4px_rgba(0,0,0,0.25)] mx-4 md:mx-0 mt-6 animate-pulse">
        <div className="h-5 w-32 bg-gray-200 rounded mb-4"></div>
        
        {/* Item rows skeleton */}
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

  // Only show empty message after loading is complete
  if (cartSummary && !cartSummary?.items.length) {
    return <EmptyCartCard />
  }


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

export const RememberUserInfo = () => {
  const [checked, setChecked] = useState(false)
  const [hasAddress, setHasAddress] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [isCheckingAddress, setIsCheckingAddress] = useState(false)
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showAuthInvalidModal, setShowAuthInvalidModal] = useState(false)

  const onPaymentCompleted = async () => {
    try {
      const res = await placeOrder()
      if (res?.status === 401) {
        console.log("401 received on client", res)
        setShowAuthInvalidModal(true)
      }
    }
    catch (err: any) {
      setErrorMessage(err.message !== "NEXT_REDIRECT" ? err.message : null)
    }

  }

  const handlePlaceOrderClick = () => {
    onPaymentCompleted()

  }

  const {
    cartId,
    fetchCart,
    totalPayable
  } = useCartStore()

  // Check if address exists
  useEffect(() => {
    checkAddress()
  }, [cartId])

  async function checkAddress() {
    if (!cartId) {
      setHasAddress(false)
      return
    }

    try {
      const res = await fetch("/api/cart/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart_id: cartId }),
      })
      const data = await res.json()
      const shippingAddr = data?.cart?.shipping_address
      console.log("shipping addr ", data, data?.cart?.shipping_address)
      // Check if address exists AND has actual data (not just null properties)
      const isValid = shippingAddr && shippingAddr.first_name && shippingAddr.address_1
      setHasAddress(!!isValid)
      console.log("save userinfo Address check:", { shippingAddr, isValid })
    } catch (err) {
      console.error("Failed to check address:", err)
      setHasAddress(false)
    }
  }
  
  if (!cartId) return null;



  return (
    <>

      <div className="bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-100 mt-4 z-10 max-w-md mx-auto">
        <Button 
          variant="primary" 
          onClick={handlePlaceOrderClick}
          disabled={isCheckingAddress}
          className={`flex items-center bg-myBlue justify-center gap-2 ${
            isCheckingAddress ? 'bg-blue-400 cursor-not-allowed' : ''
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
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg bg-myBlue px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Continue shopping
        </button>
      </div>
    </div>
  )
}
