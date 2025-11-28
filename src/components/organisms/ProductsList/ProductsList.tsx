import { ProductCard } from "@/components/molecules/ProductCard/ProductCard"
import { HttpTypes } from "@medusajs/types"

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
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {products.map((product) => (
          <ProductCard key={product.id} api_product={product} locale={locale} />
        ))}
      </div>
    </>
  )
}
