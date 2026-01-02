import { getProductReviews, getProductRatingSummary } from "@/lib/data/reviews"
import { SimpleRatingSummary, Review } from "@/types/reviews"

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

// export async function getProductRatingSummaries(productIds: string[]): Promise<Record<string, SimpleRatingSummary>> {
//   const ratingsMap: Record<string, SimpleRatingSummary> = {}
  
//   productIds.forEach(productId => {
//     ratingsMap[productId] = getDefaultRatingSummary()
//   })
  
//   const promises = productIds.map(async (productId) => {
//     try {
//       const response = await getProductRatingSummary(productId)
//       const ratingSummaryResponse = response?.data || response
      
//       if (ratingSummaryResponse && typeof ratingSummaryResponse === 'object') {
//         const ratingSummary: SimpleRatingSummary = {
//           average_rating: ratingSummaryResponse.average_rating || 0,
//           total_reviews: ratingSummaryResponse.total_reviews || 0,
//           last_month_sales: ratingSummaryResponse.last_month_sales || 0
//         }
//         ratingsMap[productId] = ratingSummary
//       }
      
//       return { productId, ratingSummary: ratingsMap[productId] }
//     } catch (error) {
//       return { productId, ratingSummary: ratingsMap[productId] }
//     }
//   })
  
//   await Promise.all(promises)
  
//   return ratingsMap
// }

export async function getProductRatingSummaries(
  productIds: string[]
): Promise<Record<string, SimpleRatingSummary>> {

  const ratingsMap: Record<string, SimpleRatingSummary> = {}

  // Initialize defaults
  for (const productId of productIds) {
    ratingsMap[productId] = getDefaultRatingSummary()
  }

  const results = await Promise.allSettled(
    productIds.map(async (productId) => {
      const response = await getProductRatingSummary(productId)
      const data = response?.data ?? response

      return {
        productId,
        ratingSummary: {
          average_rating: data?.average_rating ?? 0,
          total_reviews: data?.total_reviews ?? 0,
          last_month_sales: data?.last_month_sales ?? 0
        }
      }
    })
  )

  // Apply only successful ones
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