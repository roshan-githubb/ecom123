import {
  ProductListingHeader,
  ProductsList,
  ProductsPagination,
} from "@/components/organisms"
import { PRODUCT_LIMIT } from "@/const"
import { listProducts } from "@/lib/data/products"
import { getRegion } from "@/lib/data/regions"
import { sortProductsByInventory } from "@/lib/sortProducts/sortProducts"


export const ProductListing = async ({
  category_id,
  collection_id,
  seller_id,
  showSidebar = false,
  locale = process.env.NEXT_PUBLIC_DEFAULT_REGION || "np",
}: {
  category_id?: string
  collection_id?: string
  seller_id?: string
  showSidebar?: boolean
  locale?: string
}) => {

  const region = await getRegion(locale)   // "pl", "np", "us", etc.
  if (!region) throw new Error("Region not found")

  const { response } = await listProducts({
    pageParam: 1,
    queryParams: {
      q: '',
      limit: PRODUCT_LIMIT,
      category_id,
      collection_id,
      seller_id,
    },
    regionId: region.id,   // ← THIS IS THE ONLY CHANGE INSIDE listProducts call
  })

  const sortedProducts = sortProductsByInventory(response?.products)


  const {  count } = response
  const pages = Math.ceil(count / PRODUCT_LIMIT) || 1

  return (
    <div className="py-4">
      <ProductListingHeader total={count} />
      <div className="grid grid-cols-1 md:grid-cols-4 mt-6 gap-4">
        <section className={showSidebar ? "col-span-3" : "col-span-4"}>
          <div className="flex flex-wrap gap-4">
            <ProductsList products={sortedProducts} locale={locale} />
          </div>
          <ProductsPagination pages={pages} />
        </section>
      </div>
    </div>
  )
}