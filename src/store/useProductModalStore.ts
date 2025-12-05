"use client";

import { create } from "zustand";
import { HttpTypes } from "@medusajs/types";

interface ProductModalState {
    isOpen: boolean;
    productId: string | null;
    product: HttpTypes.StoreProduct | null;
    locale: string;

    openModal: (productId: string, product: HttpTypes.StoreProduct, locale: string) => void;
    closeModal: () => void;
    setProduct: (product: HttpTypes.StoreProduct) => void;
}

export const useProductModalStore = create<ProductModalState>((set) => ({
    isOpen: false,
    productId: null,
    product: null,
    locale: "us",

    openModal: (productId, product, locale) =>
        set({
            isOpen: true,
            productId,
            product,
            locale,
        }),

    closeModal: () =>
        set({
            isOpen: false,
            productId: null,
            product: null,
        }),

    setProduct: (product) =>
        set({
            product,
        }),
}));
