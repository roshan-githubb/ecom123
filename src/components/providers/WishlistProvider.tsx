"use client"

import { PropsWithChildren } from 'react'
import { useWishlistInit } from '@/hooks/useWishlistInit'

export function WishlistProvider({ children }: PropsWithChildren) {
  useWishlistInit()
  return <>{children}</>
}