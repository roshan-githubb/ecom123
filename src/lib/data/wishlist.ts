"use server"
import { Wishlist } from "@/types/wishlist"
import { sdk } from "../config"
import { getAuthHeaders } from "./cookies"
import { revalidatePath } from "next/cache"
import { publicProductClient } from "@/lib/config"
import { getRegion } from "./regions"

export const getUserWishlists = async () => {
  const headers = {
    ...(await getAuthHeaders()),
    "Content-Type": "application/json",
    "x-publishable-api-key": process.env
      .NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY as string,
  }

  try {
    const response = await fetch(
      `${process.env.MEDUSA_BACKEND_URL}/store/wishlist`,
      {
        cache: "no-cache",
        headers,
        method: "GET",
      }
    )

    if (!response.ok) {
      if (response.status === 401) {
        console.error("Unauthorized: User not authenticated")
        return { wishlists: [], count: 0 }
      }
      throw new Error(`Failed to fetch wishlists: ${response.statusText}`)
    }

    const data = await response.json()
    return data as { wishlists: Wishlist[]; count: number }
  } catch (error) {
    console.error("Error fetching wishlists:", error)
    return { wishlists: [], count: 0 }
  }
}

export const getWishlistProductsWithPrices = async (
  productIds: string[],
  countryCode: string = "np"
) => {
  if (productIds.length === 0) {
    return []
  }

  try {
    const region = await getRegion(countryCode)
    if (!region?.id) {
      console.warn("No region found for pricing")
      return []
    }

    const fields = "*variants.calculated_price,+variants.inventory_quantity,*categories,*seller,*variants.variant_images,*images,*options"
    
    const response = await publicProductClient.store.product.list({
      id: productIds,
      region_id: region.id,
      fields: fields,
      limit: 100000000,
    })

    return response.products || []
  } catch (error) {
    console.error("Error fetching wishlist products with prices:", error)
    return []
  }
}

export const addWishlistItem = async ({
  reference_id,
  reference,
}: {
  reference_id: string
  reference: "product"
}) => {
  const headers = {
    ...(await getAuthHeaders()),
    "Content-Type": "application/json",
    "x-publishable-api-key": process.env
      .NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY as string,
  }

  try {
    const response = await fetch(
      `${process.env.MEDUSA_BACKEND_URL}/store/wishlist`,
      {
        headers,
        method: "POST",
        body: JSON.stringify({
          reference,
          reference_id,
        }),
      }
    )

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized: Please log in to add items to wishlist")
      }
      throw new Error(`Failed to add to wishlist: ${response.statusText}`)
    }

    const data = await response.json()
    revalidatePath("/wishlist")
    revalidatePath("/user/wishlist")
    
    return data
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    throw error
  }
}

export const removeWishlistItem = async ({
  wishlist_id,
  product_id,
}: {
  wishlist_id: string
  product_id: string
}) => {
  const headers = {
    ...(await getAuthHeaders()),
    "Content-Type": "application/json",
    "x-publishable-api-key": process.env
      .NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY as string,
  }

  try {
    const response = await fetch(
      `${process.env.MEDUSA_BACKEND_URL}/store/wishlist/${wishlist_id}/product/${product_id}`,
      {
        headers,
        method: "DELETE",
      }
    )

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized: Please log in to remove items from wishlist")
      }
      if (response.status === 404) {
        throw new Error("Wishlist or product not found")
      }
      throw new Error(`Failed to remove from wishlist: ${response.statusText}`)
    }

    const data = await response.json()
    revalidatePath("/wishlist")
    revalidatePath("/user/wishlist")
    
    return data
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    throw error
  }
}
