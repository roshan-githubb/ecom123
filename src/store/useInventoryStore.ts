import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface InventoryState {
  // Track inventory adjustments by variant ID
  inventoryAdjustments: Record<string, number>;
  
  // Decrease inventory when item is added to cart
  decreaseInventory: (variantId: string, quantity: number) => void;
  
  // Increase inventory when item is removed from cart
  increaseInventory: (variantId: string, quantity: number) => void;
  
  // Get adjusted inventory for a variant
  getAdjustedInventory: (variantId: string, originalInventory: number) => number;
  
  // Reset adjustments (useful when page refreshes or cart is synced)
  resetAdjustments: () => void;
  
  // Sync inventory adjustments with current cart state
  syncWithCart: (cartItems: Array<{ variantId: string; quantity: number }>) => void;
  
  // Force refresh inventory from cart (useful for navigation)
  forceRefresh: () => void;
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      inventoryAdjustments: {},
      
      decreaseInventory: (variantId: string, quantity: number) => {
        set((state) => ({
          inventoryAdjustments: {
            ...state.inventoryAdjustments,
            [variantId]: (state.inventoryAdjustments[variantId] || 0) + quantity
          }
        }));
      },
      
      increaseInventory: (variantId: string, quantity: number) => {
        set((state) => ({
          inventoryAdjustments: {
            ...state.inventoryAdjustments,
            [variantId]: Math.max(0, (state.inventoryAdjustments[variantId] || 0) - quantity)
          }
        }));
      },
      
      getAdjustedInventory: (variantId: string, originalInventory: number) => {
        const adjustment = get().inventoryAdjustments[variantId] || 0;
        return Math.max(0, originalInventory - adjustment);
      },
      
      resetAdjustments: () => {
        set({ inventoryAdjustments: {} });
      },
      
      syncWithCart: (cartItems: Array<{ variantId: string; quantity: number }>) => {
        // Calculate total quantities per variant from cart
        const cartQuantities: Record<string, number> = {};
        cartItems.forEach(item => {
          cartQuantities[item.variantId] = (cartQuantities[item.variantId] || 0) + item.quantity;
        });
        
        // Set inventory adjustments to match cart quantities
        set({ inventoryAdjustments: cartQuantities });
      },
      
      forceRefresh: () => {
        // Trigger a re-render by updating the store
        set((state) => ({ ...state }));
      }
    }),
    { 
      name: "inventory-adjustments",
      // Optional: Add version for future migrations
      version: 1
    }
  )
);