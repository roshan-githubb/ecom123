"use client"

import { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { HomeProductCard } from "./HomeProductCard"
import { SimpleRatingSummary } from "@/types/reviews"
import { getProductRatingSummaries } from "@/lib/helpers/rating-helpers"

interface HomeProductCardListProps {
  products: HttpTypes.StoreProduct[]
  className?: string
  hasOfferSticker?: boolean
}

export const HomeProductCardList = ({
  products,
  className,
  hasOfferSticker = false,
}: HomeProductCardListProps) => {
  const [ratingsMap, setRatingsMap] = useState<Record<string, SimpleRatingSummary>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchRatings = async () => {
      try {
        const productIds = products.map(p => p.id)
        const ratings = await getProductRatingSummaries(productIds)
        
        if (isMounted) {
          setRatingsMap(ratings)
        }
      } catch (error) {
        console.error('Failed to fetch ratings:', error)
        // Set empty ratings on error
        if (isMounted) {
          const emptyRatings: Record<string, SimpleRatingSummary> = {}
          products.forEach(p => {
            emptyRatings[p.id] = {
              average_rating: 0,
              total_reviews: 0,
              last_month_sales: 0,
            }
          })
          setRatingsMap(emptyRatings)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    if (products.length > 0) {
      fetchRatings()
    }

    return () => {
      isMounted = false
    }
  }, [products])

  return (
    <>
      {products.map((product, index) => (
        <HomeProductCard
          key={product.id}
          api_product={product}
          className={className}
          hasOfferSticker={hasOfferSticker}
          allProducts={products}
          productIndex={index}
          ratingSummary={ratingsMap[product.id]}
        />
      ))}
    </>
  )
}
