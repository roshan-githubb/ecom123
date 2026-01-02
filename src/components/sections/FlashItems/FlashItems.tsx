import { SectionHeader } from '@/components/atoms/SectionHeader/SectionHeader'
import { HomeProductCard } from '@/components/molecules/HomeProductCard/HomeProductCard'
// import { getFlashSaleProducts } from '@/lib/data/flash-products'
import { listProducts } from '@/lib/data/products'
import { sortProductsByInventory } from '@/lib/sortProducts/sortProducts'
import { getProductRatingSummaries } from '@/lib/helpers/rating-helpers'
import React from 'react'

export default async function FlashItems() {
    const {
        response: { products: jsonLdProducts },
    } = await listProducts({
        // countryCode: locale,
        queryParams: { limit: 8, order: "created_at" },

    })
    const sortedProducts = sortProductsByInventory(jsonLdProducts)

    const productIds = sortedProducts?.map((p: any) => p.id) || []
    const ratingSummaryMap = await getProductRatingSummaries(productIds)

    // const flashProducts = await getFlashSaleProducts({})
    // console.log("Flash sale products: ", flashProducts);

    return (
        <>
            <div>
                <SectionHeader title="Flash sale" actionLabel="See All" />
                <div className="my-2"></div>
                <div className="overflow-x-scroll gap-x-2 flex no-scrollbar">
                    {sortedProducts.map((r, index) => (
                        <div key={r.id} className="w-[180px] flex-shrink-0 ">
                            <HomeProductCard
                                api_product={r}
                                hasOfferSticker={true}
                                allProducts={sortedProducts}
                                productIndex={index}
                                ratingSummary={ratingSummaryMap[r.id]}
                            />
                        </div>
                    ))}
                </div>
            </div >
        </>
    )
}
