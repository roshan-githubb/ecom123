import { SectionHeader } from '@/components/atoms/SectionHeader/SectionHeader'
import { HomeProductCard } from '@/components/molecules/HomeProductCard/HomeProductCard'
import { listProducts } from '@/lib/data/products'
import { sortProductsByInventory } from '@/lib/sortProducts/sortProducts'
import { getProductRatingSummaries } from '@/lib/helpers/rating-helpers'
import { safeDataFetch } from '@/lib/utils/safe-data'
import React from 'react'

interface FlashItemsProps {
  locale?: string
}

export default async function FlashItems({ locale = 'np' }: FlashItemsProps) {
    
    const result = await safeDataFetch(
        async () => {
            const { response: { products: jsonLdProducts } } = await listProducts({
                countryCode: locale,
                queryParams: { limit: 8, order: "created_at" },
            })
            
            const sortedProducts = sortProductsByInventory(jsonLdProducts)
            
            if (!sortedProducts || sortedProducts.length === 0) {
                return { products: [], ratingsMap: {} }
            }

            const productIds = sortedProducts.map((p: any) => p.id).filter(Boolean)
            const ratingsMap = await getProductRatingSummaries(productIds)

            return { products: sortedProducts, ratingsMap }
        },
        { products: [], ratingsMap: {} },
        'FlashItems'
    )

    const { products: sortedProducts, ratingsMap: ratingSummaryMap } = result.data || { products: [], ratingsMap: {} }

    if (!sortedProducts || sortedProducts.length === 0) {
        console.warn('[FlashItems] No flash sale products available')
        return null
    }

    return (
        <div>
            <SectionHeader title="Flash sale" actionLabel="See All" />
            <div className="my-2"></div>
            <div className="overflow-x-scroll gap-x-2 flex no-scrollbar">
                {sortedProducts.map((r, index) => {
                    try {
                        return (
                            <div key={r.id || index} className="w-[180px] flex-shrink-0">
                                <HomeProductCard
                                    api_product={r}
                                    hasOfferSticker={true}
                                    allProducts={sortedProducts}
                                    productIndex={index}
                                    ratingSummary={ratingSummaryMap[r.id] || null}
                                />
                            </div>
                        )
                    } catch (error) {
                        console.warn(`[FlashItems] Error rendering product ${r.id}:`, error)
                        return null
                    }
                })}
            </div>
        </div>
    )
}
