import { ProductListingSkeleton } from "@/components/organisms/ProductListingSkeleton/ProductListingSkeleton"
import { Suspense } from "react"
import { headers } from "next/headers"
import type { Metadata } from "next"
import { ProductsList } from "@/components/organisms"
import { getTopProducts } from "@/lib/data/top-products"
import { sortProductsByInventory } from "@/lib/sortProducts/sortProducts"
import { getProductRatingSummaries } from "@/lib/helpers/rating-helpers"


export const revalidate = 60

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const headersList = await headers()
    const host = headersList.get("host")
    const protocol = headersList.get("x-forwarded-proto") || "https"
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`

    let languages: Record<string, string> = {}


    const title = "Top Products"
    const description = `Browse all products on Top Products`
    const canonical = `${baseUrl}/${locale}/top-products`

    return {
        title,
        description,
        alternates: {
            canonical,
            languages: { ...languages, "x-default": `${baseUrl}/top-products` },
        },
        robots: { index: true, follow: true },
        openGraph: {
            title: `${title} | ${process.env.NEXT_PUBLIC_SITE_NAME || "Storefront"}`,
            description,
            url: canonical,
            siteName: process.env.NEXT_PUBLIC_SITE_NAME || "Storefront",
            type: "website",
        },
    }
}


async function TopProducts({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const topProducts = await getTopProducts({ limit: 16 })
    const sortedProducts = sortProductsByInventory(topProducts?.products)
    
    const productIds = sortedProducts?.map((p: any) => p.id) || []
    const ratingsMap = await getProductRatingSummaries(productIds)

    return (
        <main className="container">

            <h1 className="heading-md uppercase mb-4">Top Products</h1>

            <Suspense fallback={<ProductListingSkeleton />}>
                <ProductsList products={sortedProducts} locale={"np"} ratingsMap={ratingsMap} />

            </Suspense>
        </main>
    )
}

export default TopProducts
