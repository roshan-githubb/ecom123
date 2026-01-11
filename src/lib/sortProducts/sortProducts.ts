import type { HttpTypes } from "@medusajs/types"

/**
 * Sorts products so that:
 * - Products with inventory > 0 come first
 * - Products with inventory === 0 come last
 */
export function sortProductsByInventory(
  products: HttpTypes.StoreProduct[]
): HttpTypes.StoreProduct[] {
  return [...products].sort((a, b) => {
    const aTotalInventory = calculateProductInventory(a)
    const bTotalInventory = calculateProductInventory(b)

    // both have stock → keep order
    if (aTotalInventory > 0 && bTotalInventory > 0) return 0

    // both out of stock → keep order
    if (aTotalInventory === 0 && bTotalInventory === 0) return 0

    // out-of-stock goes last
    return aTotalInventory === 0 ? 1 : -1
  })
}

/**
 * Calculate total inventory for a product, handling both data structures:
 * 1. Simple: variant.inventory_quantity
 * 2. Complex: variant.inventory_items[0].inventory.location_levels
 */
function calculateProductInventory(product: HttpTypes.StoreProduct): number {
  return product.variants?.reduce((sum, variant) => {
    // Try direct inventory_quantity first (regular products)
    if (variant.inventory_quantity !== undefined) {
      return sum + (variant.inventory_quantity || 0)
    }
    
    // Try nested inventory structure (top products API)
    const inventoryItem = (variant as any).inventory_items?.[0]
    if (inventoryItem?.inventory?.location_levels) {
      const totalFromLocations = inventoryItem.inventory.location_levels.reduce(
        (locationSum: number, locationLevel: any) => {
          return locationSum + (locationLevel.available_quantity || 0)
        },
        0
      )
      return sum + totalFromLocations
    }
    
    return sum
  }, 0) || 0
}
