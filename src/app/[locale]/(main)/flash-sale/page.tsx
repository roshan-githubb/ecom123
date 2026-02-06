import { ProductListingSkeleton } from "@/components/organisms/ProductListingSkeleton/ProductListingSkeleton"
import { Suspense } from "react"
import { headers } from "next/headers"
import type { Metadata } from "next"
import { listProducts } from "@/lib/data/products"
import { ProductsList, ProductsPagination } from "@/components/organisms"
import { sortProductsByInventory } from "@/lib/sortProducts/sortProducts"
import { getFlashSaleProducts } from "@/lib/data/flash-products"
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
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams
  const currentPage = parseInt(
    (resolvedSearchParams?.page as string) || "1",
    10
  )
  const offset = (currentPage - 1) * PRODUCT_LIMIT

  const {
    response: { products: jsonLdProducts },
  } = await listProducts({
    // countryCode: locale,
    queryParams: { limit: PRODUCT_LIMIT, order: "created_at" },
  })

  const flashProducts = await getFlashSaleProducts({ offset, limit: PRODUCT_LIMIT })
    const pages = Math.ceil(flashProducts?.count / PRODUCT_LIMIT) || 1
  
  console.log("flash items ", flashProducts)

  const sortedProducts = sortProductsByInventory(jsonLdProducts)

  return (
    <main className="container">
      <h1 className="heading-md uppercase mb-4">Flash Sales</h1>

      <Suspense fallback={<ProductListingSkeleton />}>
        <ProductsList products={sortedProducts} locale={"np"} />
      </Suspense>
      <ProductsPagination pages={pages || 1} />
    </main>
  )
}

export default FlashSales
