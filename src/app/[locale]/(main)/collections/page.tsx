import { ItemCategoryCard } from "@/components/cells/CategoryCard/CategoryCard"
import { notFound } from "next/navigation"

export const revalidate = 3600

async function getAllCollections() {
  const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/collections?fields=*metadata`

  const headers = {
    "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
    "Content-Type": "application/json",
  }

  try {
    const res = await fetch(url, {
      method: "GET",
      next: { revalidate: 3600 },
      headers,
    })

    if (!res.ok) {
      return null
    }

    const data = await res.json()
    return data.collections || []
  } catch (error) {
    console.error("Error fetching collections:", error)
    return null
  }
}

export default async function CollectionsPage() {
  const collections = await getAllCollections()

  if (!collections || collections.length === 0) {
    return notFound()
  }

  return (
    <main className="container px-4 py-6">
      <h1 className="heading-md uppercase mb-6">All Collections</h1>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {collections.map((collection: any) => {
          const thumbnailUrl = 
            collection?.metadata?.thumbnail || 
            "/product-placeholder.png"

          return (
            <div key={collection.id}>
              <ItemCategoryCard
                imageUrl={thumbnailUrl}
                label={collection.title}
                shape="rounded"
                height={100}
                width={100}
                link={`/collections/${collection.handle}`}
              />
            </div>
          )
        })}
      </div>
    </main>
  )
}
