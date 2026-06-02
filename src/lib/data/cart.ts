"use server"

import { fetchQuery, sdk } from "../config"

import medusaError from "@/lib/helpers/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { redirect } from "next/navigation"
import { safeRevalidateTag as revalidateTag, safeRevalidatePath as revalidatePath } from "@/lib/utils/cache"
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeCartId,
  setCartId,
} from "./cookies"
import { getRegion } from "./regions"
import { parseVariantIdsFromError } from "@/lib/helpers/parse-variant-error"


export async function retrieveCart(cartId?: string) {
  const id = cartId || (await getCartId())

  if (!id) {
    return null
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return await sdk.client
    .fetch<HttpTypes.StoreCartResponse>(`/store/carts/${id}`, {
      method: "GET",
      query: {
        fields:
          "*items,*region, *items.product, *items.variant, *items.variant.options, items.variant.options.option.title," +
          "*items.thumbnail, *items.metadata, +items.total, *promotions, *shipping_methods, *items.product.seller," +
          "*shipping_address, *billing_address" +
          "",
      },
      headers,
      cache: "no-cache",
    })
    .then(({ cart }) => cart)
    .catch(() => null)
}

export async function retrieveCartFast(cartId?: string) {
  const id = cartId || (await getCartId())

  if (!id) {
    return null
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return await sdk.client
    .fetch<HttpTypes.StoreCartResponse>(`/store/carts/${id}`, {
      method: "GET",
      query: {
        
        fields: "*items,*region,*shipping_address,*billing_address,*shipping_methods",
      },
      headers,
      cache: "no-cache",
    })
    .then(({ cart }) => cart)
    .catch(() => null)
}

/**
 * Retrieve cart with timeout fallback
 * Returns partial data if full fetch takes too long
 */
export async function retrieveCartWithTimeout(timeoutMs: number = 3000) {
  const cartId = await getCartId()
  
  if (!cartId) {
    return null
  }

  try {
    // Race between fast fetch and timeout
    const result = await Promise.race([
      retrieveCartFast(cartId),
      new Promise<null>((resolve) => 
        setTimeout(() => resolve(null), timeoutMs)
      )
    ])

    return result
  } catch (error) {
    console.error('Cart fetch error:', error)
    return null
  }
}

export async function getOrSetCart(countryCode: string) {
  const region = await getRegion(countryCode)

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`)
  }

  let cart = await retrieveCart()

  const headers = {
    ...(await getAuthHeaders()),
  }

  if (!cart) {
    const cartResp = await sdk.store.cart.create(
      { region_id: region.id },
      {},
      headers
    )
    cart = cartResp.cart

    await setCartId(cart.id)

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  if (cart && cart?.region_id !== region.id) {
    await sdk.store.cart.update(cart.id, { region_id: region.id }, {}, headers)
    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  return cart
}

export async function updateCart(data: HttpTypes.StoreUpdateCart) {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No existing cart found, please create one before updating")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return await sdk.store.cart
    .update(cartId, data, {}, headers)
    .then(async ({ cart }) => {
      const cartCacheTag = await getCacheTag("carts")
      await revalidateTag(cartCacheTag)
      return cart
    })
    .catch(medusaError)
}

export async function addToCart({
  variantId,
  quantity,
  countryCode,
}: {
  variantId: string
  quantity: number
  countryCode: string
}) {
  if (!variantId) {
    throw new Error("Missing variant ID when adding to cart")
  }

  const cart = await getOrSetCart(countryCode)

  if (!cart) {
    throw new Error("Error retrieving or creating cart")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const currentItem = cart.items?.find((item) => item.variant_id === variantId)

  if (currentItem) {
    await sdk.store.cart
      .updateLineItem(
        cart.id,
        currentItem.id,
        { quantity: currentItem.quantity + quantity },
        {},
        headers
      )
      .catch(medusaError)
      .finally(async () => {
        const cartCacheTag = await getCacheTag("carts")
        revalidateTag(cartCacheTag)
      })
  } else {
    await sdk.store.cart
      .createLineItem(
        cart.id,
        {
          variant_id: variantId,
          quantity,
        },
        {},
        headers
      )
      .then(async () => {
        const cartCacheTag = await getCacheTag("carts")
        revalidateTag(cartCacheTag)
      })
      .catch(medusaError)
      .finally(async () => {
        const cartCacheTag = await getCacheTag("carts")
        revalidateTag(cartCacheTag)
      })
  }
}

export async function updateLineItem({
  lineId,
  quantity,
}: {
  lineId: string
  quantity: number
}) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when updating line item")
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("Missing cart ID when updating line item")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const res = await fetchQuery(`/store/carts/${cartId}/line-items/${lineId}`, {
    body: { quantity },
    method: "POST",
    headers,
  })

  const cartCacheTag = await getCacheTag("carts")
  await revalidateTag(cartCacheTag)

  return res
}

export async function deleteLineItem(lineId: string) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when deleting line item")
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("Missing cart ID when deleting line item")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart
    .deleteLineItem(cartId, lineId, {})
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      await revalidateTag(cartCacheTag)
    })
    .catch(medusaError)
}

export async function setShippingMethod({
  cartId,
  shippingMethodId,
}: {
  cartId: string
  shippingMethodId: string
}) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const res = await fetchQuery(`/store/carts/${cartId}/shipping-methods`, {
    body: { option_id: shippingMethodId },
    method: "POST",
    headers,
  })

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)

  return res
}

export async function initiatePaymentSession(
  cart: HttpTypes.StoreCart,
  data: {
    provider_id: string
    context?: Record<string, unknown>
  }
) {
  console.log('initiating payment session with cart:', cart, data)
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.payment
    .initiatePaymentSession(cart, data, {}, headers)
    .then(async (resp) => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      return resp
    })
    .catch(medusaError)
}

export async function applyPromotions(codes: string[]) {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No existing cart found")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .update(cartId, { promo_codes: codes }, {}, headers)
    .then(async ({ cart }) => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      // @ts-ignore
      const applied = cart.promotions?.some((promotion: any) =>
        codes.includes(promotion.code)
      )
      return applied
    })
    .catch(medusaError)
}

export async function removeShippingMethod(shippingMethodId: string) {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No existing cart found")
  }

  const headers = {
    ...(await getAuthHeaders()),
    "Content-Type": "application/json",
    "x-publishable-api-key": process.env
      .NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY as string,
  }

  return fetch(
    `${process.env.MEDUSA_BACKEND_URL}/store/carts/${cartId}/shipping-methods`,
    {
      method: "DELETE",
      body: JSON.stringify({ shipping_method_ids: [shippingMethodId] }),
      headers,
    }
  )
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
    })
    .catch(medusaError)
}

export async function deletePromotionCode(promoId: string) {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No existing cart found")
  }
  const headers = {
    ...(await getAuthHeaders()),
    "Content-Type": "application/json",
    "x-publishable-api-key": process.env
      .NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY as string,
  }

  return fetch(
    `${process.env.MEDUSA_BACKEND_URL}/store/carts/${cartId}/promotions`,
    {
      method: "DELETE",
      body: JSON.stringify({ promo_codes: [promoId] }),
      headers,
    }
  )
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
    })
    .catch(medusaError)
}

// Address form handling
export async function setAddresses(currentState: unknown, formData: FormData) {
  try {
    if (!formData) {
      throw new Error("No form data found when setting addresses")
    }
    const cartId = await getCartId()
    if (!cartId) {
      throw new Error("No existing cart found when setting addresses")
    }

    const currentCart = await retrieveCart(cartId)

    const data = {
      shipping_address: {
        first_name: formData.get("shipping_address.first_name"),
        last_name: formData.get("shipping_address.last_name"),
        address_1: formData.get("shipping_address.address_1"),
        address_2: "",
        company: formData.get("shipping_address.company"),
        postal_code: formData.get("shipping_address.postal_code"),
        city: formData.get("shipping_address.city"),
        country_code: formData.get("shipping_address.country_code"),
        province: formData.get("shipping_address.province"),
        phone: formData.get("shipping_address.phone"),
      },
    } as any

    const emailFromForm = formData.get("email")
    if (!currentCart?.email && emailFromForm) {
      data.email = emailFromForm
    }


    data.billing_address = data.shipping_address



    await updateCart(data)


    const authHeaders = await getAuthHeaders()
    const isDefaultShipping = formData.get("isDefaultShipping") === "true"

    if (authHeaders && isDefaultShipping) {
      try {
        const { addCustomerAddress } = await import("./customer")
        const addressFormData = new FormData()
        addressFormData.set("address_name", formData.get("address_name") as string || "Home")
        addressFormData.set("first_name", formData.get("shipping_address.first_name") as string)
        addressFormData.set("last_name", formData.get("shipping_address.last_name") as string)
        addressFormData.set("company", formData.get("shipping_address.company") as string || "")
        addressFormData.set("address_1", formData.get("shipping_address.address_1") as string)
        addressFormData.set("city", formData.get("shipping_address.city") as string)
        addressFormData.set("postal_code", formData.get("shipping_address.postal_code") as string)
        addressFormData.set("country_code", formData.get("shipping_address.country_code") as string)
        addressFormData.set("phone", formData.get("shipping_address.phone") as string)
        addressFormData.set("province", formData.get("shipping_address.province") as string)
        addressFormData.set("isDefaultShipping", "true")

        await addCustomerAddress(addressFormData)
      } catch (customerError) {

      }
    }

    await revalidatePath("/cart")
  } catch (e: any) {
    return e.message
  }
}


export async function setAddressesWithCartId(
  cartId: string,
  addressData: {
    email?: string
    shipping_address: {
      first_name: string
      last_name: string
      address_1: string
      address_2?: string
      company?: string
      postal_code: string
      city: string
      country_code: string
      province: string
      phone: string
    }
  }
) {
  try {
    if (!cartId) {
      throw new Error("No cart ID provided")
    }

    // Set the cart ID in cookies temporarily so updateCart can use it
    await setCartId(cartId)

    const currentCart = await retrieveCart(cartId)

    const data = {
      shipping_address: addressData.shipping_address,
      billing_address: addressData.shipping_address, // Set billing same as shipping
    } as any


    if (addressData.email && !currentCart?.customer_id) {
      data.email = addressData.email
    }

    // Use the existing updateCart function
    const result = await updateCart(data)

    await revalidatePath("/cart")

    return null // Success
  } catch (e: any) {
    return e.message
  }
}


export async function placeOrder(cartId?: string) {
  const id = cartId || (await getCartId())

  if (!id) {
    throw new Error("No existing cart found when placing an order")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const cartRes: any = await sdk.store.cart
    .complete(id, {}, headers)
    .then(async (cartRes) => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      return cartRes
    })
    .catch((error) => {
      if (error?.status === 401) {
        console.log("Unauthorized error detected when placing order", error)

        return {
          error: true,
          status: 401,
          message: "Unauthorized",
        }
      }

      console.error("Error placing order:", error)
      throw medusaError(error)
    })


  if (cartRes?.error) {
    return cartRes
  }

  if (cartRes?.order_set) {
    removeCartId()

    return {
      success: true,
      orderId: cartRes.order_set.orders[0].id,
    }
  }

  return cartRes.order_set.cart
}


export async function updateRegion(countryCode: string, currentPath: string) {
  const cartId = await getCartId()
  const region = await getRegion(countryCode)

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`)
  }

  if (cartId) {
    await updateCart({ region_id: region.id })
    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  const regionCacheTag = await getCacheTag("regions")
  revalidateTag(regionCacheTag)

  const productsCacheTag = await getCacheTag("products")
  revalidateTag(productsCacheTag)

  redirect(`/${countryCode}${currentPath}`)
}


export async function updateRegionWithValidation(
  countryCode: string,
  currentPath: string
): Promise<{ removedItems: string[]; newPath: string }> {
  const cartId = await getCartId()
  const region = await getRegion(countryCode)

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`)
  }

  let removedItems: string[] = []

  if (cartId) {
    const headers = {
      ...(await getAuthHeaders()),
    }

    try {
      await updateCart({ region_id: region.id })
    } catch (error: any) {

      if (!error?.message?.includes("do not have a price")) {

        throw error
      }


      const problematicVariantIds = parseVariantIdsFromError(error.message)


      if (!problematicVariantIds.length) {
        throw new Error("Failed to parse variant IDs from error")
      }


      try {
        const { cart } = await sdk.client.fetch<HttpTypes.StoreCartResponse>(
          `/store/carts/${cartId}`,
          {
            method: "GET",
            query: {
              fields: "*items",
            },
            headers,
            cache: "no-cache",
          }
        )


        for (const variantId of problematicVariantIds) {
          const item = cart?.items?.find(
            (item) => item.variant_id === variantId
          )
          if (item) {
            try {
              await sdk.store.cart.deleteLineItem(cart.id, item.id, {})
              removedItems.push(item.product_title || "Unknown product")
            } catch (deleteError) {

            }
          }
        }


        if (removedItems.length > 0) {
          await updateCart({ region_id: region.id })
        }
      } catch (fetchError) {
        throw new Error("Failed to handle incompatible cart items")
      }
    }


    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  const regionCacheTag = await getCacheTag("regions")
  revalidateTag(regionCacheTag)

  const productsCacheTag = await getCacheTag("products")
  revalidateTag(productsCacheTag)

  return {
    removedItems,
    newPath: `/${countryCode}${currentPath}`,
  }
}

export async function listCartOptions() {
  const cartId = await getCartId()
  const headers = {
    ...(await getAuthHeaders()),
  }
  const next = {
    ...(await getCacheOptions("shippingOptions")),
  }

  return await sdk.client.fetch<{
    shipping_options: HttpTypes.StoreCartShippingOption[]
  }>("/store/shipping-options", {
    query: { cart_id: cartId },
    next,
    headers,
    cache: "force-cache",
  })
}
