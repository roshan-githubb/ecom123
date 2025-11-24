"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  title: string
  price: number
  image: string
  quantity?: number
  color?: string
  size?: string
  options?: Record<string, any>
}

interface CartState {
  items: CartItem[]
  addToCart: (item: CartItem, quantity?: number) => void
  increase: (id: string) => void
  decrease: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (item, quantity = 1) => {
        const existing = get().items.find((i) => i.id === item.id)

        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: (i.quantity ?? 0) + quantity } // <-- fix here
                : i
            ),
          })
        } else {
          set({ items: [...get().items, { ...item, quantity }] })
        }
      },

      increase: (id) =>
        set({
          items: get().items.map(
            (i) => (i.id === id ? { ...i, quantity: (i.quantity ?? 0) + 1 } : i) // <-- fix here
          ),
        }),

      decrease: (id) =>
        set({
          items: get()
            .items.map(
              (i) =>
                i.id === id ? { ...i, quantity: (i.quantity ?? 0) - 1 } : i // <-- fix here
            )
            .filter((i) => (i.quantity ?? 0) > 0),
        }),

      updateQuantity: (id, quantity) =>
        set({
          items: get()
            .items.map((i) => (i.id === id ? { ...i, quantity } : i))
            .filter((i) => i.quantity ?? 0 > 0),
        }),

      total: () =>
        get().items.reduce(
          (sum, item) => sum + item.price * (item.quantity ?? 0),
          0
        ),

      clearCart: () => set({ items: [] }),
    }),
    { name: "cart-store" }
  )
)
