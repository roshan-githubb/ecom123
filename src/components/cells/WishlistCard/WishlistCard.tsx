"use client"

import { Button } from "@/components/atoms"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useWishlistStore } from "@/store/useWishlistStore"
import { useCartStore } from "@/store/useCartStore"
import { cartToast } from "@/lib/cart-toast"
import { useState } from "react"

interface WishlistCardProps {
  product: {
    id: string
    title: string
    thumbnail: string
    price: string
    rating: number
    reviews: number
    inStock: boolean
    description?: string
  }
}

export const WishlistCard = ({ product }: WishlistCardProps) => {
  const { removeFromWishlist } = useWishlistStore()
  const [isRemoving, setIsRemoving] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const handleRemoveFromWishlist = async () => {
    setIsRemoving(true)
    try {
      await removeFromWishlist(product.id)
      cartToast.showSuccessToast("Removed from wishlist")
      // Refresh the page to update the list
      window.location.reload()
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
      cartToast.showErrorToast("Failed to remove from wishlist")
    } finally {
      setIsRemoving(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product.inStock) return
    
    setIsAddingToCart(true)
    try {
      // For now, we'll assume the first variant. In a real app, you'd need to handle variant selection
      // This is a simplified implementation - you might need to fetch product details to get variant ID
      cartToast.showErrorToast("Please visit product page to add to cart")
    } catch (error) {
      console.error('Failed to add to cart:', error)
      cartToast.showErrorToast("Failed to add to cart")
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <div
      className={cn(
        "w-full bg-[#F7F7FF] rounded-lg overflow-hidden shadow-sm flex flex-col h-full"
      )}
    >
      <div className="w-full h-[200px] relative">
        <LocalizedClientLink href={`/products/${product.id}`}>
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="w-full h-full object-cover rounded-t-xl"
          />
        </LocalizedClientLink>
      </div>

      <div className="p-3 flex flex-col gap-1 flex-grow justify-between">

        <LocalizedClientLink href={`/products/${product.id}`} className="block hover:underline">
          <p
            className="text-[12px] font-medium min-h-[32px] line-clamp-2"
            style={{ color: "#32425A" }}
          >
            {product.title}
          </p>
        </LocalizedClientLink>

        <div className="flex items-center gap-x-2">
          <span className="text-[12px] font-semibold" style={{ color: "#2C49E0" }}>
            {product.price}
          </span>
        </div>

        <p
          className="text-[9px] max-h-[32px] leading-snug mt-1 line-clamp-2"
          style={{ color: "#768397" }}
        >
          {product.description || "No description available"}
        </p>

        <div className="mt-auto flex flex-col gap-2 pt-2">
          {product.inStock ? (
            <p className="text-[9px] text-green-600">In Stock</p>
          ) : (
            <p className="text-[9px] text-red-600">Out of Stock</p>
          )}
        </div>

        <div className="mt-auto pt-2 flex flex-col gap-2">
          <LocalizedClientLink href={`/products/${product.id}`}>
            <button 
              className={`flex items-center justify-center w-full text-[12px] text-white py-2 px-3 rounded-md font-medium transition-colors ${
                product.inStock 
                  ? 'bg-myBlue hover:bg-[#2e2e7a] active:bg-[#252566]' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={!product.inStock}
            >
              <Image src="/images/icons/cart.png" alt="Cart" className="w-4 h-4 mr-2" height={16} width={16} />
              {product.inStock ? 'View Product' : 'Out of Stock'}
            </button>
          </LocalizedClientLink>

          <Button
            variant="tonal"
            onClick={handleRemoveFromWishlist}
            disabled={isRemoving}
            className="text-[10px] h-7 px-1 bg-transparent border border-[#E5E7EB] rounded-md text-[#768397] hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
          >
            {isRemoving ? 'Removing...' : 'Remove'}
          </Button>
        </div>
      </div>
    </div>
  )
}
