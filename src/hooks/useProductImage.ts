/**
 * Hook for handling product image with fallbacks
 * Returns the product image or a nice placeholder
 */
export const useProductImage = (imageUrl?: string | null) => {
  // If image URL is provided and valid, use it
  if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim()) {
    return imageUrl
  }

  // Otherwise return placeholder
  return '/images/product-placeholder-modern.svg'
}

/**
 * Get fallback image based on context
 */
export const getProductImageFallback = (
  imageUrl?: string | null,
  type: 'product' | 'category' | 'banner' = 'product'
): string => {
  // If image exists, use it
  if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim()) {
    return imageUrl
  }

  // Return appropriate fallback based on type
  const fallbacks: Record<string, string> = {
    product: '/images/product-placeholder-modern.svg',
    category: '/product-placeholder.png',
    banner: '/images/placeholder.svg',
  }

  return fallbacks[type] || fallbacks.product
}
