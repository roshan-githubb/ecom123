import { SectionHeader } from '@/components/atoms/SectionHeader/SectionHeader'
import { HomeProductCard } from '@/components/molecules/HomeProductCard/HomeProductCard'
import { getFlashSaleProducts } from '@/lib/data/flash-products'
import { listProducts } from '@/lib/data/products'
import React from 'react'

export default async function FlashItems() {
    const {
        response: { products: jsonLdProducts },
    } = await listProducts({
        // countryCode: locale,
        queryParams: { limit: 8, order: "created_at" },
    })

    const flashProducts = await getFlashSaleProducts({})
    console.log("Flash sale products: ", flashProducts);

    return (
        <>
            <div>
                <SectionHeader title="Flash sale" actionLabel="See All" />
                <div className="my-2"></div>
                <div className="overflow-x-scroll gap-x-2 flex no-scrollbar">
                    {jsonLdProducts.map((r, index) => (
                        <div key={r.id} className="w-[180px] flex-shrink-0 ">
                            <HomeProductCard
                                api_product={r}
                                hasOfferSticker={true}
                                allProducts={jsonLdProducts}
                                productIndex={index}
                            />

                            {/* <HomeProductCard id={r?.id} imageUrl={r?.thumbnail ?? "/images/product-placeholder.png"} title={r?.title ?? ""} currentPrice={r?.variants?.[0]?.calculated_price?.calculated_amount ?? 0} description={r?.description ?? ""} /> */}
                        </div>
                    ))}
                </div>
            </div >
        </>
    )
}
