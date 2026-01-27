/**
 * Comprehensive color mapping utility for product color options
 * Handles various color names and provides fallbacks for unknown colors
 */

// Extended color mapping with more variations
const COLOR_MAP: Record<string, string> = {
  // Basic colors
  'white': 'bg-white',
  'black': 'bg-black',
  'red': 'bg-red-500',
  'green': 'bg-green-500',
  'blue': 'bg-blue-500',
  'yellow': 'bg-yellow-400',
  'orange': 'bg-orange-500',
  'purple': 'bg-purple-500',
  'pink': 'bg-pink-500',
  'brown': 'bg-amber-700',
  'gray': 'bg-gray-500',
  'grey': 'bg-gray-500',
  
  // Extended basic colors
  'navy': 'bg-blue-900',
  'maroon': 'bg-red-900',
  'olive': 'bg-yellow-700',
  'silver': 'bg-gray-300',
  'gold': 'bg-yellow-500',
  'beige': 'bg-amber-100',
  'cream': 'bg-yellow-50',
  'ivory': 'bg-yellow-50',
  'khaki': 'bg-yellow-600',
  
  // Tailwind extended colors
  'indigo': 'bg-indigo-500',
  'teal': 'bg-teal-500',
  'cyan': 'bg-cyan-500',
  'lime': 'bg-lime-500',
  'emerald': 'bg-emerald-500',
  'sky': 'bg-sky-500',
  'violet': 'bg-violet-500',
  'fuchsia': 'bg-fuchsia-500',
  'rose': 'bg-rose-500',
  'amber': 'bg-amber-500',
  'slate': 'bg-slate-500',
  'zinc': 'bg-zinc-500',
  'neutral': 'bg-neutral-500',
  'stone': 'bg-stone-500',
  
  // Color variations with descriptors
  'light blue': 'bg-blue-300',
  'dark blue': 'bg-blue-800',
  'light green': 'bg-green-300',
  'dark green': 'bg-green-800',
  'light red': 'bg-red-300',
  'dark red': 'bg-red-800',
  'light pink': 'bg-pink-300',
  'dark pink': 'bg-pink-700',
  'light purple': 'bg-purple-300',
  'dark purple': 'bg-purple-800',
  'light gray': 'bg-gray-300',
  'light grey': 'bg-gray-300',
  'dark gray': 'bg-gray-700',
  'dark grey': 'bg-gray-700',
  'bright red': 'bg-red-600',
  'bright blue': 'bg-blue-600',
  'bright green': 'bg-green-600',
  'bright yellow': 'bg-yellow-500',
  'bright orange': 'bg-orange-600',
  'bright pink': 'bg-pink-600',
  
  // Sea and nature colors
  'sea green': 'bg-teal-600',
  'sea blue': 'bg-cyan-600',
  'ocean blue': 'bg-blue-600',
  'forest green': 'bg-green-700',
  'mint green': 'bg-green-300',
  'mint': 'bg-green-300',
  'sage green': 'bg-green-400',
  'sage': 'bg-green-400',
  'coral': 'bg-orange-400',
  'salmon': 'bg-orange-300',
  'turquoise': 'bg-cyan-400',
  'aqua': 'bg-cyan-400',
  'lavender': 'bg-purple-300',
  
  // Metallic colors
  'bronze': 'bg-amber-600',
  'copper': 'bg-orange-600',
  'platinum': 'bg-gray-400',
  'rose gold': 'bg-pink-400',
  'champagne': 'bg-yellow-200',
  
  // Fashion colors
  'burgundy': 'bg-red-800',
  'wine': 'bg-red-900',
  'mustard': 'bg-yellow-600',
  'rust': 'bg-orange-700',
  'charcoal': 'bg-gray-800',
  'midnight': 'bg-gray-900',
  'pearl': 'bg-gray-100',
  'sand': 'bg-yellow-200',
  'camel': 'bg-yellow-600',
  'tan': 'bg-yellow-700',
  'taupe': 'bg-gray-400',
  'mauve': 'bg-purple-400',
  'plum': 'bg-purple-600',
  'magenta': 'bg-fuchsia-500',
  
  // Multi-word variations
  'off white': 'bg-gray-50',
  'off-white': 'bg-gray-50',
  'jet black': 'bg-black',
  'pure white': 'bg-white',
  'snow white': 'bg-white',
  'deep blue': 'bg-blue-900',
  'royal blue': 'bg-blue-700',
  'electric blue': 'bg-blue-500',
  'powder blue': 'bg-blue-200',
  'baby blue': 'bg-blue-200',
  'sky blue': 'bg-sky-400',
  'steel blue': 'bg-blue-600',
  'cobalt blue': 'bg-blue-700',
}

/**
 * Maps a color name to a Tailwind CSS background class
 */
export function getColorClass(colorName: string): string {
  const normalizedColor = colorName.toLowerCase().trim()
  
  // Direct match
  if (COLOR_MAP[normalizedColor]) {
    return COLOR_MAP[normalizedColor]
  }
  
  // Try to find partial matches for compound colors
  for (const [key, value] of Object.entries(COLOR_MAP)) {
    if (normalizedColor.includes(key) || key.includes(normalizedColor)) {
      return value
    }
  }

  return generateColorFromName(colorName)
}

/**
 * Generates a consistent color class based on the color name hash
 * This ensures unknown colors get a consistent, visually distinct color
 */
function generateColorFromName(colorName: string): string {
  // Simple hash function to generate consistent colors
  let hash = 0
  for (let i = 0; i < colorName.length; i++) {
    const char = colorName.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash 
  }
  
  // Use the hash to select from a palette of distinct colors
  const colorPalette = [
    'bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400',
    'bg-pink-400', 'bg-indigo-400', 'bg-teal-400', 'bg-orange-400', 'bg-cyan-400',
    'bg-lime-400', 'bg-emerald-400', 'bg-violet-400', 'bg-fuchsia-400', 'bg-rose-400',
    'bg-amber-400', 'bg-sky-400', 'bg-red-600', 'bg-blue-600', 'bg-green-600',
    'bg-purple-600', 'bg-pink-600', 'bg-indigo-600', 'bg-teal-600', 'bg-orange-600'
  ]
  
  const index = Math.abs(hash) % colorPalette.length
  return colorPalette[index]
}

/**
 * Gets border color class for selected state
 */
export function getColorBorderClass(colorName: string): string {
  // For light colors, use a darker border
  const lightColors = ['white', 'cream', 'ivory', 'beige', 'pearl', 'off white', 'snow white', 'light gray', 'light grey']
  const normalizedColor = colorName.toLowerCase().trim()
  
  if (lightColors.some(light => normalizedColor.includes(light))) {
    return 'border-gray-400'
  }
  
  return 'border-blue-800'
}

/**
 * Enhanced color option interface
 */
export interface ColorOption {
  id: string
  label: string
  bg: string
  border: string
  textColor?: string
}

/**
 * Creates color options with enhanced styling
 */
export function createColorOptions(colorValues: any[]): ColorOption[] {
  return colorValues?.map((v: any) => ({
    id: v.id,
    label: v.value,
    bg: getColorClass(v.value),
    border: getColorBorderClass(v.value),
    textColor: getTextColorForBackground(v.value)
  })) || []
}

/**
 * Determines appropriate text color for a given background color
 */
function getTextColorForBackground(colorName: string): string {
  const lightColors = ['white', 'cream', 'ivory', 'beige', 'pearl', 'off white', 'snow white', 'light gray', 'light grey', 'yellow', 'lime', 'cyan']
  const normalizedColor = colorName.toLowerCase().trim()
  
  if (lightColors.some(light => normalizedColor.includes(light))) {
    return 'text-gray-800'
  }
  
  return 'text-white'
}