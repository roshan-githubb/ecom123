import { SectionHeader } from "@/components/atoms/SectionHeader/SectionHeader"
import { HomeProductCard } from "@/components/molecules/HomeProductCard/HomeProductCard"
import { listProducts } from "@/lib/data/products"
import { sortProductsByInventory } from "@/lib/sortProducts/sortProducts"
import { getProductRatingSummaries } from "@/lib/helpers/rating-helpers"
import { safeDataFetch } from "@/lib/utils/safe-data"
import React from "react"
import { getTopProducts } from "@/lib/data/top-products"

interface PopularItemsProps {
  locale?: string
  regionId?: string
}

export default async function PopularProductsRows({type, link, title}:{type?: string, link: string, title: string}) {
  const result = await safeDataFetch(
    async () => {
      const popularProducts  = await getTopProducts({
        limit: 8,
        type,
        from: "homepage"

      })

       console.log(
        "jsonld and sortedprod, ratingsMap ",
        popularProducts
        // sortedProducts,
        // ratingsMap
      )

      const sortedProducts = sortProductsByInventory(popularProducts?.products)

      if (!sortedProducts || sortedProducts.length === 0) {
        return { products: [], ratingsMap: {} }
      }

      const productIds = sortedProducts.map((p: any) => p.id).filter(Boolean)
      const ratingsMap = await getProductRatingSummaries(productIds)
    //   console.log(
    //     "jsonld and sortedprod, ratingsMap ",
    //     jsonLdProducts,
    //     sortedProducts,
    //     ratingsMap
    //   )

      return { products: sortedProducts, ratingsMap }
    },
    { products: [], ratingsMap: {} },
    "PopularItemsHome"
  )

  const { products: sortedProducts, ratingsMap: ratingSummaryMap } =
    result.data || { products: [], ratingsMap: {} }

  if (!sortedProducts || sortedProducts.length === 0) {
    console.warn("[PopularItems] No popular products available")
    return null
  }

  return (
    <div>
      <SectionHeader
        title={title}
        actionLabel="See All"
        link={link}
      />
      <div className="my-2"></div>
      <div className="overflow-x-scroll gap-x-2 flex no-scrollbar">
        {sortedProducts.map((r, index) => {
          try {
            return (
              <div key={r.id || index} className="w-[180px] flex-shrink-0">
                <HomeProductCard
                  api_product={r}
                //   hasOfferSticker={true}
                  allProducts={sortedProducts}
                  productIndex={index}
                  ratingSummary={ratingSummaryMap[r.id] || null}
                />
              </div>
            )
          } catch (error) {
            console.warn(
              `[PopularItems] Error rendering product ${r.id}:`,
              error
            )
            return null
          }
        })}
      </div>
    </div>
  )
}
