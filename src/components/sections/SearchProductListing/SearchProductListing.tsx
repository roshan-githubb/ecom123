
import {  ProductListingHeader, ProductSidebar, ProductsList, ProductsPagination } from "@/components/organisms"
import { HttpTypes } from "@medusajs/types"

type ProductListingProps = {
  products: HttpTypes.StoreProduct[]       
  total: number                             
  searchMode?: boolean                      
  category_id?: string
  collection_id?: string
  seller_id?: string
  showSidebar?: boolean
  locale: string
}

export const SearchProductListing = ({
  products: incomingProducts,
  total,
  searchMode = false,
  category_id,
  collection_id,
  seller_id,
  showSidebar = false,
  locale,
}: ProductListingProps) => {
  let products = incomingProducts
  const count = total
  const pages = Math.ceil(count / 12)

  return (
    <div className="py-4">
      <ProductListingHeader total={count} />
      {/* <div className="hidden md:block">
        <ProductListingActiveFilters />
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-4 mt-6 gap-4">
        {showSidebar && <ProductSidebar />}
        <section className={showSidebar ? "col-span-3" : "col-span-4"}>
          <div className="flex flex-wrap gap-4">
            <ProductsList products={products} locale={locale} />
          </div>
          {!searchMode && <ProductsPagination pages={pages} />}
        </section>
      </div>
    </div>
  )
}
