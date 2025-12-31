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
    const aTotalInventory =
      a.variants?.reduce(
        (sum, variant) => sum + (variant.inventory_quantity ?? 0),
        0
      ) ?? 0

    const bTotalInventory =
      b.variants?.reduce(
        (sum, variant) => sum + (variant.inventory_quantity ?? 0),
        0
      ) ?? 0

    // both have stock → keep order
    if (aTotalInventory > 0 && bTotalInventory > 0) return 0

    // both out of stock → keep order
    if (aTotalInventory === 0 && bTotalInventory === 0) return 0

    // out-of-stock goes last
    return aTotalInventory === 0 ? 1 : -1
  })
}
