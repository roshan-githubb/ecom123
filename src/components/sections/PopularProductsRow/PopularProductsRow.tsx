import { SectionHeader } from "@/components/atoms/SectionHeader/SectionHeader"
import { HomeProductCard } from "@/components/molecules/HomeProductCard/HomeProductCard"
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

      //  console.log(
      //   "jsonld and sortedprod, ratingsMap ",
      //   popularProducts
      //   // sortedProducts,
      //   // ratingsMap
      // )
                        // products={allProducts.length > 0 ? allProducts.filter((p) => p?.variants?.[0]?.calculated_price?.calculated_amount) : [api_product]}

      const sortedProducts = sortProductsByInventory(popularProducts?.products.filter((p:any) => p?.variants?.[0]?.calculated_price?.calculated_amount))

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
            const price = r?.variants?.[0]?.calculated_price?.calculated_amount ?? 0
            if(price == 0) return null;
            return (
              <div key={r.id || index} className="w-[140px] flex-shrink-0">
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
        {sortedProducts.length >= 8 && (
          <a
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
          </a>
        )}
      </div>
    </div>
  )
}
