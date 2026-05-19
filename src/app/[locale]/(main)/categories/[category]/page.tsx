import { ProductListingSkeleton } from "@/components/organisms/ProductListingSkeleton/ProductListingSkeleton"
import { getCategoryByHandle } from "@/lib/data/categories"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import CategoryProductListing from "./CategoryProductListing"

export const revalidate = 60

async function Category({
  params,
  searchParams,
}: {
  params: Promise<{
    category: string
    locale: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { category: handle, locale } = await params
  const resolvedSearchParams = await searchParams

  const category = await getCategoryByHandle([handle])

  if (!category) {
    return notFound()
  }

  return (
    <main className="container">
      <h1 className="heading-md uppercase mb-4">{category.name}</h1>

      <Suspense fallback={<ProductListingSkeleton />}>
        <CategoryProductListing 
          category={category}
          locale={locale}
          searchParams={resolvedSearchParams}
        />
      </Suspense>
    </main>
  )
}

export default Category
