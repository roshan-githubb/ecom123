import { ItemCategoryCard } from "@/components/cells/CategoryCard/CategoryCard"
import { listHierarchicalCategories } from "@/lib/data/categories"
import { notFound } from "next/navigation"

export const revalidate = 3600

export default async function CategoriesPage() {
  const categories = await listHierarchicalCategories()

  if (!categories || categories.length === 0) {
    return notFound()
  }

  return (
    <main className="container px-4 py-6">
      <h1 className="heading-md uppercase mb-6">All Categories</h1>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {categories.map((category) => {
          const thumbnailUrl = typeof category?.metadata?.thumbnail_url === 'string'
            ? category.metadata.thumbnail_url
            : "/product-placeholder.png"

          return (
            <div key={category.id}>
              <ItemCategoryCard
                imageUrl={thumbnailUrl}
                label={category.name}
                shape="circle"
                height={80}
                width={80}
                link={`/categories/${category.handle}`}
              />
            </div>
          )
        })}
      </div>
    </main>
  )
}
