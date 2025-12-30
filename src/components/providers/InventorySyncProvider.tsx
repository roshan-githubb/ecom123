"use client"

import { useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useInventoryStore } from '@/store/useInventoryStore';

/**
 * Global inventory sync provider that ensures inventory is always in sync
 * This should be placed in the root layout to handle global sync events
 */
export const InventorySyncProvider = ({ children }: { children: React.ReactNode }) => {
  const { fetchCart } = useCartStore();
  const { forceRefresh } = useInventoryStore();

  useEffect(() => {
    // Handle browser back/forward navigation
    const handlePopState = async () => {
      console.log('Navigation detected, syncing inventory...');
      await fetchCart();
      forceRefresh();
    };

    // Handle page focus (when returning to tab)
    const handleFocus = async () => {
      console.log('Page focus detected, syncing inventory...');
      await fetchCart();
      forceRefresh();
    };

    // Handle page visibility change
    const handleVisibilityChange = async () => {
      if (!document.hidden) {
        console.log('Page visible, syncing inventory...');
        await fetchCart();
        forceRefresh();
      }
    };

    // Add event listeners
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial sync
    fetchCart();

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchCart, forceRefresh]);

  return <>{children}</>;
};