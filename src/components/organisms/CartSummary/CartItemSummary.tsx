"use client"

import { FiShoppingCart } from "react-icons/fi"
import React, { useEffect, useState } from "react"
import { useCartStore } from "@/store/useCartStore"
import { mapCartToOrderSummary, OrderSummaryData, OrderSummaryItem } from "@/lib/mapper/cartMapper";
import Image from "next/image";
import Link from "next/link";
// import { CheckoutSkeleton } from "../CartSkeleton/CartSkeleton";
import { Button } from "@/components/sections/Checkout/DeliveryAddress";
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


const ItemCounter: React.FC<{ quantity: number; lineItemId: string; }> = ({
  quantity,
  lineItemId
}) => {

  const increase = useCartStore((s) => s.increase)
  const decrease = useCartStore((s) => s.decrease)

  return (
    <div className="flex items-center gap-1">


      <button
        className="flex justify-center items-center w-6 h-6 text-sm font-semibold text-black border border-gray-300 rounded-full"
        onClick={() => decrease(lineItemId, quantity)}
      >
        <svg width="6" height="2" viewBox="0 0 6 2" fill="none">
          <path
            d="M5.08844 0.000187397V1.41619H0.000437528V0.000187397H5.08844Z"
            fill="#3E3E3E"
          />
        </svg>
      </button>

      <span className="text-sm font-semibold text-[#0000FF] w-4 text-center">
        {quantity}
      </span>

      <button
        className="flex justify-center items-center w-6 h-6 text-sm font-semibold text-black border border-gray-300 rounded-full"
        onClick={() => increase(lineItemId, quantity)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M15.061 12.46H12.793V14.788H11.209V12.46H8.94103V10.996H11.209V8.668H12.793V10.996H15.061V12.46Z"
            fill="#3E3E3E"
          />
        </svg>
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
        <p className="text-xs text-gray-500">
          {item.quantity} {item.quantity === 1 ? "Item" : "Items"}
        </p>

      </div>
      <div className="mr-5">
        <ItemCounter quantity={item.quantity} lineItemId={item?.lineId} />
      </div>
      <span className="text-[#444444] font-semibold text-sm w-20 text-right">
        Rs {(item.unitPrice).toLocaleString()}
      </span>
    </div>
  )
}

export function OrderSummary() {
  // const [loading, setLoading] = useState(true)

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
      await fetchCart();
    }
    fetchCartData()
  }, [fetchCart])

  console.log('delivery fee ', deliveryFee)

  // if (loading) return <CheckoutSkeleton />
  const cartSummary = mapCartToOrderSummary(summary)

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

  const handlePayment = () => {
    onPaymentCompleted()

  }

  const {
    cartId,
    fetchCart,
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
        <Button variant="primary" onClick={handlePayment}>
          Place Order
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
