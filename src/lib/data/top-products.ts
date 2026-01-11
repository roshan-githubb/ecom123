import { safeDataFetch } from '@/lib/utils/safe-data'

export async function getTopProducts({
  region_id,
  currency_code = "npr",
  category_id,
  limit = 20,
  offset = 0,
  fields = "*seller,*seller.reviews,*seller.reviews.customer",
}: {
  min_discount?: number
  max_discount?: number
  region_id?: string
  currency_code?: string
  category_id?: string
  limit?: number
  offset?: number
  fields?: string
}) {
  const result = await safeDataFetch(
    async () => {
      const params = new URLSearchParams()
      region_id = region_id || process.env.NEXT_PUBLIC_REGION_ID

      if (region_id) params.append("region_id", region_id)
      if (currency_code) params.append("currency_code", currency_code)
      if (category_id) params.append("category_id", category_id)

      params.append("limit", limit.toString())
      params.append("offset", offset.toString())
      params.append("fields", fields)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/top-products`,
        {
          method: "GET",
          headers: {
            "x-publishable-api-key":
              process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
            "Content-Type": "application/json",
          },
          next: { revalidate: 60 },
        }
      )

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${await res.text()}`)
      }

      const data = await res.json()
      return data || { products: [] }
    },
    { products: [] },
    'getTopProducts'
  )

  return result.data || { products: [] }
}
