"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { StarRating } from "@/components/atoms/StarRating/StarRating"
import { useCartStore } from "@/store/useCartStore"
import { cartToast } from "@/lib/cart-toast"
import { CartIcon } from "@/icons"

interface AlgoliaProductHit {
  id: string
  title: string
  subtitle?: string
  description?: string
  in_stock: boolean
  handle: string
  thumbnail?: string | null
  images?: { url: string }[]
  variants?: Variant[]
  average_rating?: number | null
}
interface Variant {
  id: string
  stocked_quantity?: number
}

interface SearchResultProductCardProps {
  product: AlgoliaProductHit
  className?: string
  //   ratingSummary?: {
  //     average_rating: number
  //     // total_reviews: number
  //   }
}

export const SearchResultProductCard = ({
  product,
  className,
  //   ratingSummary,
}: SearchResultProductCardProps) => {
  const [isHydrated, setIsHydrated] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const addToCart = useCartStore((state) => state.add)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const title = product.title
  const description = product.description

  const imageUrl =
    product.images?.[0]?.url ||
    product.thumbnail ||
    "/images/not-available/not-available.png"

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isAddingToCart) return

    setIsAddingToCart(true)
    try {
      if (!product.variants || product.variants.length === 0) {
        cartToast.showErrorToast()
        return
      }
      await addToCart(product.variants[0].id, 1)

      cartToast.showCartToast()
    } catch (error) {
      cartToast.showErrorToast()
      console.error("Add to cart error:", error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  // const currentPrice =
  //   product.variants?.[0]?.prices[0]?.amount ?? 0
  const currentPrice = getLowestAlgoliaVariantPrice(product.variants)

  // Algolia DOES NOT provide inventory data
  // const totalInventory = 0
  // const stockInfo = getStockDisplayInfo(totalInventory)

  const handleOpenProduct = () => {
    if (!product.handle) return
    window.location.href = `/products/${product.id}`
  }

  return (
    <div
      className={cn(
        "bg-[#F7F7FF] rounded-lg h-[100%] max-h-[400px] overflow-hidden shadow-sm",
        className
      )}
    >
      <div
        onClick={handleOpenProduct}
        className="w-full aspect-square  flex flex-col relative cursor-pointer"
      >
        <Image
          src={imageUrl}
          alt={title}
          width={300}
          height={300}
          className="w-full h-full object-cover rounded-t-xl"
        />
      </div>

      <div className="p-3 flex flex-col justify-between h-[55%]">
        <div className="flex flex-col">
          <p
            onClick={handleOpenProduct}
            className="text-[12px] font-medium min-h-[22px] line-clamp-2 cursor-pointer hover:underline"
            style={{ color: "#32425A" }}
          >
            {title}
          </p>
          <div className="flex items-center gap-x-2 mt-1">
            <span
              className="text-[12px] font-semibold"
              style={{ color: "#2C49E0" }}
            >
              Rs. {currentPrice}
            </span>
          </div>

          {/* {ratingSummary && ratingSummary.total_reviews > 0 && ( */}
          <div className="flex items-center gap-1 mt-2">
            {product?.average_rating && (
              <>
                <StarRating rate={product.average_rating} starSize={12} />
                <span className="text-[9px] text-gray-500">
                  ({product.average_rating.toFixed(1)})
                </span>
              </>
            )}

            {/* <span className="text-[9px] text-gray-500">
                ({ratingSummary.total_reviews})
              </span> */}
          </div>
          {/* )} */}
          <p
            className="text-[9px] max-h-[32px] leading-snug mt-2 line-clamp-2"
            style={{ color: "#768397" }}
          >
            {description}
          </p>

          {/* Inventory intentionally disabled for Algolia results */}
          {/*
        {stockInfo.showWarning && (
          <p className="text-[9px] font-medium mt-1" style={{ color: stockInfo.textColor }}>
            {stockInfo.message}
          </p>
        )}
        */}
        <div className="mt-3"></div>
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className={`flex items-center justify-center text-[12px] text-white py-2 px-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed
                            ${
                              isAddingToCart || !product?.in_stock
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-myBlue hover:bg-[#2e2e7a] active:bg-[#252566]"
                            } text-[#FFFFFF]`}
          >
                      <CartIcon size={16} color="white"/>
            
            {isAddingToCart
              ? "Adding..."
              : !product?.in_stock
                ? "Out of Stock"
                : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  )
}

function getLowestAlgoliaVariantPrice(variants?: any[]): number {
  if (!variants?.length) return 0

  let lowest = Infinity

  for (const variant of variants) {
    const prices = variant?.prices
    if (!Array.isArray(prices)) continue

    for (const price of prices) {
      const amount = price?.amount
      if (typeof amount === "number" && amount >= 0) {
        lowest = Math.min(lowest, amount)
      }
    }
  }

  return lowest === Infinity ? 0 : lowest
}

function getLowestAlgoliaVariantPriceWithCurrency(
  variants?: any[],
  currencyCode = "usd"
): number {
  if (!variants?.length) return 0

  let lowest = Infinity

  for (const variant of variants) {
    for (const price of variant?.prices ?? []) {
      if (price?.currency_code !== currencyCode) continue
      if (typeof price.amount === "number") {
        lowest = Math.min(lowest, price.amount)
      }
    }
  }

  return lowest === Infinity ? 0 : lowest
}
