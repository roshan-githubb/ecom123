import { useEffect } from 'react'
import { useWishlistStore } from '@/store/useWishlistStore'

export const useWishlistInit = () => {
  const { loadWishlist } = useWishlistStore()

  useEffect(() => {
    loadWishlist()
  }, [loadWishlist])
}