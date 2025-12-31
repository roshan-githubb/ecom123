import { ProductListingSkeleton } from "@/components/organisms/ProductListingSkeleton/ProductListingSkeleton"
import { Suspense } from "react"
import { headers } from "next/headers"
import type { Metadata } from "next"
import { listProducts } from "@/lib/data/products"
import { HomeProductCard } from "@/components/molecules/HomeProductCard/HomeProductCard"
import { ProductsList } from "@/components/organisms"
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

    let languages: Record<string, string> = {}


    const title = "Flash sales"
    const description = `Browse all products on Flash Sales`
    const canonical = `${baseUrl}/${locale}/flash-sale`

    return {
        title,
        description,
        alternates: {
            canonical,
            languages: { ...languages, "x-default": `${baseUrl}/flash-sale` },
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


async function FlashSales({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const {
        response: { products: jsonLdProducts },
    } = await listProducts({
        // countryCode: locale,
        queryParams: { limit: 8, order: "created_at" },
    })

    // const flashProducts = await getFlashSaleProducts({})

    const sortedProducts = sortProductsByInventory(jsonLdProducts)




    return (
        <main className="container">

            <h1 className="heading-md uppercase mb-4">Flash Sales</h1>

            <Suspense fallback={<ProductListingSkeleton />}>
                <ProductsList products={sortedProducts} locale={"np"} />

            </Suspense>
        </main>
    )
}

export default FlashSales
