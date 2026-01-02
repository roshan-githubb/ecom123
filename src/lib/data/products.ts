"use server"

import { publicProductClient } from "@/lib/config"
import { sortProducts } from "@/lib/helpers/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@/types/product"
import { getRegion } from "./regions"
import { safeDataFetch, safeAccess } from "@/lib/utils/safe-data"


export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode = "np",
  regionId: providedRegionId,
}: {
  pageParam?: number
  queryParams?: any
  countryCode?: string
  regionId?: string
}) => {
  const result = await safeDataFetch(
    async () => {
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

      const response = await publicProductClient.store.product.list({
        limit,
        offset,
        region_id: regionId!,
        fields: ["*variants.calculated_price", "+variants.inventory_quantity", "*seller", "*categories", "*variants", "*seller.products", "*seller.reviews", "*seller.reviews.customer",].join(","),
        ...queryParams,
      })

      const products = safeAccess(response, 'products', [], 'listProducts')
      const count = safeAccess(response, 'count', 0, 'listProducts')

      // Filter out products with no price
      const validProducts = products.filter((p: any) =>
        p.variants?.some((v: any) => v.calculated_price?.calculated_amount != null)
      )

      return {
        response: { products: validProducts, count: validProducts.length },
        nextPage: count > offset + limit ? pageParam + 1 : null,
      }
    },
    {
      response: { products: [], count: 0 },
      nextPage: null,
    },
    'listProducts'
  )

  return result.data || {
    response: { products: [], count: 0 },
    nextPage: null,
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
  const result = await safeDataFetch(
    async () => {
      const limit = queryParams?.limit || 12
      const fetchLimit = seller_id ? 1000 : 200

      const { response: { products } } = await listProducts({
        pageParam: 1,
        queryParams: {
          ...queryParams,
          limit: fetchLimit,
          category_id,
          collection_id,
        },
        countryCode,
      })

      let filtered = seller_id
        ? products.filter((p: any) => safeAccess(p, 'seller.id', null, 'listProductsWithSort') === seller_id)
        : products

      filtered = filtered.filter((p: any) =>
        p.variants?.some((v: any) => v.calculated_price != null)
      )

      console.log(`Seller ${seller_id} products found:`, filtered.length, "out of", products.length, "total products");

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
    },
    {
      response: { products: [], count: 0 },
      nextPage: null,
    },
    'listProductsWithSort'
  )

  return result.data || {
    response: { products: [], count: 0 },
    nextPage: null,
  }
}
