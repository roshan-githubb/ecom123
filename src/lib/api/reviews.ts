import { ProductReview, ProductReviewsResponse, RatingSummary, SellerReview, SellerReviewsResponse, SellerRatingSummary } from "@/types/reviews";

export const fetchProductReviews = async (
  productId: string,
  limit = 10,
  offset = 0
): Promise<ProductReviewsResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/products/${productId}/reviews?limit=${limit}&offset=${offset}`
  );
  if (!res.ok) throw new Error("Failed to fetch product reviews");
  const data: ProductReviewsResponse = await res.json();
  return data;
};



export const fetchProductRatingSummary = async (
  productId: string
): Promise<RatingSummary> => {
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  if (!publishableKey) {
    console.warn("Missing NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY")
    return { average_rating: 0, total_reviews: 0 }
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/products/${productId}/rating-summary`,
      {
        headers: {
          "x-publishable-api-key": publishableKey,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    )

    if (!res.ok) {
      console.log(` Failed to fetch for ${productId}: ${res.status} ${res.statusText}`)
      return { average_rating: 0, total_reviews: 0 }
    }

    const data = await res.json()
    const payload = (data as any).data || data

    return {
      average_rating: Number(payload.average_rating ?? 0),
      total_reviews: Number(payload.total_reviews ?? 0),
      last_month_sales: Number(payload.last_month_sales ?? 0),
    }
  } catch (err) {
    console.error(`[fetchProductRatingSummary] Error for ${productId}`, err)
    return { average_rating: 0, total_reviews: 0 }
  }
}



export const submitProductReview = async (
  productId: string,
  rating: number,
  customerNote: string
): Promise<void> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/reviews`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference: "product",
        reference_id: productId,
        rating,
        customer_note: customerNote,
      }),
    }
  );
  if (!res.ok) throw new Error("Failed to submit product review");
};

export const fetchSellerReviews = async (
  sellerId: string,
  limit = 10,
  offset = 0
): Promise<SellerReviewsResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/seller/${sellerId}/reviews?limit=${limit}&offset=${offset}`
  );
  if (!res.ok) throw new Error("Failed to fetch seller reviews");
  const data: SellerReviewsResponse = await res.json();
  return data;
};

export const fetchSellerRatingSummary = async (
  sellerId: string
): Promise<SellerRatingSummary> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/seller/${sellerId}/rating-summary`
  );
  if (!res.ok) throw new Error("Failed to fetch seller rating summary");
  const data: SellerRatingSummary = await res.json();
  return data;
};

export const submitSellerReview = async (
  sellerId: string,
  rating: number,
  customerNote: string
): Promise<void> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/reviews`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference: "seller",
        reference_id: sellerId,
        rating,
        customer_note: customerNote,
      }),
    }
  );
  if (!res.ok) throw new Error("Failed to submit seller review");
};
