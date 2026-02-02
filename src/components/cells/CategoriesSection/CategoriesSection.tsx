'use client'
import { HttpTypes } from "@medusajs/types"
import { usePathname } from "next/navigation"
import { ItemCategoryCard } from "../CategoryCard/CategoryCard"
// import { CategoryItem } from "@/app/[locale]/(main)/page"

// type CategoryType = Omit<CategoryItem, "updated_at" | "id" | 'created_at' | "description"  >;

export const CategoriesSection = ({
  categories
}: {
  categories: HttpTypes.StoreProductCategory[]
}) => {
  const pathname = usePathname()
   console.log('categories section ', categories)

  return (
    <>
    <div className="grid grid-cols-4 gap-4">
          {categories?.map((c:any) => (
            <div key={c.id} className="flex-shrink-0">
              <ItemCategoryCard
                imageUrl={c?.metadata?.thumbnail_url || "/product-placeholder.png"}
                label={c.name}
                shape="circle"
                height={70}
                width={70}
                link={`/categories/${c?.handle}`}
              />
            </div>
          ))}
        </div>
      {/* {categories.slice(0, 8).map((category) => {
        const categoryHref = `/categories/${category?.handle}`

        return (
          <LocalizedClientLink
            key={category.handle}
            href={categoryHref}
            className={cn(
              "label-md min-w-[24px] capitalize",
              pathname === `/np${categoryHref}`
                ? "text-white  font-semibold"
                : "text-gray-300 hover:text-gray-300"
            )}
          >
            {category?.name}
          </LocalizedClientLink>
        )
      })} */}
    </>
  )
}
