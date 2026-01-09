import { SectionHeader } from '@/components/atoms/SectionHeader/SectionHeader'
import { HomeProductCard } from '@/components/molecules/HomeProductCard/HomeProductCard'
import { getTopProducts } from '@/lib/data/top-products'
import { getProductRatingSummaries } from '@/lib/helpers/rating-helpers'
import { safeDataFetch } from '@/lib/utils/safe-data'
import React from 'react'

export default async function TopProducts() {
    // Safe data fetching with fallback
    const result = await safeDataFetch(
        () => getTopProducts({ limit: 20 }),
        { products: [] },
        'TopProducts'
    )

    const topProducts = result.data || { products: [] }
    
    // If no products, don't render anything
    if (!topProducts.products || topProducts.products.length === 0) {
        console.warn('[TopProducts] No products available, skipping render')
        return null
    }

    const productIds = topProducts.products.map((p: any) => p.id).filter(Boolean)
    
    // Safe ratings fetch
    const ratingsResult = await safeDataFetch(
        () => getProductRatingSummaries(productIds),
        {},
        'TopProducts-Ratings'
    )
    
    const ratingsMap = ratingsResult.data || {}

    // Sort products: in-stock first, out-of-stock last
    const sortedProducts = topProducts.products.sort((a: any, b: any) => {
        // Calculate inventory for product A
        const inventoryA = a?.variants?.reduce((sum: number, variant: any) => {
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

        // Calculate inventory for product B
        const inventoryB = b?.variants?.reduce((sum: number, variant: any) => {
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

        // Sort: in-stock (> 0) first, out-of-stock (0) last
        if (inventoryA > 0 && inventoryB <= 0) return -1
        if (inventoryA <= 0 && inventoryB > 0) return 1
        return 0 // Keep original order for products with same stock status
    })

    return (
        <div>
            <SectionHeader title="Top products" actionLabel="See All" link='/top-products' />
            <div className="my-2"></div>
            <div className="overflow-x-scroll gap-x-2 flex no-scrollbar">
                {sortedProducts.map((r: any, index: number) => {
                    try {
                        const currentPrice = r?.variants?.[0]?.calculated_price?.calculated_amount ?? 0
                        if (currentPrice === 0) return null
                        
                        return (
                            <div key={r.id || index} className="w-[180px] flex-shrink-0">
                                <HomeProductCard
                                    api_product={r}
                                    allProducts={topProducts.products || []}
                                    productIndex={index}
                                    ratingSummary={ratingsMap[r.id] || null}
                                />
                            </div>
                        )
                    } catch (error) {
                        console.warn(`[TopProducts] Error rendering product ${r.id}:`, error)
                        return null
                    }
                })}
            </div>
        </div>
    )
}
