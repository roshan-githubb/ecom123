import { useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useInventoryStore } from '@/store/useInventoryStore';

/**
 * Hook to sync inventory adjustments with cart state on component mount
 * This ensures inventory displays are consistent when navigating between pages
 */
export const useInventorySync = () => {
  const { items } = useCartStore();
  const { syncWithCart } = useInventoryStore();

  useEffect(() => {
    // Sync inventory adjustments with current cart contents
    const cartItems = items.map(item => ({
      variantId: item.variantId || '',
      quantity: item.quantity
    })).filter(item => item.variantId); // Filter out items without variantId
    
    syncWithCart(cartItems);
  }, [items, syncWithCart]);
};