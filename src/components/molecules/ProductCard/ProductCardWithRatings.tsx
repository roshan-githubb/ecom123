"use client"

import { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { ProductCard } from "./ProductCard"
import { SimpleRatingSummary } from "@/types/reviews"
import { getProductRatingSummaryById } from "@/lib/helpers/rating-helpers"

interface ProductCardWithRatingsProps {
  api_product: HttpTypes.StoreProduct | null
  locale: string
  allProducts?: HttpTypes.StoreProduct[]
  productIndex?: number
}

export const ProductCardWithRatings = ({
  api_product,
  locale,
  allProducts = [],
  productIndex = 0,
}: ProductCardWithRatingsProps) => {
  const [ratingSummary, setRatingSummary] = useState<SimpleRatingSummary>({
    average_rating: 0,
    total_reviews: 0,
    last_month_sales: 0,
  })

  useEffect(() => {
    if (!api_product?.id) return

    let isMounted = true

    const fetchRating = async () => {
      try {
        const rating = await getProductRatingSummaryById(api_product.id)
        if (isMounted) {
          setRatingSummary(rating)
        }
      } catch (error) {
        console.error(`Failed to fetch rating for product ${api_product.id}:`, error)
      }
    }

    fetchRating()

    return () => {
      isMounted = false
    }
  }, [api_product?.id])

  return (
    <ProductCard
      api_product={api_product}
      locale={locale}
      ratingSummary={ratingSummary}
      allProducts={allProducts}
      productIndex={productIndex}
    />
  )
}
