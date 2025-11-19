import { ProductCard } from "@/components/molecules/ProductCard/ProductCard"
import { HttpTypes } from "@medusajs/types"

export const ProductsList = ({
  products,
}: {
  products: HttpTypes.StoreProduct[]
}) => {
  return (
    <>
      {products.map((product) => (
        <ProductCard key={product.id} api_product={product} />
      ))}
    </>
  )
}
