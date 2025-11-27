"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  addToServerCart,
  updateCartItemQuantity,
  removeFromCart,
  getCart
} from "@/services/cart";

// -------------------------
// Interfaces
// -------------------------
export interface CartItem {
  id: string;            // line_item_id
  title: string;
  price: number;
  image: string;
  quantity: number;

  variantId?: string;
  productId?: string;
}

export interface CartSummary {
  cartId: string;
  subtotal: number;
  taxTotal: number;
  deliveryFee: number;
  serviceFee: number;
  totalPayable: number;
  currency: string;
}

interface CartState extends CartSummary {
  items: CartItem[];

  fetchCart: () => Promise<void>;
  add: (variantId: string, quantity?: number) => Promise<void>;
  increase: (lineItemId: string, currentQty: number) => Promise<void>;
  decrease: (lineItemId: string, currentQty: number) => Promise<void>;
  remove: (lineItemId: string) => Promise<void>;

  clearLocal: () => void;
}

// -------------------------
// Mapper
// -------------------------
function mapCart(cart: any): { items: CartItem[] } & CartSummary {
  return {
    cartId: cart.id,
    currency: (cart.currency_code ?? "NPR").toUpperCase(),

    subtotal: cart.subtotal ?? cart.item_total ?? 0,
    deliveryFee: cart.shipping_total ?? 0,
    serviceFee: 0,
    taxTotal: cart.tax_total ?? 0,
    totalPayable: cart.total ?? 0,

    items: cart.items?.map((item: any) => ({
      id: item.id,
      title: item.title,
      price: item.unit_price,
      image:
        item.thumbnail ??
        item.product?.thumbnail ??
        "/images/not-available/not-available.png",
      quantity: item.quantity,
      variantId: item.variant_id,
      productId: item.product_id,
      variantTitle: item.variant?.title || item.variant_title || "",
      totalPrice: item.quantity * item.unit_price,


    })) ?? []
  };
}


export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      cartId: "",
      subtotal: 0,
      taxTotal: 0,
      deliveryFee: 0,
      serviceFee: 0,
      totalPayable: 0,
      currency: "NPR",

      fetchCart: async () => {
        const data = await getCart();
        if (data?.cart) set(mapCart(data.cart));
      },

      add: async (variantId, quantity = 1) => {
        const data = await addToServerCart(variantId, quantity);
        if (data?.cart) set(mapCart(data.cart));
      },

      increase: async (lineItemId, currentQty) => {
        const data = await updateCartItemQuantity(lineItemId, currentQty + 1);
        if (data?.cart) set(mapCart(data.cart));
      },

      decrease: async (lineItemId, currentQty) => {
        if (currentQty <= 1) {
          const data = await removeFromCart(lineItemId);
          if (data?.cart) set(mapCart(data.cart));
          return;
        }

        const data = await updateCartItemQuantity(lineItemId, currentQty - 1);
        if (data?.cart) set(mapCart(data.cart));
      },

      
      remove: async (lineItemId) => {
        const data = await removeFromCart(lineItemId);
        if (data?.cart) set(mapCart(data.cart));
      },

      
      clearLocal: () =>
        set({
          items: [],
          subtotal: 0,
          taxTotal: 0,
          deliveryFee: 0,
          serviceFee: 0,
          totalPayable: 0
        })
    }),
    { name: "global-cart" }
  )
);
