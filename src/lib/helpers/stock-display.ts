/**
 * Utility functions for displaying stock information consistently across product cards
 */

const LOW_STOCK_THRESHOLD = 10;

export interface StockDisplayInfo {
  message: string;
  showWarning: boolean;
  textColor: string;
}

/**
 * Generate stock display information based on inventory quantity
 * @param totalInventory - Total inventory across all variants
 * @returns Stock display information object
 */
export function getStockDisplayInfo(totalInventory: number): StockDisplayInfo {
  if (totalInventory <= 0) {
    return {
      message: "Out of stock",
      showWarning: true,
      textColor: "#FF0000"
    };
  }
  
  if (totalInventory <= LOW_STOCK_THRESHOLD) {
    return {
      message: `Only ${totalInventory} left in stock — order soon`,
      showWarning: true,
      textColor: "#FF0000"
    };
  }
  
  // Don't show stock message for items with sufficient inventory
  return {
    message: "",
    showWarning: false,
    textColor: "#777777"
  };
}

/**
 * Check if stock warning should be displayed
 * @param totalInventory - Total inventory across all variants
 * @returns Boolean indicating if warning should be shown
 */
export function shouldShowStockWarning(totalInventory: number): boolean {
  return totalInventory <= LOW_STOCK_THRESHOLD;
}