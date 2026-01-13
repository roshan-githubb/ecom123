import { create } from 'zustand'
import { addWishlistItem, removeWishlistItem, getUserWishlists } from '@/lib/data/wishlist'

interface WishlistState {
  wishlistItems: Set<string>
  isLoading: boolean
  loadWishlist: () => Promise<void>
  addToWishlist: (productId: string) => Promise<void>
  removeFromWishlist: (productId: string, wishlistId?: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
  toggleWishlist: (productId: string) => Promise<void>
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlistItems: new Set(),
  isLoading: false,

  loadWishlist: async () => {
    try {
      set({ isLoading: true })
      const response = await getUserWishlists()
      const productIds = new Set<string>()
      
      if (response?.wishlists) {
        response.wishlists.forEach(wishlist => {
          wishlist.products?.forEach(product => {
            productIds.add(product.id)
          })
        })
      }
      
      set({ wishlistItems: productIds })
    } catch (error) {
      console.error('Failed to load wishlist:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  addToWishlist: async (productId: string) => {
    try {
      await addWishlistItem({
        reference_id: productId,
        reference: 'product'
      })
      
      set(state => ({
        wishlistItems: new Set([...state.wishlistItems, productId])
      }))
    } catch (error) {
      console.error('Failed to add to wishlist:', error)
      throw error
    }
  },

  removeFromWishlist: async (productId: string, wishlistId?: string) => {
    try {
      if (!wishlistId) {
        const response = await getUserWishlists()
        const wishlist = response?.wishlists?.find(w => 
          w.products?.some(p => p.id === productId)
        )
        wishlistId = wishlist?.id
      }
      
      if (wishlistId) {
        await removeWishlistItem({
          wishlist_id: wishlistId,
          product_id: productId
        })
      }
      
      set(state => {
        const newItems = new Set(state.wishlistItems)
        newItems.delete(productId)
        return { wishlistItems: newItems }
      })
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
      throw error
    }
  },

  isInWishlist: (productId: string) => {
    return get().wishlistItems.has(productId)
  },

  toggleWishlist: async (productId: string) => {
    const { isInWishlist, addToWishlist, removeFromWishlist } = get()
    
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId)
    } else {
      await addToWishlist(productId)
    }
  }
}))