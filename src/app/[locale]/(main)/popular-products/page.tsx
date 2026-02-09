import { ProductListingSkeleton } from "@/components/organisms/ProductListingSkeleton/ProductListingSkeleton"
import { Suspense } from "react"
import { headers } from "next/headers"
import type { Metadata } from "next"
import { ProductsList, ProductsPagination } from "@/components/organisms"
import { getTopProducts } from "@/lib/data/top-products"
import { sortProductsByInventory } from "@/lib/sortProducts/sortProducts"
import { getProductRatingSummaries } from "@/lib/helpers/rating-helpers"
import { PRODUCT_LIMIT } from "@/const"

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

  const title = "Popular Products"
  const description = `Browse all products on Popular Products`
  const canonical = `${baseUrl}/${locale}/popular-products`

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { ...languages, "x-default": `${baseUrl}/popular-products` },
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

async function PopularProducts({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams
  const currentPage = parseInt(
    (resolvedSearchParams?.page as string) || "1",
    10
  )
  const offset = (currentPage - 1) * PRODUCT_LIMIT
  const topProducts = await getTopProducts({
    limit: PRODUCT_LIMIT,
    type: "new-popular",
    offset,
  })
  const pages = Math.ceil(topProducts?.count / PRODUCT_LIMIT) || 1
  // const popularProducts = await getTopProducts({ limit: 16, type: 'new-popular' })
  const sortedProducts = sortProductsByInventory(topProducts?.products)

  const productIds = sortedProducts?.map((p: any) => p.id) || []
  const ratingsMap = await getProductRatingSummaries(productIds)

  return (
    <main className="container">
      <h1 className="heading-md uppercase mb-4">Popular Products</h1>

      <Suspense fallback={<ProductListingSkeleton />}>
        <ProductsList
          products={sortedProducts}
          locale={"np"}
          ratingsMap={ratingsMap}
        />
      </Suspense>
      <ProductsPagination pages={pages || 1} />
    </main>
  )
}

export default PopularProducts
