"use server"

import { publicProductClient } from "@/lib/config"
import { sortProducts } from "@/lib/helpers/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@/types/product"
import { getRegion } from "./regions"


type ListProductsResponse = {
  response: { products: any[]; count: number }
  nextPage: number | null
}


export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId: providedRegionId,
}: {
  pageParam?: number
  queryParams?: any
  countryCode?: string
  regionId?: string
}) => {
  const limit = queryParams?.limit || 12
  const offset = (pageParam - 1) * limit

  let regionId = providedRegionId
  if (!regionId && countryCode) {
    const region = await getRegion(countryCode)
    regionId = region?.id
  }

  if (!regionId) {
    console.warn("No region_id - prices will be missing!")
  }

  const { products = [], count = 0 } = await publicProductClient.store.product.list({
    limit,
    offset,
    region_id: regionId!, 
    fields: [ "*variants.calculated_price", "+variants.inventory_quantity", "*seller", "*categories", "*variants", "*seller.products", "*seller.reviews", "*seller.reviews.customer", ].join(","),
    ...queryParams,
  })

  // Filter out products with no price
  const validProducts = products.filter((p: any) =>
    p.variants?.some((v: any) => v.calculated_price?.calculated_amount != null)
  )

  return {
    response: { products: validProducts, count: validProducts.length },
    nextPage: count > offset + limit ? pageParam + 1 : null,
  }
}



export const listProductsWithSort = async ({
  page = 1,
  queryParams,
  sortBy = "created_at",
  countryCode,
  category_id,
  seller_id,
  collection_id,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
  category_id?: string
  seller_id?: string
  collection_id?: string
}): Promise<any> => {
  const limit = queryParams?.limit || 12

  const { response: { products } } = await listProducts({
  pageParam: 1,
  queryParams: {
    ...queryParams,
    limit: 200,
    category_id,
    collection_id,
  },
  countryCode,
})

  let filtered = seller_id
    ? products.filter((p: any) => p.seller?.id === seller_id)
    : products

  filtered = filtered.filter((p: any) =>
    p.variants?.some((v: any) => v.calculated_price != null)
  )

  const sorted = sortProducts(filtered, sortBy)
  const start = (page - 1) * limit
  const end = start + limit

  return {
    response: {
      products: sorted.slice(start, end),
      count: filtered.length,
    },
    nextPage: end < filtered.length ? page + 1 : null,
  }
}
