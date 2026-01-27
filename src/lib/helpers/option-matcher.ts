/**
 * Flexible option matching utility for product variants
 * Handles various naming conventions used by different vendors
 */

// Common patterns for color options
const COLOR_PATTERNS = [
  'color',
  'colour',
  'colors',
  'colours',
  'col',
  'clr'
]

// Common patterns for size options
const SIZE_PATTERNS = [
  'size',
  'sizes',
  'sz',
  'dimension',
  'dimensions',
  'fit',
  'length',
  'width',
  'measurement'
]

// Common patterns for weight options
const WEIGHT_PATTERNS = [
  'weight',
  'weights',
  'wt',
  'mass',
  'net weight',
  'gross weight',
  'total weight',
  'product weight',
  'item weight',
  'pack weight',
  'package weight',
  'unit weight',
  'per unit',
  'quantity'
]

// Common patterns for material/fabric options
const MATERIAL_PATTERNS = [
  'material',
  'materials',
  'fabric',
  'fabrics',
  'cloth',
  'textile',
  'composition',
  'blend',
  'fiber',
  'fibre',
  'cotton',
  'polyester',
  'wool',
  'silk',
  'leather',
  'denim',
  'canvas'
]

// Common patterns for style/design options
const STYLE_PATTERNS = [
  'style',
  'styles',
  'design',
  'designs',
  'pattern',
  'patterns',
  'type',
  'types',
  'model',
  'models',
  'variant',
  'variants',
  'version',
  'versions'
]

// Common patterns for capacity/volume options
const CAPACITY_PATTERNS = [
  'capacity',
  'volume',
  'storage',
  'memory',
  'gb',
  'tb',
  'mb',
  'liters',
  'litres',
  'ml',
  'gallons',
  'cups',
  'ounces'
]

// Common patterns for power/voltage options
const POWER_PATTERNS = [
  'power',
  'wattage',
  'watts',
  'voltage',
  'volts',
  'amperage',
  'amps',
  'battery',
  'mah',
  'kwh',
  'horsepower',
  'hp'
]

// Common patterns for flavor/scent options
const FLAVOR_PATTERNS = [
  'flavor',
  'flavour',
  'flavors',
  'flavours',
  'taste',
  'scent',
  'fragrance',
  'aroma',
  'smell',
  'essence'
]

// Common patterns for age/grade options
const AGE_PATTERNS = [
  'age',
  'ages',
  'grade',
  'grades',
  'level',
  'levels',
  'years',
  'months',
  'adult',
  'child',
  'baby',
  'toddler',
  'teen'
]

// Common patterns for gender options
const GENDER_PATTERNS = [
  'gender',
  'sex',
  'for',
  'mens',
  'womens',
  'male',
  'female',
  'unisex',
  'boys',
  'girls',
  'men',
  'women'
]

// Common patterns for condition options
const CONDITION_PATTERNS = [
  'condition',
  'state',
  'quality',
  'new',
  'used',
  'refurbished',
  'renewed',
  'open box',
  'like new',
  'excellent',
  'good',
  'fair'
]

// Common patterns for compatibility options
const COMPATIBILITY_PATTERNS = [
  'compatibility',
  'compatible',
  'fits',
  'works with',
  'for use with',
  'model compatibility',
  'device',
  'brand compatibility'
]

/**
 * Checks if an option title matches color patterns
 */
export function isColorOption(title: string): boolean {
  const normalizedTitle = title.toLowerCase().trim()
  
  return COLOR_PATTERNS.some(pattern => {

    if (normalizedTitle === pattern) return true
    
    if (normalizedTitle.includes(pattern)) return true
    
    return false
  })
}

/**
 * Checks if an option title matches material/fabric patterns
 */
export function isMaterialOption(title: string): boolean {
  const normalizedTitle = title.toLowerCase().trim()
  
  return MATERIAL_PATTERNS.some(pattern => {
    if (normalizedTitle === pattern) return true
    if (normalizedTitle.includes(pattern)) return true
    return false
  })
}

/**
 * Checks if an option title matches style/design patterns
 */
export function isStyleOption(title: string): boolean {
  const normalizedTitle = title.toLowerCase().trim()
  
  return STYLE_PATTERNS.some(pattern => {
    if (normalizedTitle === pattern) return true
    if (normalizedTitle.includes(pattern)) return true
    return false
  })
}

/**
 * Checks if an option title matches capacity/volume patterns
 */
export function isCapacityOption(title: string): boolean {
  const normalizedTitle = title.toLowerCase().trim()
  
  return CAPACITY_PATTERNS.some(pattern => {
    if (normalizedTitle === pattern) return true
    if (normalizedTitle.includes(pattern)) return true
    return false
  })
  || /\b(gb|tb|mb|ml|l|liters|litres)\b/i.test(normalizedTitle)
}

/**
 * Checks if an option title matches power/voltage patterns
 */
export function isPowerOption(title: string): boolean {
  const normalizedTitle = title.toLowerCase().trim()
  
  return POWER_PATTERNS.some(pattern => {
    if (normalizedTitle === pattern) return true
    if (normalizedTitle.includes(pattern)) return true
    return false
  })
  || /\b(w|watts|v|volts|mah|kwh|hp)\b/i.test(normalizedTitle)
}

/**
 * Checks if an option title matches flavor/scent patterns
 */
export function isFlavorOption(title: string): boolean {
  const normalizedTitle = title.toLowerCase().trim()
  
  return FLAVOR_PATTERNS.some(pattern => {
    if (normalizedTitle === pattern) return true
    if (normalizedTitle.includes(pattern)) return true
    return false
  })
}

/**
 * Checks if an option title matches age/grade patterns
 */
export function isAgeOption(title: string): boolean {
  const normalizedTitle = title.toLowerCase().trim()
  
  return AGE_PATTERNS.some(pattern => {
    if (normalizedTitle === pattern) return true
    if (normalizedTitle.includes(pattern)) return true
    return false
  })
  || /\b(\d+)\s*(years?|months?|yrs?)\b/i.test(normalizedTitle)
}

/**
 * Checks if an option title matches gender patterns
 */
export function isGenderOption(title: string): boolean {
  const normalizedTitle = title.toLowerCase().trim()
  
  return GENDER_PATTERNS.some(pattern => {
    if (normalizedTitle === pattern) return true
    if (normalizedTitle.includes(pattern)) return true
    return false
  })
}

/**
 * Checks if an option title matches condition patterns
 */
export function isConditionOption(title: string): boolean {
  const normalizedTitle = title.toLowerCase().trim()
  
  return CONDITION_PATTERNS.some(pattern => {
    if (normalizedTitle === pattern) return true
    if (normalizedTitle.includes(pattern)) return true
    return false
  })
}

/**
 * Checks if an option title matches compatibility patterns
 */
export function isCompatibilityOption(title: string): boolean {
  const normalizedTitle = title.toLowerCase().trim()
  
  return COMPATIBILITY_PATTERNS.some(pattern => {
    if (normalizedTitle === pattern) return true
    if (normalizedTitle.includes(pattern)) return true
    return false
  })
}
export function isWeightOption(title: string): boolean {
  const normalizedTitle = title.toLowerCase().trim()
  
  return WEIGHT_PATTERNS.some(pattern => {
    if (normalizedTitle === pattern) return true
    
    if (normalizedTitle.includes(pattern)) return true
    
    return false
  })

  || /weight\s*\([^)]*\)/i.test(normalizedTitle) 
  || /\b(kg|gram|grams|g|lb|lbs|pound|pounds|oz|ounce|ounces|ton|tons|mg|milligram|milligrams)\b/i.test(normalizedTitle) 
}
export function isSizeOption(title: string): boolean {
  const normalizedTitle = title.toLowerCase().trim()
  
  return SIZE_PATTERNS.some(pattern => {
 
    if (normalizedTitle === pattern) return true
    
    if (normalizedTitle.includes(pattern)) return true
    
    return false
  })
  || /size\s*\([^)]*\)/i.test(normalizedTitle) 
  || /\b(uk|us|eu|cm|inch|in)\b/i.test(normalizedTitle)
}

/**
 * Finds the color option from product options using flexible matching
 */
export function findColorOption(options: any[]): any {
  return options?.find(opt => isColorOption(opt.title)) || null
}

/**
 * Finds specific option types from product options using flexible matching
 */
export function findMaterialOption(options: any[]): any {
  return options?.find(opt => isMaterialOption(opt.title)) || null
}

export function findStyleOption(options: any[]): any {
  return options?.find(opt => isStyleOption(opt.title)) || null
}

export function findCapacityOption(options: any[]): any {
  return options?.find(opt => isCapacityOption(opt.title)) || null
}

export function findPowerOption(options: any[]): any {
  return options?.find(opt => isPowerOption(opt.title)) || null
}

export function findFlavorOption(options: any[]): any {
  return options?.find(opt => isFlavorOption(opt.title)) || null
}

export function findAgeOption(options: any[]): any {
  return options?.find(opt => isAgeOption(opt.title)) || null
}

export function findGenderOption(options: any[]): any {
  return options?.find(opt => isGenderOption(opt.title)) || null
}

export function findConditionOption(options: any[]): any {
  return options?.find(opt => isConditionOption(opt.title)) || null
}

export function findCompatibilityOption(options: any[]): any {
  return options?.find(opt => isCompatibilityOption(opt.title)) || null
}
export function findWeightOption(options: any[]): any {
  return options?.find(opt => isWeightOption(opt.title)) || null
}

/**
 * Generic function to extract values for any option type
 */
function extractOptionValues(product: any, optionFinder: (options: any[]) => any): string[] {
  if (!product?.variants || !product?.options) return []
  
  const option = optionFinder(product.options)
  if (!option) return []
  
  const variantValues = product.variants.map((variant: any) => {
    const optionValue = variant?.options?.find((o: any) =>
      option.values?.some((val: any) => val.value === o.value)
    )
    return optionValue?.value
  })
  
  return [...new Set(variantValues)].filter(Boolean) as string[]
}

/**
 * Extract values for all option types
 */
export function extractMaterialValues(product: any): string[] {
  return extractOptionValues(product, findMaterialOption)
}

export function extractStyleValues(product: any): string[] {
  return extractOptionValues(product, findStyleOption)
}

export function extractCapacityValues(product: any): string[] {
  return extractOptionValues(product, findCapacityOption)
}

export function extractPowerValues(product: any): string[] {
  return extractOptionValues(product, findPowerOption)
}

export function extractFlavorValues(product: any): string[] {
  return extractOptionValues(product, findFlavorOption)
}

export function extractAgeValues(product: any): string[] {
  return extractOptionValues(product, findAgeOption)
}

export function extractGenderValues(product: any): string[] {
  return extractOptionValues(product, findGenderOption)
}

export function extractConditionValues(product: any): string[] {
  return extractOptionValues(product, findConditionOption)
}

export function extractCompatibilityValues(product: any): string[] {
  return extractOptionValues(product, findCompatibilityOption)
}
export function extractWeightValues(product: any): string[] {
  if (!product?.variants || !product?.options) return []
  
  const weightOption = findWeightOption(product.options)
  if (!weightOption) return []
  
  const variantWeights = product.variants.map((variant: any) => {
    const weightOpt = variant?.options?.find((o: any) =>
      weightOption.values?.some((val: any) => val.value === o.value)
    )
    return weightOpt?.value
  })
  
  return [...new Set(variantWeights)].filter(Boolean) as string[]
}
export function findSizeOption(options: any[]): any {
  return options?.find(opt => isSizeOption(opt.title)) || null
}

/**
 * Gets all size values from variants using flexible matching
 */
export function extractSizeValues(product: any): string[] {
  if (!product?.variants || !product?.options) return []
  
  const sizeOption = findSizeOption(product.options)
  if (!sizeOption) return []
  
  const variantSizes = product.variants.map((variant: any) => {
    const sizeOpt = variant?.options?.find((o: any) =>
      sizeOption.values?.some((val: any) => val.value === o.value)
    )
    return sizeOpt?.value
  })
  
  return [...new Set(variantSizes)].filter(Boolean) as string[]
}
/**
 * Debug function to log all option titles for analysis
 */
export function debugProductOptions(product: any, productTitle?: string): void {
  if (!product?.options) return
  
  product.options.forEach((opt: any, index: number) => {
    const detections = {
      Color: isColorOption(opt.title),
      Size: isSizeOption(opt.title),
      Weight: isWeightOption(opt.title),
      Material: isMaterialOption(opt.title),
      Style: isStyleOption(opt.title),
      Capacity: isCapacityOption(opt.title),
      Power: isPowerOption(opt.title),
      Flavor: isFlavorOption(opt.title),
      Age: isAgeOption(opt.title),
      Gender: isGenderOption(opt.title),
      Condition: isConditionOption(opt.title),
      Compatibility: isCompatibilityOption(opt.title)
    }
    
    const detectedTypes = Object.entries(detections)
      .filter(([_, detected]) => detected)
      .map(([type, _]) => type)
      .join(', ')
    
    console.log(`  Option ${index + 1}: "${opt.title}" (${detectedTypes || 'Unknown'})`)
  })
}

/**
 * Gets all available option types for a product
 */
export function getProductOptionTypes(product: any): {
  hasColor: boolean
  hasSize: boolean
  hasWeight: boolean
  hasMaterial: boolean
  hasStyle: boolean
  hasCapacity: boolean
  hasPower: boolean
  hasFlavor: boolean
  hasAge: boolean
  hasGender: boolean
  hasCondition: boolean
  hasCompatibility: boolean
  colorOption?: any
  sizeOption?: any
  weightOption?: any
  materialOption?: any
  styleOption?: any
  capacityOption?: any
  powerOption?: any
  flavorOption?: any
  ageOption?: any
  genderOption?: any
  conditionOption?: any
  compatibilityOption?: any
} {
  if (!product?.options) {
    return { 
      hasColor: false, hasSize: false, hasWeight: false, hasMaterial: false,
      hasStyle: false, hasCapacity: false, hasPower: false, hasFlavor: false,
      hasAge: false, hasGender: false, hasCondition: false, hasCompatibility: false
    }
  }
  
  const colorOption = findColorOption(product.options)
  const sizeOption = findSizeOption(product.options)
  const weightOption = findWeightOption(product.options)
  const materialOption = findMaterialOption(product.options)
  const styleOption = findStyleOption(product.options)
  const capacityOption = findCapacityOption(product.options)
  const powerOption = findPowerOption(product.options)
  const flavorOption = findFlavorOption(product.options)
  const ageOption = findAgeOption(product.options)
  const genderOption = findGenderOption(product.options)
  const conditionOption = findConditionOption(product.options)
  const compatibilityOption = findCompatibilityOption(product.options)
  
  return {
    hasColor: !!colorOption,
    hasSize: !!sizeOption,
    hasWeight: !!weightOption,
    hasMaterial: !!materialOption,
    hasStyle: !!styleOption,
    hasCapacity: !!capacityOption,
    hasPower: !!powerOption,
    hasFlavor: !!flavorOption,
    hasAge: !!ageOption,
    hasGender: !!genderOption,
    hasCondition: !!conditionOption,
    hasCompatibility: !!compatibilityOption,
    colorOption,
    sizeOption,
    weightOption,
    materialOption,
    styleOption,
    capacityOption,
    powerOption,
    flavorOption,
    ageOption,
    genderOption,
    conditionOption,
    compatibilityOption
  }
}

/**
 * Get all option values for a product in a structured format
 */
export function getAllProductOptions(product: any) {
  return {
    colors: extractSizeValues(product),
    sizes: extractSizeValues(product),
    weights: extractWeightValues(product),
    materials: extractMaterialValues(product),
    styles: extractStyleValues(product),
    capacities: extractCapacityValues(product),
    powers: extractPowerValues(product),
    flavors: extractFlavorValues(product),
    ages: extractAgeValues(product),
    genders: extractGenderValues(product),
    conditions: extractConditionValues(product),
    compatibilities: extractCompatibilityValues(product)
  }
}