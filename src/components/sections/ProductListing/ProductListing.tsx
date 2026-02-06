import {
  ProductListingHeader,
  ProductsList,
  ProductsPagination,
} from "@/components/organisms"
import { PRODUCT_LIMIT } from "@/const"
import { listProducts } from "@/lib/data/products"
import { getRegion } from "@/lib/data/regions"
import { sortProductsByInventory } from "@/lib/sortProducts/sortProducts"
// import { usePagination } from "react-instantsearch"


export const ProductListing = async ({
  category_id,
  collection_id,
  seller_id,
  showSidebar = false,
  locale = process.env.NEXT_PUBLIC_DEFAULT_REGION || "np",
  searchParams,
}: {
  category_id?: string
  collection_id?: string
  seller_id?: string
  showSidebar?: boolean
  locale?: string
  searchParams?: { page?: string }
}) => {

  const region = await getRegion(locale)   // "pl", "np", "us", etc.
  const currentPage = parseInt(searchParams?.page || "1", 10)
  
  if (!region) throw new Error("Region not found")

    console.log('region ', region)

  const { response } = await listProducts({
    pageParam: currentPage || 1,
    queryParams: {
      q: '',
      limit: PRODUCT_LIMIT,
      category_id,
      collection_id,
      seller_id,
    },
    regionId: region.id,
  })
  // console.log('list products response ', response)

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