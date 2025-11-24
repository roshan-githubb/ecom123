import { ProductCard } from "@/components/molecules/ProductCard/ProductCard"
import { HttpTypes } from "@medusajs/types"

export const ProductsList = ({
  products,
  locale,
}: {
  products: HttpTypes.StoreProduct[]
  locale:string
}) => {
  return (
    <>
      {products.map((product) => (
        <ProductCard key={product.id} api_product={product} locale={locale} />
      ))}
    </>
  )
}
