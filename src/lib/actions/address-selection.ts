// src/lib/actions/address-selection.ts
"use client";

import { setAddresses } from "@/lib/data/cart"; // Import your Server Action
import { Address } from "@/store/addressStore"; // Import your local Address type

/**
 * Converts a local Address object to the FormData required by the setAddresses Server Action
 * and executes the action.
 * @param address The local Address object selected by the user.
 * @returns The error message string on failure, or null on success.
 */
export async function applySelectedAddressToCart(address: Address) {
  const formData = new FormData();
  
  // --- 1. Name Splitting ---
  const nameParts = address.name.trim().split(/\s+/);
  const first_name = nameParts[0] || '';
  const last_name = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '.'; 
  
  // --- 2. FormData Mapping (Must match cart.ts/setAddresses expectations) ---
  
  // Customer Email
  formData.set("email", address.email);

  // Shipping Address Fields
  formData.set("shipping_address.first_name", first_name);
  formData.set("shipping_address.last_name", last_name);
  formData.set("shipping_address.company", ""); // Required field, set to empty string if not available
  formData.set("shipping_address.address_1", address.line1);
  formData.set("shipping_address.address_2", address.line2 || "");
  formData.set("shipping_address.city", address.district);
  formData.set("shipping_address.province", address.province);
  formData.set("shipping_address.postal_code", address.postalCode);
  formData.set("shipping_address.country_code", address.countryCode);
  formData.set("shipping_address.phone", address.phone);
  
  // Crucial: Set billing address equal to shipping address (based on your cart.ts logic)
  // Your setAddresses in cart.ts does: data.billing_address = data.shipping_address
  // We don't need to explicitly set billing fields on FormData, but we ensure email/shipping is set.

  // --- 3. Execute Server Action ---
  const result = await setAddresses(null, formData);

  if (result) {
    // Server Action returns the error message on failure
    console.error("Server Action failed to set address:", result);
    return result as string; 
  }

  return null; // Success
}