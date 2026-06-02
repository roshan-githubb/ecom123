/**
 * Utility function to get product image URL with fallback
 * Handles various image formats and provides nice placeholders
 */

export type ImageType = 'product' | 'category' | 'banner' | 'seller'

interface GetImageUrlOptions {
  type?: ImageType
  fallbackColor?: string
}

const PLACEHOLDERS: Record<ImageType, string> = {
  product: '/images/product-placeholder-modern.svg',
  category: '/images/product-placeholder-modern.svg',
  banner: '/images/product-placeholder-modern.svg',
  seller: '/images/product-placeholder-modern.svg',
}

/**
 * Get product image URL with intelligent fallback
 * @param imageUrl - The original image URL
 * @param options - Configuration options
 * @returns Safe image URL or placeholder
 */
export const getProductImageUrl = (
  imageUrl?: string | null,
  options: GetImageUrlOptions = {}
): string => {
  const { type = 'product' } = options

  // Check if image URL is valid
  if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim().length > 0) {
    // Decode if necessary
    try {
      return decodeURIComponent(imageUrl)
    } catch {
      // If decoding fails, still return the original URL
      return imageUrl
    }
  }

  // Return appropriate placeholder
  return PLACEHOLDERS[type]
}

/**
 * Check if an image URL is valid and not a placeholder
 */
export const isValidImageUrl = (imageUrl?: string | null): boolean => {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return false
  }

  const trimmed = imageUrl.trim()
  if (trimmed.length === 0) {
    return false
  }

  // Check if it's one of our placeholders
  const isPlaceholder = Object.values(PLACEHOLDERS).includes(trimmed)
  return !isPlaceholder
}

/**
 * Get the best image from multiple options
 */
export const getBestImageUrl = (
  imageUrls?: (string | null | undefined)[],
  options: GetImageUrlOptions = {}
): string => {
  if (!imageUrls) {
    return PLACEHOLDERS[options.type || 'product']
  }

  for (const url of imageUrls) {
    if (isValidImageUrl(url)) {
      return getProductImageUrl(url, options)
    }
  }

  return PLACEHOLDERS[options.type || 'product']
}
