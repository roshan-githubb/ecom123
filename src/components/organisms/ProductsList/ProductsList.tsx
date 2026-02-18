// import { ProductCard } from "@/components/molecules/ProductCard/ProductCard"
import { HttpTypes } from "@medusajs/types"
import { SkeletonProductCard } from "../ProductCard/SkeletonProductCard"
import { HomeProductCardWithRatings } from "@/components/molecules/HomeProductCard/HomeProductCardWithRatings"

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
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
      >
        {products.map((product, index) => {
           const price = product?.variants?.[0]?.calculated_price?.calculated_amount ?? 0
            if(price == 0) return null;
          return (
          // <SkeletonProductCard key={product.id} />
          
          <HomeProductCardWithRatings 
            key={product.id} 
            api_product={product} 
            allProducts={products}
            productIndex={index}
          />
        )
        })}
      </div>
    </>
  )
}
