"use server"
import { revalidatePath } from "next/cache"
import { fetchQuery } from "../config"
import { getAuthHeaders } from "./cookies"
import { HttpTypes } from "@medusajs/types"

export type Review = {
  id: string
  seller: {
    id: string
    name: string
    photo: string
  }
  reference: string
  customer_note: string
  rating: number
  updated_at: string
}

export type ProductReview = {
  id: string
  rating: number
  customer_note: string
  created_at: string
  updated_at: string
  customer: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
}

export type ProductReviewsResponse = {
  reviews: ProductReview[]
  count: number
  offset: number
  limit: number
}

export type Order = HttpTypes.StoreOrder & {
  seller: { id: string; name: string; reviews?: any[] }
  reviews: any[]
}

const getReviews = async () => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const res = await fetchQuery("/store/reviews", {
    headers,
    method: "GET",
    query: { fields: "*seller,+customer.id,+order_id" },
  })

  return res
}

const getProductReviews = async (productId: string, limit: number = 20, offset: number = 0) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const res = await fetchQuery(`/store/products/${productId}/reviews`, {
    headers,
    method: "GET",
    query: { 
      limit: limit.toString(),
      offset: offset.toString()
    },
  })

  return res
}

const createReview = async (review: any) => {
  const headers = {
    ...(await getAuthHeaders()),
    "Content-Type": "application/json",
    "x-publishable-api-key": process.env
      .NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY as string,
  }

  const response = await fetch(
    `${process.env.MEDUSA_BACKEND_URL}/store/reviews`,
    {
      headers,
      method: "POST",
      body: JSON.stringify(review),
    }
  ).then((res) => {
    revalidatePath("/user/reviews")
    revalidatePath("/user/reviews/written")
    return res
  })

  return response.json()
}

const getProductRatingSummary = async (productId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const res = await fetchQuery(`/store/products/${productId}/rating-summary`, {
    headers,
    method: "GET",
  })

  return res
}

export { getReviews, getProductReviews, getProductRatingSummary, createReview }
