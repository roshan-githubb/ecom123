"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  addToServerCart,
  updateCartItemQuantity,
  removeFromCart,
  getCart
} from "@/services/cart";

// Import inventory store to sync inventory changes
import { useInventoryStore } from "./useInventoryStore";

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
export interface Promotion {
   code: string;
   id: string;
   value: number;
   type: string;
   isAutomatic: boolean;
}

export interface CartSummary {
  cartId: string;
  subtotal: number;
  taxTotal: number;
  deliveryFee: number;
  serviceFee: number;
  totalPayable: number;
  currency: string;
  discountTotal: number;
  promotions: Promotion[];
}

interface CartState extends CartSummary {
  items: CartItem[];

  fetchCart: () => Promise<void>;
  add: (variantId: string, quantity?: number) => Promise<void>;
  increase: (lineItemId: string, currentQty: number) => Promise<void>;
  decrease: (lineItemId: string, currentQty: number) => Promise<void>;
  // remove: (lineItemId: string) => Promise<void>;

  clearLocal: () => void;
}

// -------------------------
// Mapper
// -------------------------
function mapCart(cart: any): { items: CartItem[] } & CartSummary {
   const discountTotal =
    cart.discount_total ??
    Math.max((cart.subtotal ?? 0) - (cart.total ?? 0), 0);
    // console.log('map cart function cart object ', cart)

  return {
    cartId: cart.id,
    currency: (cart.currency_code ?? "NPR").toUpperCase(),

    subtotal: cart.subtotal ?? cart.item_total ?? 0,
    deliveryFee: cart.shipping_total ?? 0,
    serviceFee: 0,
    taxTotal: cart.tax_total ?? 0,
    totalPayable: cart.total ?? 0,
    discountTotal,
    promotions:
      cart.promotions?.map((p: any) => ({
        code: p.code || '',
        id: p.id,
        type: p.application_method?.type || '',
        value: p.application_method?.value || 0,
        isAutomatic: p.is_automatic || false
      })) ?? [],

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
      promotions: [],
      cartId: "",
      subtotal: 0,
      taxTotal: 0,
      deliveryFee: 0,
      serviceFee: 0,
      totalPayable: 0,
      discountTotal: 0,
      currency: "NPR",

      fetchCart: async () => {
        const data = await getCart();
        console.log('unmapped cart from db ', data)
        if (data?.cart) {
          const mappedCart = mapCart(data.cart);
          set(mappedCart);
          
          // Sync inventory store with current cart contents
          const cartItems = mappedCart.items.map(item => ({
            variantId: item.variantId || '',
            quantity: item.quantity
          })).filter(item => item.variantId); // Filter out items without variantId
          
          useInventoryStore.getState().syncWithCart(cartItems);
        }
      },

      add: async (variantId, quantity = 1) => {
        const data = await addToServerCart(variantId, quantity);
        if (data?.cart) {
          set(mapCart(data.cart));
          // Update inventory store
          useInventoryStore.getState().decreaseInventory(variantId, quantity);
        }
      },

      increase: async (lineItemId, currentQty) => {
        const data = await updateCartItemQuantity(lineItemId, currentQty + 1);
        if (data?.cart) {
          set(mapCart(data.cart));
          // Find the variant ID for this line item and decrease inventory
          const item = data.cart.items?.find((item: any) => item.id === lineItemId);
          if (item?.variant_id) {
            useInventoryStore.getState().decreaseInventory(item.variant_id, 1);
          }
        }
      },

      decrease: async (lineItemId, currentQuantity) => {
        if (currentQuantity <= 1) {
          // Remove item
          const data = await removeFromCart(lineItemId);
          console.log('remove item response ', data)
          if (data?.deleted == true) {
            const cartData = await getCart();
            if (cartData?.cart) {
              set(mapCart(cartData.cart));
              // Find the variant ID and increase inventory back
              const currentItems = get().items;
              const item = currentItems.find(i => i.id === lineItemId);
              if (item?.variantId) {
                useInventoryStore.getState().increaseInventory(item.variantId, 1);
              }
            }
          } else {
            // If API returns nothing, manually remove from state
            const currentItems = get().items;
            const item = currentItems.find(i => i.id === lineItemId);
            if (item?.variantId) {
              useInventoryStore.getState().increaseInventory(item.variantId, 1);
            }
            set({ items: currentItems.filter(i => i.id !== lineItemId) });
          }
          return;
        }

        // Decrement quantity
        const data = await updateCartItemQuantity(lineItemId, currentQuantity - 1);
        console.log('decrement item ', data)
        if (data?.cart) {
          set(mapCart(data.cart));
          // Find the variant ID for this line item and increase inventory
          const item = data.cart.items?.find((item: any) => item.id === lineItemId);
          if (item?.variant_id) {
            useInventoryStore.getState().increaseInventory(item.variant_id, 1);
          }
        }
      },

      //      // Decrement quantity
      // const data = await updateCartItemQuantity(lineItemId, currentQuantity - 1);
      // if (data?.cart?.items) {
      //   set({ items: data.cart.items });
      // }


      // remove: async (lineItemId) => {
      //   const data = await removeFromCart(lineItemId);
      //   if (data?.cart) set(mapCart(data.cart));
      // },


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
