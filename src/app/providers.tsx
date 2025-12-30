"use client"

import { CartProvider } from "@/components/providers"
import { InventorySyncProvider } from "@/components/providers/InventorySyncProvider"
import { Cart } from "@/types/cart"
import type React from "react"

import { PropsWithChildren } from "react"

interface ProvidersProps extends PropsWithChildren {
  cart: Cart | null
}

export function Providers({ children, cart }: ProvidersProps) {
  return (
    <CartProvider cart={cart}>
      <InventorySyncProvider>
        {children}
      </InventorySyncProvider>
    </CartProvider>
  )
}
