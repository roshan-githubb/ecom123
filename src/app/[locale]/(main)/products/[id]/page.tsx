import { notFound } from "next/navigation"
import ProductDetailClient from "../../ProductDetailClient/page"
import { Review, ReviewListResponse } from "@/types/reviews"
import { publicProductClient } from "@/lib/config"
import { getProductRatingSummaries } from "@/lib/helpers/rating-helpers"
import { safeDataFetch } from "@/lib/utils/safe-data"

export const revalidate = 0 // Disable caching for this page

interface Params {
  id: string
  locale: string
}

export default async function ItemDetailPage({ params }: { params: Params }) {
  const { id, locale } = await params

  try {
    const response = await publicProductClient.store.product.retrieve(id, {
      region_id: process.env.NEXT_PUBLIC_REGION_ID!,
      fields: "*seller,*variants.calculated_price,+variants.inventory_quantity,*variants.variant_images",
    })

    const product = response.product

    if (!product) {
      console.error("Product missing or filtered out:", id)
      return notFound()
    }

    const headers = {
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
      "Content-Type": "application/json",
    }

    const reviewUrl = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/products/${id}/reviews?limit=10&offset=0`
    const reviewRes = await fetch(reviewUrl, {
      method: "GET",
      cache: "no-store",
      headers,
    })

    let reviews: Review[] = []

    if (reviewRes.ok) {
      const reviewData: ReviewListResponse = await reviewRes.json()
      reviews = reviewData.reviews || []
    }

    // Fetch related products using listProducts

    // Safe ratings fetch
    const ratingsResult = await safeDataFetch(
      () => getProductRatingSummaries([id]),
      {},
      "product-detail"
    )
    const ratingsMap = ratingsResult.data || {}

    return (
      <ProductDetailClient
        product={product as any}
        reviews={reviews}
        ratingSummary={ratingsMap[id] || null}
      />
    )
  } catch (err) {
    console.error("Error fetching product detail data:", err)

    return notFound()
  }
}
