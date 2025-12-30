import { renderHook, act } from '@testing-library/react';
import { useInventoryStore } from '../useInventoryStore';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { beforeEach } from 'node:test';
import { describe } from 'node:test';

describe('useInventoryStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useInventoryStore.getState().resetAdjustments();
  });

  it('should decrease inventory correctly', () => {
    const { result } = renderHook(() => useInventoryStore());
    
    act(() => {
      result.current.decreaseInventory('variant-1', 2);
    });
    
    expect(result.current.getAdjustedInventory('variant-1', 10)).toBe(8);
  });

  it('should increase inventory correctly', () => {
    const { result } = renderHook(() => useInventoryStore());
    
    // First decrease, then increase
    act(() => {
      result.current.decreaseInventory('variant-1', 3);
      result.current.increaseInventory('variant-1', 1);
    });
    
    expect(result.current.getAdjustedInventory('variant-1', 10)).toBe(8);
  });

  it('should not allow negative inventory', () => {
    const { result } = renderHook(() => useInventoryStore());
    
    act(() => {
      result.current.decreaseInventory('variant-1', 15);
    });
    
    expect(result.current.getAdjustedInventory('variant-1', 10)).toBe(0);
  });

  it('should sync with cart correctly', () => {
    const { result } = renderHook(() => useInventoryStore());
    
    const cartItems = [
      { variantId: 'variant-1', quantity: 2 },
      { variantId: 'variant-2', quantity: 1 },
      { variantId: 'variant-1', quantity: 1 }, // Same variant, should sum up
    ];
    
    act(() => {
      result.current.syncWithCart(cartItems);
    });
    
    expect(result.current.getAdjustedInventory('variant-1', 10)).toBe(7); // 10 - 3
    expect(result.current.getAdjustedInventory('variant-2', 5)).toBe(4);   // 5 - 1
  });

  it('should reset adjustments', () => {
    const { result } = renderHook(() => useInventoryStore());
    
    act(() => {
      result.current.decreaseInventory('variant-1', 2);
      result.current.resetAdjustments();
    });
    
    expect(result.current.getAdjustedInventory('variant-1', 10)).toBe(10);
  });

  it('should force refresh', () => {
    const { result } = renderHook(() => useInventoryStore());
    
    act(() => {
      result.current.decreaseInventory('variant-1', 2);
      result.current.forceRefresh();
    });
    
    // Should still have the adjustment after force refresh
    expect(result.current.getAdjustedInventory('variant-1', 10)).toBe(8);
  });
});