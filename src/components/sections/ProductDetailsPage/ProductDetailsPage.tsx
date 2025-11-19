// @ts-nocheck

import { ProductDetails, ProductGallery } from "@/components/organisms"
import { listProducts } from "@/lib/data/products"
import { HomeProductSection } from "../HomeProductSection/HomeProductSection"
import NotFound from "@/app/not-found"

// Custom interfaces to fix TS errors
interface SellerProduct {
  id: string
  title: string
  handle: string
  description: string
  images: string[]
  brand?: string
  size?: string
  price: number
  originalPrice: number
  currency: string
  attribute_values?: any[]
}

interface Seller {
  store_status: string
  products?: SellerProduct[]
  handle?: string
}

interface ProductWithSeller {
  id: string
  title: string
  handle: string
  description: string
  images: string[]
  brand?: string
  size?: string
  price: number
  originalPrice: number
  currency: string
  attribute_values?: any[]
  seller?: Seller
}

export const ProductDetailsPage = async ({
  handle,
  locale,
}: {
  handle: string
  locale: string
}) => {
  const prodResponse = await listProducts({
    countryCode: locale,
    queryParams: { handle: [handle], limit: 1 },
  }).then(({ response }) => response.products[0])

  if (!prodResponse) return null

  // Map StoreProduct -> ProductWithSeller
  const prod: ProductWithSeller = {
    id: prodResponse.id,
    title: prodResponse.title,
    handle: prodResponse.handle,
    description: prodResponse.description || "",
    images: prodResponse.images || [],
    brand: prodResponse?.brand || "",
    size: prodResponse?.size || "",
    price: prodResponse.variants?.[0]?.prices?.[0]?.amount || 0,
    originalPrice: prodResponse.variants?.[0]?.prices?.[0]?.amount || 0,
    currency: prodResponse.variants?.[0]?.prices?.[0]?.currency_code || "eur",
    attribute_values: prodResponse.attribute_values || [],
    seller: prodResponse.seller
      ? {
          store_status: prodResponse.seller.store_status,
          handle: prodResponse.seller.handle,
          products: prodResponse.seller.products?.map((p) => ({
            id: p.id,
            title: p.title,
            handle: p.handle,
            description: p.description || "",
            images: p.images || [],
            brand: p.brand || "",
            size: p.size || "",
            price: p.variants?.[0]?.prices?.[0]?.amount || 0,
            originalPrice: p.variants?.[0]?.prices?.[0]?.amount || 0,
            currency: p.variants?.[0]?.prices?.[0]?.currency_code || "eur",
            attribute_values: p.attribute_values || [],
          })),
        }
      : undefined,
  }

  if (prod.seller?.store_status === "SUSPENDED") return NotFound()

  return (
    <>
      <div className="flex flex-col md:flex-row lg:gap-12">
        <div className="md:w-1/2 md:px-2">
          <ProductGallery images={prod.images} />
        </div>
        <div className="md:w-1/2 md:px-2">
          <ProductDetails product={prod} locale={locale} />
        </div>
      </div>

      {prod.seller?.products?.length ? (
        <div className="my-8">
          <HomeProductSection
            heading="More from this seller"
            products={prod.seller.products}
            locale={locale}
          />
        </div>
      ) : null}
    </>
  )
}
