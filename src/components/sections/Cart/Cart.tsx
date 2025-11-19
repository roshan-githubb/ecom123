"use client"

import { Button } from "@/components/atoms"
import { CartEmpty, CartItems, CartSummary } from "@/components/organisms"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { retrieveCart } from "@/lib/data/cart"
import CartPromotionCode from "../CartReview/CartPromotionCode"
import { EmptyCart } from "@/components/organisms/CartItems/EmptyCart"
import type { StoreCart, StoreCartPromotion, StorePromotion } from "@medusajs/types"

export const Cart = async () => {
  const cart = await retrieveCart()

  // Map StoreCartPromotion to StorePromotion for TypeScript
  const mappedCart: (StoreCart & { promotions?: StorePromotion[] }) | null = cart
    ? {
        ...cart,
        promotions: cart.promotions?.map((promo: StoreCartPromotion) => ({
          id: promo.id,
          code: promo.code,
          // Add dummy values for required StorePromotion fields
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          deleted_at: null,
        })),
      }
    : null

  if (!mappedCart || !mappedCart.items?.length) {
    return <CartEmpty />
  }

  return (
    <>
      <div className="col-span-12 lg:col-span-6">
        <CartItems cart={mappedCart} />
      </div>
      <div className="lg:col-span-2"></div>
      <div className="col-span-12 lg:col-span-4">
        <div className="w-full mb-6 border rounded-sm p-4">
          <CartPromotionCode cart={mappedCart} />
        </div>
        <div className="border rounded-sm p-4 h-fit">
          <CartSummary
            item_total={mappedCart.item_subtotal || 0}
            shipping_total={mappedCart.shipping_subtotal || 0}
            total={mappedCart.total || 0}
            currency_code={mappedCart.currency_code || ""}
            tax={mappedCart.tax_total || 0}
            discount_total={mappedCart.discount_total || 0}
          />
          <LocalizedClientLink href="/checkout?step=address">
            <Button className="w-full py-3 flex justify-center items-center">
              Go to checkout
            </Button>
          </LocalizedClientLink>
        </div>
      </div>
    </>
  )
}
