import { ProductListingSkeleton } from "@/components/organisms/ProductListingSkeleton/ProductListingSkeleton"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import CollectionProductListing from "./CollectionProductListing"

export const revalidate = 60

async function getCollectionByHandle(handle: string) {
  const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/collections?handle[]=${handle}`

  const headers = {
    "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
    "Content-Type": "application/json",
  }

  try {
    const res = await fetch(url, {
      method: "GET",
      next: { revalidate: 300 },
      headers,
    })

    if (!res.ok) {
      return null
    }

    const data = await res.json()
    return data.collections?.[0] || null
  } catch (error) {
    console.error("Error fetching collection:", error)
    return null
  }
}

async function Collection({
  params,
  searchParams,
}: {
  params: Promise<{
    handle: string
    locale: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { handle, locale } = await params
  const resolvedSearchParams = await searchParams

  const collection = await getCollectionByHandle(handle)

  if (!collection) {
    return notFound()
  }

  return (
    <main className="container">
      <h1 className="heading-md uppercase mb-4">{collection.title}</h1>
      {collection.metadata?.description && (
        <p className="text-gray-600 mb-6">{collection.metadata.description}</p>
      )}

      <Suspense fallback={<ProductListingSkeleton />}>
        <CollectionProductListing 
          collection={collection}
          locale={locale}
          searchParams={resolvedSearchParams}
        />
      </Suspense>
    </main>
  )
}

export default Collection
