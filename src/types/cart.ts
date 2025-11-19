import { HttpTypes } from "@medusajs/types"

export interface Cart extends Omit<HttpTypes.StoreCart, "promotions"> {
  promotions?: (HttpTypes.StorePromotion & {
    created_at?: string
    updated_at?: string
    deleted_at?: string | null
  })[]
}


export interface StoreCartLineItemOptimisticUpdate
  extends Partial<HttpTypes.StoreCartLineItem> {
  tax_total: number
}
