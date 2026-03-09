"use client"

import { useState, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import { Heart, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useWishlistStore } from "@/store/useWishlistStore"
import { cartToast } from "@/lib/cart-toast"
import { AddVariantSheet } from "@/components/molecules/AddVariantModal/AddVariantModal"
import { useCartStore } from "@/store/useCartStore"
import { useInventoryStore } from "@/store/useInventoryStore"
import { useInventorySync } from "@/hooks/useInventorySync"
import { getStockDisplayInfo } from "@/lib/helpers/stock-display"
import { StarRating } from "@/components/atoms/StarRating/StarRating"
import { CartIcon } from "@/icons"
import { SelectVariantModal } from "@/components/molecules/SelectVariantModal/SelectVariantModal"

interface WishlistPageClientProps {
  initialProducts: any[]
  wishlistId: string
}

export default function WishlistPageClient({
  initialProducts,
  wishlistId,
}: WishlistPageClientProps) {
  const [products, setProducts] = useState(initialProducts)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const { removeFromWishlist } = useWishlistStore()

  const handleRemoveFromWishlist = async (productId: string) => {
    setRemovingId(productId)
    try {
      await removeFromWishlist(productId, wishlistId)
      setProducts((prev) => prev.filter((p) => p.id !== productId))
      cartToast.showSuccessToast("Removed from wishlist")
    } catch (error) {
      console.error("Failed to remove from wishlist:", error)
      cartToast.showErrorToast("Failed to remove from wishlist")
    } finally {
      setRemovingId(null)
    }
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center min-h-[60vh]">
        <Heart className="h-20 w-20 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Your wishlist is empty
        </h2>
        <p className="text-gray-500 mb-6">
          Start adding products you love to your wishlist
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-myBlue text-white rounded-lg hover:bg-[#2e2e7a] transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="pb-6">
      <p className="text-gray-600 mb-4 text-sm">
        {products.length} {products.length === 1 ? "item" : "items"}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        <AnimatePresence mode="popLayout">
          {products.map((product, index) => (
            <WishlistProductCard
              key={product.id}
              product={product}
              onRemove={handleRemoveFromWishlist}
              isRemoving={removingId === product.id}
              allProducts={products}
              productIndex={index}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

interface WishlistProductCardProps {
  product: any
  onRemove: (productId: string) => void
  isRemoving: boolean
  allProducts: any[]
  productIndex: number
}

function WishlistProductCard({
  product,
  onRemove,
  isRemoving,
  allProducts,
  productIndex,
}: WishlistProductCardProps) {
  const [showModal, setShowModal] = useState(false)
  const [showSelectVariantModal, setShowSelectVariantModal] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [cardPos, setCardPos] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  })

  const addToCart = useCartStore((state) => state.add)
  const { getAdjustedInventory } = useInventoryStore()

  useInventorySync()

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const imageUrl = product.thumbnail || product.images?.[0]?.url || "/images/not-available/not-available.png"
  const hasMultipleVariants = (product.variants?.length || 0) > 1
  const currentPrice = product?.variants?.[0]?.calculated_price?.calculated_amount ?? 0

  // Calculate inventory
  const originalTotalInventory =
    product?.variants?.reduce((sum: number, variant: any) => {
      if (variant.inventory_quantity !== undefined) {
        return sum + (variant.inventory_quantity || 0)
      }
      const inventoryItem = variant.inventory_items?.[0]
      if (inventoryItem?.inventory?.location_levels) {
        const totalFromLocations = inventoryItem.inventory.location_levels.reduce(
          (locationSum: number, locationLevel: any) => {
            return locationSum + (locationLevel.available_quantity || 0)
          },
          0
        )
        return sum + totalFromLocations
      }
      return sum
    }, 0) || 0

  const totalInventory = isHydrated
    ? product?.variants?.reduce((sum: number, variant: any) => {
        let originalInventory = 0
        if (variant.inventory_quantity !== undefined) {
          originalInventory = variant.inventory_quantity || 0
        } else {
          const inventoryItem = variant.inventory_items?.[0]
          if (inventoryItem?.inventory?.location_levels) {
            originalInventory = inventoryItem.inventory.location_levels.reduce(
              (locationSum: number, locationLevel: any) => {
                return locationSum + (locationLevel.available_quantity || 0)
              },
              0
            )
          }
        }
        const adjustedInventory = getAdjustedInventory(variant.id, originalInventory)
        return sum + adjustedInventory
      }, 0) || 0
    : originalTotalInventory

  const stockInfo = getStockDisplayInfo(totalInventory)

  const handleOpenModal = (e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    setCardPos({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    })
    setShowModal(true)
  }

  const handleRemoveFromModal = async (productId: string) => {
    // Close modal first
    setShowModal(false)
    // Then remove from wishlist
    await onRemove(productId)
  }

  // Ensure product has images array for AddVariantSheet
  const productWithImages = {
    ...product,
    images: product.images || (product.thumbnail ? [{ url: product.thumbnail }] : []),
    options: product.options || [],
    variants: product.variants || [],
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isAddingToCart || !product.variants?.[0]?.id || totalInventory <= 0) return

    if (hasMultipleVariants) {
      setShowSelectVariantModal(true)
      return
    }

    setIsAddingToCart(true)
    try {
      await addToCart(product.variants[0].id, 1)
      cartToast.showCartToast()
    } catch (error) {
      cartToast.showErrorToast()
      console.error("Add to cart error:", error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
        className="w-full bg-[#F7F7FF] rounded-lg overflow-hidden shadow-sm flex flex-col relative"
      >
        {/* Remove button */}
        <button
          onClick={() => onRemove(product.id)}
          disabled={isRemoving}
          className="absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          {isRemoving ? (
            <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
          )}
        </button>

        {/* Product Image */}
        <motion.div
          onClick={handleOpenModal}
          whileTap={{ scale: 0.95 }}
          className="w-full aspect-square relative cursor-pointer"
        >
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
        </motion.div>

        {/* Product Info */}
        <div className="p-2 sm:p-3 flex flex-col gap-1 flex-1">
          <p
            onClick={handleOpenModal}
            className="text-[11px] sm:text-[12px] font-medium line-clamp-2 cursor-pointer hover:underline min-h-[32px]"
            style={{ color: "#32425A" }}
          >
            {product.title}
          </p>

          <div className="flex items-center gap-x-2">
            <span className="text-[11px] sm:text-[12px] font-semibold text-myBlue">
              Rs. {currentPrice}
            </span>
          </div>

          {stockInfo.showWarning && (
            <p
              className="text-[8px] sm:text-[9px] font-medium"
              style={{ color: stockInfo.textColor }}
            >
              {stockInfo.message}
            </p>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || totalInventory <= 0}
            className={`flex items-center justify-center text-[10px] sm:text-[12px] text-white py-1.5 sm:py-2 px-2 sm:px-3 rounded-md font-medium mt-auto disabled:opacity-50 disabled:cursor-not-allowed
              ${
                isAddingToCart || totalInventory <= 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-myBlue hover:bg-[#2e2e7a] active:bg-[#252566]"
              }`}
          >
            <CartIcon size={14} color="white" className="mr-1 sm:mr-2" />
            {isAddingToCart
              ? "Adding..."
              : totalInventory <= 0
                ? "Out of Stock"
                : "Add to Cart"}
          </button>
        </div>
      </motion.div>

      {showModal && (
        <AddVariantSheet
          product={productWithImages}
          cardPos={cardPos}
          onClose={() => setShowModal(false)}
          products={allProducts.map(p => ({
            ...p,
            images: p.images || (p.thumbnail ? [{ url: p.thumbnail }] : []),
            options: p.options || [],
            variants: p.variants || [],
          }))}
          currentProductIndex={productIndex}
          onProductChange={() => {}}
          onWishlistRemove={handleRemoveFromModal}
        />
      )}

      {showSelectVariantModal && (
        <SelectVariantModal
          product={productWithImages}
          onClose={() => setShowSelectVariantModal(false)}
        />
      )}
    </>
  )
}
