import { listProducts } from "@/lib/data/products"
import { getRegion } from "@/lib/data/regions"
import { Suspense } from "react"
import { ProductListingSkeleton } from "@/components/organisms/ProductListingSkeleton/ProductListingSkeleton"

import { HttpTypes } from "@medusajs/types"
import { ProductCard } from "@/components/molecules/ProductCard/ProductCard"
import { RatingSummary } from "@/types/reviews"
import { fetchProductRatingSummary } from "@/lib/api/reviews"

type ProductsPageProps = {
  params: {
    locale: string
  } | Promise<{ locale: string }>
  searchParams: Record<string, string | string[] | undefined>
  | Promise<Record<string, string | string[] | undefined>>
}

export const revalidate = 0

export default async function ProductsPage(props: ProductsPageProps) {

  const params = await props.params
  const searchParams = await props.searchParams

  const { locale } = params


  const query = searchParams?.query || ""
  const order = searchParams?.order || "-created_at"

  const min_price = searchParams?.min_price || undefined
  const max_price = searchParams?.max_price || undefined
  const color = searchParams?.color || undefined

  const region = await getRegion(locale)

  const searchMode = !!(
    query &&
    ((typeof query === "string" && query.length > 0) ||
      (Array.isArray(query) && query.length > 0))
  )

  const queryParams: any = {
    limit: 50,
    order,
  }

  if (searchMode) queryParams.q = query
  if (min_price) queryParams.min_price = min_price
  if (max_price) queryParams.max_price = max_price
  if (color) queryParams.color = color

  const response = await listProducts({ queryParams })
  console.log('product response ', response)

  const ratingsMap: Record<string, RatingSummary> = await Promise.all(
    response.response.products.map(async (product: any) => {
      const summary = await fetchProductRatingSummary(product.id)
      return [product.id, summary] as const
    })
  ).then(Object.fromEntries)


  return (
    <main className="container pb-4 ">
      <h1 className="heading-md uppercase">
        {searchMode ? `Results for "${query}"` : "All Products"}
      </h1>

      <Suspense fallback={<ProductListingSkeleton />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {response.response.products.map((product: HttpTypes.StoreProduct) => (
            <ProductCard
              key={product.id}
              api_product={product}
              locale={locale}
              ratingSummary={ratingsMap[product.id]}
            />
          ))}
        </div>
      </Suspense>

      {/* <Suspense fallback={<ProductListingSkeleton />}>
        <SearchProductListing
          products={response.response.products}
          total={response.response.count}
          locale={locale}
          searchMode={searchMode}
        />
      </Suspense> */}
    </main>
  )
}
