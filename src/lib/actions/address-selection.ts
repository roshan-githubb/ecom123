// src/lib/actions/address-selection.ts
"use client";

import { Address } from "@/store/addressStore";
import { getLocalCartId } from "@/services/cart";
import { setAddressesWithCartId } from "@/lib/data/cart";

/**
 * Applies the selected address to the cart via Server Action
 * @param address The local Address object selected by the user.
 * @returns The error message string on failure, or null on success.
 */
export async function applySelectedAddressToCart(address: Address) {
  try {
    const cartId = getLocalCartId();
    
    if (!cartId) {
      return "No cart found. Please add items to your cart first.";
    }

    // --- 1. Name Splitting ---
    const nameParts = address.name.trim().split(/\s+/);
    const first_name = nameParts[0] || '';
    const last_name = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '.';

    // --- 2. Prepare address data ---
    const addressData = {
      email: address.email,
      shipping_address: {
        first_name,
        last_name,
        company: "",
        address_1: address.line1,
        address_2: address.line2 || "",
        city: address.district,
        province: address.province,
        postal_code: address.postalCode,
        country_code: address.countryCode,
        phone: address.phone,
      },
    };

    // --- 3. Call Server Action to update cart with address ---
    const error = await setAddressesWithCartId(cartId, addressData);

    if (error) {
      console.error("Failed to set address:", error);
      return error;
    }

    return null; // Success
  } catch (err: any) {
    console.error("Error applying address to cart:", err);
    return err.message || "An unexpected error occurred";
  }
}
