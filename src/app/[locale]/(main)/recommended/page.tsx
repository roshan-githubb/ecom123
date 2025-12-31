import { ProductListingSkeleton } from "@/components/organisms/ProductListingSkeleton/ProductListingSkeleton"
import { Suspense } from "react"
import { ProductCard } from "@/components/molecules/ProductCard/ProductCard"
import { getRegion } from "@/lib/data/regions"
import { listProducts } from "@/lib/data/products"
import { headers } from "next/headers"
import isBot from "@/lib/helpers/isBot"
import type { Metadata } from "next"
import { HttpTypes } from "@medusajs/types"
import { fetchProductRatingSummary } from "@/lib/api/reviews"
import { RatingSummary } from "@/types/reviews"
import { sortProductsByInventory } from "@/lib/sortProducts/sortProducts"


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

    const title = "All Products"
    const description = `Browse all products on ${process.env.NEXT_PUBLIC_SITE_NAME || "our store"}`
    const canonical = `${baseUrl}/${locale}/categories`

    return {
        title,
        description,
        alternates: { canonical },
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

async function AllCategories({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const ua = (await headers()).get("user-agent") || ""
    const bot = isBot(ua)
    const currency_code = (await getRegion(locale))?.currency_code?.toUpperCase() || "USD"

    // Fetch top 8 recommended products
    const {
        response: { products: recommendedProducts },
    } = await listProducts({
        countryCode: locale,
        queryParams: { limit: 30, order: "created_at" },
    })

    const ratingsMap: Record<string, RatingSummary> = await Promise.all(
        recommendedProducts.map(async (product: any) => {
            const summary = await fetchProductRatingSummary(product.id)
            return [product.id, summary] as const
        })
    ).then(Object.fromEntries)
    const sortedProducts = sortProductsByInventory(recommendedProducts)

    return (
        <main className="container py-6">
            <h2 className="text-[#32425A] text-base font-semibold mb-4">Recommended For You</h2>

            <Suspense fallback={<ProductListingSkeleton />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sortedProducts.map((product: HttpTypes.StoreProduct, index: number) => (
                        <ProductCard
                            key={product.id}
                            api_product={product}
                            locale={locale}
                            ratingSummary={ratingsMap[product.id]}
                            allProducts={sortedProducts}
                            productIndex={index}
                        />
                    ))}
                </div>
            </Suspense>
        </main>
    )
}

export default AllCategories
