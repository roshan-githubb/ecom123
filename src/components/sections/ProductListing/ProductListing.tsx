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

    console.log('region ', region)

  const { response } = await listProducts({
    pageParam: 1,
    queryParams: {
      q: '',
      limit: 2,
      category_id,
      collection_id,
      seller_id,
    },
    regionId: region.id,   // ← THIS IS THE ONLY CHANGE INSIDE listProducts call
  })
  console.log('list products response ', response)

  const sortedProducts = sortProductsByInventory(response?.products)


  const {  count } = response
  const pages = Math.ceil(count / PRODUCT_LIMIT) || 1

  return (
    <div className="py-4">
      <ProductListingHeader total={count} />
      <div className="mt-3"></div>
      < >
        {/* <section className={showSidebar ? "col-span-3" : "col-span-4"}> */}
          
            <ProductsList products={sortedProducts} locale={locale} />
          <ProductsPagination pages={pages} />
        {/* </section> */}
      </>
    </div>
  )
}