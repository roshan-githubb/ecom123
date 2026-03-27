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
  const validProducts = products.filter(product => {
    const price = product?.variants?.[0]?.calculated_price?.calculated_amount ?? 0
    return price !== 0
  })

  return (
    <>
      <div
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8"
      >
        {validProducts.map((product, index) => (
          <HomeProductCardWithRatings 
            key={product.id} 
            api_product={product} 
            allProducts={validProducts}
            productIndex={index}
          />
        ))}
      </div>
    </>
  )
}
