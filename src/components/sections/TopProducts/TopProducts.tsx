import { SectionHeader } from '@/components/atoms/SectionHeader/SectionHeader'
import { HomeProductCard } from '@/components/molecules/HomeProductCard/HomeProductCard'
import { getTopProducts } from '@/lib/data/top-products'
import React from 'react'

export default async function TopProducts() {

    const flashProducts = await getTopProducts({})
    console.log("top sale products: ", flashProducts);

    return (
        <>
            <div>
                <SectionHeader title="Top products" actionLabel="See All" />
                <div className="my-2"></div>
                <div className="overflow-x-scroll gap-x-2 flex no-scrollbar">
                    {flashProducts?.products?.map((r: any) => (
                        <div key={r.id} className="w-[180px] flex-shrink-0 ">
                            <HomeProductCard
                                api_product={r}
                                hasOfferSticker={true}
                            />

                        </div>
                    ))}
                </div>
            </div >
        </>
    )
}
