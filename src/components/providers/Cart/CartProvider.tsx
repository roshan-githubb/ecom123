"use client"

import { PropsWithChildren, useEffect, useState } from "react"
import { CartContext } from "./context"
import { Cart, StoreCartLineItemOptimisticUpdate } from "@/types/cart"
import { retrieveCart } from "@/lib/data/cart"

interface CartProviderProps extends PropsWithChildren {
  cart: Cart | null
}

export function CartProvider({ cart: initialCart, children }: CartProviderProps) {
  const [cartState, setCartState] = useState<Cart | null>(initialCart)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch cart on client-side to avoid blocking server render
  useEffect(() => {
    async function fetchCart() {
      try {
        const cart = await retrieveCart()
        if (cart) {
          // Map cart to expected type
          const mappedCart = {
            ...cart,
            promotions: (cart.promotions ?? []).map((promo: any) => ({
              ...promo,
              created_at: promo.created_at || new Date().toISOString(),
              updated_at: promo.updated_at || new Date().toISOString(),
              deleted_at: promo.deleted_at ?? null,
            })),
          } as Cart
          setCartState(mappedCart)
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCart()
  }, [])

  function handleAddToCart(
    newItem: StoreCartLineItemOptimisticUpdate,
    currency_code: string
  ) {
    setCartState((prev) => {
      const currentItems = prev?.items || []
      const isNewItemInCart = currentItems.find(
        ({ variant_id }) => variant_id === newItem.variant_id
      )

      if (isNewItemInCart) {
        const updatedItems = currentItems.map((currentItem) => {
          if (currentItem.variant_id !== newItem.variant_id) {
            return currentItem
          }

          const newQuantity = currentItem.quantity + (newItem?.quantity || 0)
          return {
            ...newItem,
            quantity: newQuantity,
            subtotal: newQuantity * (newItem?.subtotal || 0),
            total: newQuantity * (newItem?.total || 0),
            tax_total: newQuantity * (newItem?.tax_total || 0),
          }
        }) as StoreCartLineItemOptimisticUpdate[]

        const { item_subtotal, total, tax_total } =
          getItemsSummaryValues(updatedItems)

        return {
          ...prev,
          items: updatedItems,
          item_subtotal,
          total,
          tax_total,
          currency_code,
        } as Cart
      }

      const updatedItems = [
        ...currentItems,
        newItem,
      ] as StoreCartLineItemOptimisticUpdate[]

      const { item_subtotal, total, tax_total } =
        getItemsSummaryValues(updatedItems)

      return {
        ...prev,
        items: updatedItems,
        item_subtotal,
        total,
        tax_total,
        currency_code,
      } as Cart
    })
  }

  function getItemsSummaryValues(items: StoreCartLineItemOptimisticUpdate[]) {
    return items.reduce(
      (acc, item) => ({
        item_subtotal: (acc.item_subtotal || 0) + (item.subtotal || 0),
        total: (acc.total || 0) + (item.total || 0),
        tax_total: (acc.tax_total || 0) + (item.tax_total || 0),
      }),
      { item_subtotal: 0, total: 0, tax_total: 0 }
    )
  }

  return (
    <CartContext.Provider
      value={{
        cart: cartState,
        onAddToCart: handleAddToCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
