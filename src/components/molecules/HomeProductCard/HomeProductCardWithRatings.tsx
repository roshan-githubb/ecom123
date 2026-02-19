"use client"

import { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { HomeProductCard } from "./HomeProductCard"
import { SimpleRatingSummary } from "@/types/reviews"
import { getProductRatingSummaryById } from "@/lib/helpers/rating-helpers"

interface HomeProductCardWithRatingsProps {
  api_product: HttpTypes.StoreProduct
  className?: string
  hasOfferSticker?: boolean
  allProducts?: HttpTypes.StoreProduct[]
  productIndex?: number
}

export const HomeProductCardWithRatings = ({
  api_product,
  className,
  hasOfferSticker = false,
  allProducts = [],
  productIndex = 0,
}: HomeProductCardWithRatingsProps) => {
  const [ratingSummary, setRatingSummary] = useState<SimpleRatingSummary | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchRating = async () => {
      try {
        const rating = await getProductRatingSummaryById(api_product.id)
        if (isMounted) {
          setRatingSummary(rating)
        }
      } catch (error) {
        console.error(`Failed to fetch rating for product ${api_product.id}:`, error)
        if (isMounted) {
          setRatingSummary({
            average_rating: 0,
            total_reviews: 0,
            last_month_sales: 0,
          })
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchRating()

    return () => {
      isMounted = false
    }
  }, [api_product.id])

  return (
    <HomeProductCard
      api_product={api_product}
      className={className}
      hasOfferSticker={hasOfferSticker}
      allProducts={allProducts}
      productIndex={productIndex}
      ratingSummary={ratingSummary}
    />
  )
}
