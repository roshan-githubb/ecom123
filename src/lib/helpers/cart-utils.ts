import { Cart } from "@/types/cart"
 
export function getCartItemCount(cart: Cart | null): number {
  if (!cart || !cart.items || cart.items.length === 0) {
    return 0
  }

  return cart.items.reduce((total, item) => {
    return total + (item.quantity || 0)
  }, 0)
}

export function shouldHideStickyBar(pathname: string): boolean {
  if (!pathname) {
    return false
  }

  const normalizedPath = pathname.toLowerCase()

  if (normalizedPath.includes("/cart")) {
    return true
  }

  if (normalizedPath.includes("/checkout")) {
    return true
  }

  if (normalizedPath.includes("/payment")) {
    return true
  }

  return false
}
