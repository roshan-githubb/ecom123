import { ProductListingSkeleton } from "@/components/organisms/ProductListingSkeleton/ProductListingSkeleton"
import { Suspense } from "react"

import { AlgoliaProductsListing, ProductListing } from "@/components/sections"
import { getRegion } from "@/lib/data/regions"
import isBot from "@/lib/helpers/isBot"
import { headers } from "next/headers"
import type { Metadata } from "next"
import Script from "next/script"
import { listRegions } from "@/lib/data/regions"
import { listProducts } from "@/lib/data/products"
import { toHreflang } from "@/lib/helpers/hreflang"

export const revalidate = 60


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

  const itemList = jsonLdProducts.slice(0, 8).map((p : any, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    url: `${baseUrl}/${locale}/products/${p.handle}`,
    name: p.title,
  }))

  return (
    <main className="container">
      <Script
        id="ld-breadcrumbs-categories"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "All Products",
                item: `${baseUrl}/${locale}/categories`,
              },
            ],
          }),
        }}
      />
      <Script
        id="ld-itemlist-categories"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: itemList,
          }),
        }}
      />
      {/* <div className="hidden md:block mb-2">
        <Breadcrumbs items={breadcrumbsItems} />
      </div> */}

      <h1 className="heading-md uppercase">All Products</h1>

      <Suspense fallback={<ProductListingSkeleton />}>
        {bot || !ALGOLIA_ID || !ALGOLIA_SEARCH_KEY ? (
          <ProductListing  locale={locale} />
        ) : (
          <AlgoliaProductsListing
            locale={locale}
            currency_code={currency_code}
          />
        )}
      </Suspense>
    </main>
  )
}

export default AllCategories
