export interface Customer {
  id: string
  company_name: string | null
  first_name: string
  last_name: string
  email: string
  phone: string
  has_account: boolean
  metadata: Record<string, any> | null
  created_by: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface Review {
  id: string
  rating: number
  customer_note: string
  seller_note?: string | null
  created_at: string
  updated_at: string
  customer: Customer
}

export interface ReviewListResponse {
  reviews: Review[]
  count: number
  offset: number
  limit: number
}
