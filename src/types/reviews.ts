export interface Customer {
  id: string;
  company_name: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  has_account: boolean;
  metadata: Record<string, any> | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Review {
  id: string;
  rating: number;
  customer_note: string;
  seller_note?: string | null;
  created_at: string;
  updated_at: string;
  customer: Customer;
}


export interface ReviewListResponse {
  reviews: Review[];
  count: number;
  offset: number;
  limit: number;
}

export interface ProductRatingSummary {
  product_id: string;
  average_rating: number;
  total_reviews: number;
  rating_distribution: Record<1 | 2 | 3 | 4 | 5, number>;
  last_month_sales: number;
}


export interface SellerRatingSummary {
  seller_id: string;
  average_rating: number;
  total_reviews: number;
  rating_distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export type RatingSummary = {
  product_id?: string;
  seller_id?: string;
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
  };
  last_month_sales?: number;
};

export type SimpleRatingSummary = {
  average_rating: number;
  total_reviews: number;
  last_month_sales?: number;
};

export interface ProductRatingSummaryResponse {
  product_id: string;
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
  };
  last_month_sales: number;
}

export interface ProductReview {
  id: string;
  rating: number;
  customer_note: string;
  created_at: string;
  updated_at: string;
  customer: {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
  } | null;
  product_id: string;
}

export interface ProductReviewsResponse {
  reviews: ProductReview[];
  count: number;
}

export interface SellerReview {
  id: string;
  rating: number;
  customer_note: string;
  created_at: string;
  updated_at: string;
  customer: {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
  } | null;
  seller_id: string;
}


export interface SellerReviewsResponse {
  reviews: SellerReview[];
  count: number;
}

export interface SellerRatingSummary {
  average_rating: number;
  total_reviews: number;
}