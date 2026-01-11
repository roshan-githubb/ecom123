/**
 * Z-index constants for consistent layering
 * Use these constants instead of hardcoded z-index values
 */

export const Z_INDEX = {
  // Base layers
  BASE: 0,
  DROPDOWN: 10,
  STICKY: 20,
  
  // Navigation
  NAVBAR: 50,
  MOBILE_MENU: 51,
  
  // Overlays and modals
  MODAL_BACKDROP: 50,
  MODAL_CONTENT: 51,
  TOOLTIP: 60,
  TOAST: 70,
  
  // Special cases
  LOADING_OVERLAY: 80,
  DEBUG_PANEL: 90,
  
  // Maximum (use sparingly)
  MAXIMUM: 9999,
} as const

/**
 * Get z-index value by name
 */
export function getZIndex(layer: keyof typeof Z_INDEX): number {
  return Z_INDEX[layer]
}

/**
 * Tailwind z-index class mapping
 */
export const Z_INDEX_CLASSES = {
  BASE: 'z-0',
  DROPDOWN: 'z-10',
  STICKY: 'z-20',
  NAVBAR: 'z-50',
  MOBILE_MENU: 'z-[51]',
  MODAL_BACKDROP: 'z-50',
  MODAL_CONTENT: 'z-[51]',
  TOOLTIP: 'z-[60]',
  TOAST: 'z-[70]',
  LOADING_OVERLAY: 'z-[80]',
  DEBUG_PANEL: 'z-[90]',
  MAXIMUM: 'z-[9999]',
} as const

/**
 * Get Tailwind z-index class by name
 */
export function getZIndexClass(layer: keyof typeof Z_INDEX_CLASSES): string {
  return Z_INDEX_CLASSES[layer]
}