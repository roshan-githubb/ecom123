import { ProductCard } from "@/components/molecules/ProductCard/ProductCard"
import { HttpTypes } from "@medusajs/types"
import { SkeletonProductCard } from "../ProductCard/SkeletonProductCard"

export const ProductsList = ({
  products,
  locale,
}: {
  products: HttpTypes.StoreProduct[]
  locale: string
}) => {
  return (
    <>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
      >
        {products.map((product, index) => (
          // <SkeletonProductCard key={product.id} />
          <ProductCard 
            key={product.id} 
            api_product={product} 
            locale={locale}
            allProducts={products}
            productIndex={index}
          />
        ))}
      </div>
    </>
  )
}
