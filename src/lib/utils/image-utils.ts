/**
 * Image optimization utilities for Next.js Image component
 */

export interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
}

/**
 * Generate appropriate sizes prop based on image usage context
 */
export function generateSizes(context: 'card' | 'banner' | 'icon' | 'thumbnail' | 'hero' | 'modal'): string {
  switch (context) {
    case 'card':
      return '(min-width: 1024px) 180px, (min-width: 768px) 25vw, 45vw'
    case 'banner':
      return '100vw'
    case 'icon':
      return '(min-width: 768px) 80px, 60px'
    case 'thumbnail':
      return '(min-width: 768px) 196px, 45vw'
    case 'hero':
      return '(min-width: 1024px) 50vw, 100vw'
    case 'modal':
      return '(min-width: 768px) 296px, 250px'
    default:
      return '100vw'
  }
}

/**
 * Get optimized image props with proper dimensions and sizes
 */
export function getOptimizedImageProps(
  src: string,
  alt: string,
  context: 'card' | 'banner' | 'icon' | 'thumbnail' | 'hero' | 'modal',
  customWidth?: number,
  customHeight?: number,
  isPriority?: boolean
): OptimizedImageProps {
  const sizes = generateSizes(context)
  
  // Default dimensions based on context
  const defaultDimensions = {
    card: { width: 300, height: 300 },
    banner: { width: 800, height: 400 },
    icon: { width: 80, height: 80 },
    thumbnail: { width: 196, height: 300 },
    hero: { width: 1200, height: 600 },
    modal: { width: 296, height: 320 }
  }
  
  const { width, height } = defaultDimensions[context]
  
  return {
    src,
    alt,
    width: customWidth || width,
    height: customHeight || height,
    sizes,
    priority: isPriority || context === 'banner' || context === 'hero'
  }
}

/**
 * Fallback image URL for broken or missing images
 */
export const FALLBACK_IMAGE = '/images/not-available/not-available.png'

/**
 * Get image URL with fallback
 */
export function getImageWithFallback(imageUrl?: string | null): string {
  return imageUrl || FALLBACK_IMAGE
}

/**
 * Check if image should have priority loading
 * Priority should be given to above-the-fold images
 */
export function shouldHavePriority(context: string, index?: number): boolean {
  // First banner image should have priority
  if (context === 'banner' && (index === undefined || index === 0)) {
    return true
  }
  
  // Hero images should have priority
  if (context === 'hero') {
    return true
  }
  
  // First few product cards in viewport should have priority
  if (context === 'card' && index !== undefined && index < 4) {
    return true
  }
  
  return false
}