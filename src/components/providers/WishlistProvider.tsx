"use client"

import { PropsWithChildren } from 'react'

export function WishlistProvider({ children }: PropsWithChildren) {
  // Disabled wishlist initialization since the backend APIs are not implemented
  // and this is integrated with Weetok Flutter app
  // useWishlistInit()
  return <>{children}</>
}