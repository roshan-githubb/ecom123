import { listProducts } from "@/lib/data/products"
import { getRegion } from "@/lib/data/regions"
import { ProductListing } from "@/components/sections"
import { Suspense } from "react"
import { ProductListingSkeleton } from "@/components/organisms/ProductListingSkeleton/ProductListingSkeleton"

import { HttpTypes } from "@medusajs/types"
import { SearchProductListing } from "@/components/sections/SearchProductListing/SearchProductListing"

type ProductsPageProps = {
  params: {
    locale: string
  }
  searchParams: Record<string, string | string[] | undefined>
}

export const revalidate = 0

export default async function ProductsPage({ searchParams, params }: ProductsPageProps) {
const { locale } = params
const query = searchParams?.query || ""
const order = searchParams?.order || "-created_at"   // default: newest first

const region = await getRegion(locale)

// If user typed something, search mode
const searchMode = query.length > 0

let response

if (searchMode) {
  response = await listProducts({
    queryParams: {
      q: query,
      limit: 50,
      order,        
    },
    
  })
} else {
  response = await listProducts({
    queryParams: {
      limit: 50,
      order,        
    },
    
  })
}


  return (
    <main className="container py-4">
      <h1 className="heading-md uppercase">
        {searchMode ? `Results for "${query}"` : "All Products"}
      </h1>

      <Suspense fallback={<ProductListingSkeleton />}>
        <SearchProductListing
          products={response.response.products}
          total={response.response.count}
          locale={locale}
          searchMode={searchMode}
        />
      </Suspense>
    </main>
  )
}
