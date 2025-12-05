export interface AdditionalAttributeProps {
  id: string
  attribute_id: string
  value: string
  attribute: {
    id: string
    name: string
  }
}

// types/product.ts
export type SellerProps = {
  id?: string
  name?: string
  handle?: string
  description?: string
  photo?: string
  tax_id?: string
  store_status: string
  created_at?: string
  updated_at?: string
  products?: Product[]
}


export interface Product {
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
  attribute_values?: AdditionalAttributeProps[]
  seller?: SellerProps | null
  created_at?: string
}




export type SortOptions = "price_asc" | "price_desc" | "created_at"

export interface SingleProductImage {
  id: string
  url: string
  alt: string
}

export interface SingleProductReview {
  id: string
  rating: number
  username: string
  created_at: string
  customer: { first_name: string; last_name: string }
  customer_note: string
  image: string
  seller_note?: string
  updated_at: string
  seller: SellerProps
}

export interface SingleProductSeller {
  id: string
  name: string
  photo: string
  rating: number
  reviewCount: number
  verified: boolean
  handle: string
  joinDate: string
  sold: number
  description: string
  reviews?: SingleProductReview[]
  parcel?: string
  date?: string
  created_at?: string
}

export interface SingleProductMeasurement {
  label: string
  inches: string
  cm: string
}

export interface SingleProduct {
  id: string
  brand: string
  name: string
  price: number
  originalPrice: number
  color: string
  colorVariants?: {
    variant: string
    label: string
    disabled: boolean
  }[]
  size: string
  sizeVariants?: { label: string; disabled: boolean }[]
  condition: string
  images: SingleProductImage[]
  details: string
  measurements: SingleProductMeasurement[]
  shippingReturns: string
  seller: SingleProductSeller
  reviews: SingleProductReview[]
  tags: string[]
  postedDate: string
}
