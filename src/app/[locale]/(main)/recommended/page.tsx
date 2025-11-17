import { ProductListingSkeleton } from "@/components/organisms/ProductListingSkeleton/ProductListingSkeleton"
import { Suspense } from "react"

import { Breadcrumbs } from "@/components/atoms"
import { AlgoliaProductsListing, ProductListing } from "@/components/sections"
import { getRegion } from "@/lib/data/regions"
import isBot from "@/lib/helpers/isBot"
import { headers } from "next/headers"
import type { Metadata } from "next"
import Script from "next/script"
import { listRegions } from "@/lib/data/regions"
import { listProducts } from "@/lib/data/products"
import { toHreflang } from "@/lib/helpers/hreflang"
import { ProductCard } from "@/components/molecules/ProductCard/ProductCard"

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
    try {
        const regions = await listRegions()
        const locales = Array.from(
            new Set(
                (regions || []).flatMap((r) => r.countries?.map((c) => c.iso_2) || [])
            )
        ) as string[]
        languages = locales.reduce<Record<string, string>>((acc, code) => {
            acc[toHreflang(code)] = `${baseUrl}/${code}/categories`
            return acc
        }, {})
    } catch {
        languages = { [toHreflang(locale)]: `${baseUrl}/${locale}/categories` }
    }

    const title = "All Products"
    const description = `Browse all products on ${process.env.NEXT_PUBLIC_SITE_NAME || "our store"
        }`
    const canonical = `${baseUrl}/${locale}/categories`

    return {
        title,
        description,
        alternates: {
            canonical,
            languages: { ...languages, "x-default": `${baseUrl}/categories` },
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

const ALGOLIA_ID = process.env.NEXT_PUBLIC_ALGOLIA_ID
const ALGOLIA_SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY

async function AllCategories({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params

    const ua = (await headers()).get("user-agent") || ""
    const bot = isBot(ua)

    const breadcrumbsItems = [
        {
            path: "/",
            label: "All Products",
        },
    ]

    const currency_code = (await getRegion(locale))?.currency_code || "usd"

    // Fetch a small cached list for ItemList JSON-LD
    const headersList = await headers()
    const host = headersList.get("host")
    const protocol = headersList.get("x-forwarded-proto") || "https"
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`
    const {
        response: { products: jsonLdProducts },
    } = await listProducts({
        countryCode: locale,
        queryParams: { limit: 8, order: "created_at", fields: "id,title,handle" },
    })

    const itemList = jsonLdProducts.slice(0, 8).map((p, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${baseUrl}/${locale}/products/${p.handle}`,
        name: p.title,
    }))

    return (
        <main className="container">
            {/* <div className="hidden md:block mb-2">
        <Breadcrumbs items={breadcrumbsItems} />
      </div> */}
            <Suspense fallback={<ProductListingSkeleton />}>
                <h2 className="text-[#32425A] font-semibold">Recommended For You</h2>
                <div className="mb-2"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                    {[1, 2, 3, 4, 5].map(i => (
                        <ProductCard key={i}/>
                    ))}
                </div>
            </Suspense>
        </main>
    )
}

export default AllCategories
