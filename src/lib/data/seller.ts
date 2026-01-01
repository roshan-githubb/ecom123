import { SellerProps } from "@/types/seller"
import { sdk } from "../config"
import { listProductsWithSort } from "./products"
import { SortOptions } from "@/types/product"

export const getSellerByHandle = async (handle: string) => {
  return sdk.client
    .fetch<{ seller: SellerProps }>(`/store/seller/${handle}`, {
      query: {
        fields: "+created_at,+rating,+email,*reviews,*reviews.customer",
      },
      cache: "force-cache",
    })
    .then(({ seller }) => {
      const response = {
        ...seller,
        reviews: seller.reviews?.filter((item) => item !== null) ?? [],
      }

      return response as SellerProps
    })
    .catch(() => null)
}

export const getProductsBySellerId = async ({   
  sellerId,
  page = 1,
  limit = 12,
  sortBy = "created_at",
  countryCode = "np",
}: {
  sellerId: string
  page?: number
  limit?: number
  sortBy?: SortOptions
  countryCode?: string
}) => {
  return listProductsWithSort({
    page,
    queryParams: { limit },
    sortBy,
    countryCode,
    seller_id: sellerId,
  })
}
