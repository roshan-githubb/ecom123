import { getProductReviews, getProductRatingSummary } from "@/lib/data/reviews"
import { SimpleRatingSummary, Review } from "@/types/reviews"

const ratingsCache = new Map<string, { data: SimpleRatingSummary; timestamp: number }>()
const CACHE_TTL = 60000 // 1 minute cache

const pendingRequests = new Map<string, Promise<SimpleRatingSummary>>()

const USE_BATCH_ENDPOINT = false
const BATCH_ENDPOINT = '/store/products/ratings/batch'

function calculateRatingSummary(reviews: Review[]): SimpleRatingSummary {
  if (!reviews || reviews.length === 0) {
    return {
      average_rating: 0,
      total_reviews: 0,
      last_month_sales: 0
    }
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
  const averageRating = totalRating / reviews.length

  return {
    average_rating: Number(averageRating.toFixed(1)),
    total_reviews: reviews.length,
    last_month_sales: 0 
  }
}


async function fetchRatingsBatch(productIds: string[]): Promise<Record<string, SimpleRatingSummary>> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}${BATCH_ENDPOINT}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
        },
        body: JSON.stringify({ product_ids: productIds }),
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    )

    if (!response.ok) {
      throw new Error(`Batch endpoint failed: ${response.status}`)
    }

    const data = await response.json()
    return data.ratings || {}
  } catch (error) {
    console.warn('Batch ratings endpoint failed, falling back to individual requests:', error)
    return {}
  }
}

export async function getProductRatingSummaries(
  productIds: string[]
): Promise<Record<string, SimpleRatingSummary>> {

  const ratingsMap: Record<string, SimpleRatingSummary> = {}
  const now = Date.now()

  const uncachedIds: string[] = []
  
  for (const productId of productIds) {
    const cached = ratingsCache.get(productId)
    
    if (cached && (now - cached.timestamp) < CACHE_TTL) {

      ratingsMap[productId] = cached.data
    } else {
     
      uncachedIds.push(productId)
      ratingsMap[productId] = getDefaultRatingSummary()
    }
  }

  if (uncachedIds.length === 0) {
    return ratingsMap
  }

  if (USE_BATCH_ENDPOINT && uncachedIds.length > 5) {
    console.log(`[Ratings] Using batch endpoint for ${uncachedIds.length} products`)
    
    const batchResults = await fetchRatingsBatch(uncachedIds)
    
    if (Object.keys(batchResults).length > 0) {
      for (const [productId, rating] of Object.entries(batchResults)) {
        ratingsMap[productId] = rating
        ratingsCache.set(productId, {
          data: rating,
          timestamp: Date.now()
        })
      }
      return ratingsMap
    }
    
    console.warn('[Ratings] Batch endpoint failed, falling back to individual requests')
  }

  console.log(`[Ratings] Fetching ${uncachedIds.length} ratings in parallel`)
  
  const results = await Promise.allSettled(
    uncachedIds.map(async (productId) => {
      let request = pendingRequests.get(productId)
      
      if (!request) {
        request = (async () => {
          try {
            const response = await getProductRatingSummary(productId)
            const data = response?.data ?? response

            const ratingSummary: SimpleRatingSummary = {
              average_rating: data?.average_rating ?? 0,
              total_reviews: data?.total_reviews ?? 0,
              last_month_sales: data?.last_month_sales ?? 0
            }

            ratingsCache.set(productId, {
              data: ratingSummary,
              timestamp: Date.now()
            })

            return ratingSummary
          } finally {
            pendingRequests.delete(productId)
          }
        })()
        
        pendingRequests.set(productId, request)
      }

      const ratingSummary = await request

      return {
        productId,
        ratingSummary
      }
    })
  )

  for (const result of results) {
    if (result.status === "fulfilled") {
      ratingsMap[result.value.productId] = result.value.ratingSummary
    }
  }

  return ratingsMap
}


export async function getProductRatingSummaryById(productId: string): Promise<SimpleRatingSummary> {
  try {
    const response = await getProductRatingSummary(productId)
    const ratingSummaryResponse = response?.data || response
    
    return {
      average_rating: ratingSummaryResponse.average_rating || 0,
      total_reviews: ratingSummaryResponse.total_reviews || 0,
      last_month_sales: ratingSummaryResponse.last_month_sales || 0
    }
  } catch (error) {
    console.error(`Failed to fetch rating summary for product ${productId}:`, error)
    return getDefaultRatingSummary()
  }
}

export async function getProductReviewsAndRating(productId: string): Promise<{
  ratingSummary: SimpleRatingSummary
  reviews: Review[]
}> {
  try {
    const response = await getProductReviews(productId, 20, 0)
    const reviewsResponse = response?.data || response
    const reviews = reviewsResponse?.reviews || []
    const ratingSummary = calculateRatingSummary(reviews)
    
    return {
      ratingSummary,
      reviews
    }
  } catch (error) {
    console.error(`Failed to fetch reviews for product ${productId}:`, error)
    return {
      ratingSummary: getDefaultRatingSummary(),
      reviews: []
    }
  }
}

export function getDefaultRatingSummary(): SimpleRatingSummary {
  return {
    average_rating: 0,
    total_reviews: 0,
    last_month_sales: 0
  }
}