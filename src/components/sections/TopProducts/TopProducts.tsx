import { SectionHeader } from "@/components/atoms/SectionHeader/SectionHeader"
import { HomeProductCard } from "@/components/molecules/HomeProductCard/HomeProductCard"
import { getTopProducts } from "@/lib/data/top-products"
import { getProductRatingSummaries } from "@/lib/helpers/rating-helpers"
import { safeDataFetch } from "@/lib/utils/safe-data"
import React from "react"
import Link from "next/link"

export default async function TopProducts({
  regionId,
  link,
  title,
  type,
}: {
  regionId?: string
  link: string
  title: string
  type?: string
}) {
  const result = await safeDataFetch(
    async () => {

      const topProductsResult = await getTopProducts({
        limit: 20,
        region_id: regionId,
        type,
      })

      if (
        !topProductsResult.products ||
        topProductsResult.products.length === 0
      ) {
        return { products: [] }
      }

      return { products: topProductsResult.products }
    },
    { products: [] },
    "TopProducts"
  )

  const topProducts = result.data || { products: [] }

  if (!topProducts.products || topProducts.products.length === 0) {
    console.warn("${title} No products available, skipping render")
    return null
  }

  const productIds = topProducts.products.map((p: any) => p.id).filter(Boolean)

  // Safe ratings fetch
  const ratingsResult = await safeDataFetch(
    () => getProductRatingSummaries(productIds),
    {},
    "TopProducts-Ratings"
  )

  const ratingsMap = ratingsResult.data || {}

  // Sort products: in-stock first, out-of-stock last
  const sortedProducts = topProducts.products.sort((a: any, b: any) => {
    // Calculate inventory for product A
    const inventoryA =
      a?.variants?.reduce((sum: number, variant: any) => {
        if (variant.inventory_quantity !== undefined) {
          return sum + (variant.inventory_quantity || 0)
        }

        const inventoryItem = variant.inventory_items?.[0]
        if (inventoryItem?.inventory?.location_levels) {
          const totalFromLocations =
            inventoryItem.inventory.location_levels.reduce(
              (locationSum: number, locationLevel: any) => {
                return locationSum + (locationLevel.available_quantity || 0)
              },
              0
            )
          return sum + totalFromLocations
        }

        return sum
      }, 0) || 0

    // Calculate inventory for product B
    const inventoryB =
      b?.variants?.reduce((sum: number, variant: any) => {
        if (variant.inventory_quantity !== undefined) {
          return sum + (variant.inventory_quantity || 0)
        }

        const inventoryItem = variant.inventory_items?.[0]
        if (inventoryItem?.inventory?.location_levels) {
          const totalFromLocations =
            inventoryItem.inventory.location_levels.reduce(
              (locationSum: number, locationLevel: any) => {
                return locationSum + (locationLevel.available_quantity || 0)
              },
              0
            )
          return sum + totalFromLocations
        }

        return sum
      }, 0) || 0

    // Sort: in-stock (> 0) first, out-of-stock (0) last
    if (inventoryA > 0 && inventoryB <= 0) return -1
    if (inventoryA <= 0 && inventoryB > 0) return 1
    return 0 // Keep original order for products with same stock status
  })

  // Filter out products with price = 0 before rendering
  const validProducts = sortedProducts.filter((r: any) => {
    const currentPrice = r?.variants?.[0]?.calculated_price?.calculated_amount ?? 0
    return currentPrice > 0
  })

  return (
    <div>
      <SectionHeader title={title} actionLabel="See All" link={link} />
      <div className="my-2"></div>
      <div className="overflow-x-scroll gap-x-2 flex no-scrollbar">
        {validProducts.slice(0, 8).map((r: any, index: number) => {
          try {
            return (
              <div key={r.id || index} className="w-[140px] flex-shrink-0">
                <HomeProductCard
                  api_product={r}
                  allProducts={validProducts}
                  productIndex={index}
                  ratingSummary={ratingsMap[r.id] || null}
                />
              </div>
            )
          } catch (error) {
            console.warn(`${title} Error rendering product ${r.id}:`, error)
            return null
          }
        })}
        {validProducts.length > 8 && (
          <Link
            href={link}
            className="w-[140px] flex-shrink-0 bg-white rounded-lg border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-myBlue hover:shadow-md transition-all active:scale-95"
            style={{ aspectRatio: '1/1.3' }}
          >
            <svg
              className="w-12 h-12 text-myBlue mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <p className="text-sm font-semibold text-gray-700">See More</p>
          </Link>
        )}
      </div>
    </div>
  )
}
