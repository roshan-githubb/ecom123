"use client"
import { useCartStore } from "@/store/useCartStore";

export default function Page() {
  return (
    <button
      onClick={() => {
        useCartStore.getState().clearCart(); // clears the store
        localStorage.removeItem("cart-store"); // clears persisted data
      }}
      className="bg-red-500 text-white p-2 rounded"
    >
      Clear Cart
    </button>
  );
};