/**
 * Adapter to convert Algolia product format to backend product format
 * This allows the same SelectVariantModal component to work with both product sources
 */

export function adaptAlgoliaProductToBackendFormat(algoliaProduct: any) {
  if (!algoliaProduct) return null

  // Check if already in backend format (has options with id and title structure)
  if (
    algoliaProduct.options?.[0]?.id !== undefined &&
    algoliaProduct.options?.[0]?.title !== undefined
  ) {
    return algoliaProduct
  }

  // Extract unique option names and their values from variants
  const optionMap = new Map<string, Set<string>>()

  algoliaProduct.variants?.forEach((variant: any) => {
    Object.keys(variant).forEach((key) => {
      // Skip non-option fields
      if (
        !["id", "title", "prices", "stocked_quantity", "in_stock", "images", "variant_images"].includes(key)
      ) {
        if (!optionMap.has(key)) {
          optionMap.set(key, new Set())
        }
        const value = variant[key]
        if (value) {
          optionMap.get(key)!.add(value)
        }
      }
    })
  })

  // Convert to backend format options
  const backendOptions = Array.from(optionMap).map(([title, values], index) => ({
    id: `opt_${index}`,
    title,
    values: Array.from(values).map((value, valueIndex) => ({
      id: `opt_val_${index}_${valueIndex}`,
      value,
    })),
  }))

  // Convert to backend format variants
  const backendVariants = algoliaProduct.variants?.map((variant: any) => {
    // Get the first price if available
    const priceData = variant.prices?.[0]
    const calculatedAmount = priceData?.amount || 0
    const currencyCode = priceData?.currency_code || "INR"

    // Build options array from variant properties
    const variantOptions = backendOptions.map((opt) => {
      const value = variant[opt.title]
      return {
        id: `vopt_${opt.id}`,
        value: value || "",
      }
    })

    // Handle variant images - normalize to array of {url, is_thumbnail, id, rank}
    let normalizedVariantImages: any[] = []
    if (Array.isArray(variant.images)) {
      normalizedVariantImages = variant.images.map((img: any) => {
        // If already has the full structure, keep it
        if (img.url && (img.is_thumbnail !== undefined || img.rank !== undefined)) {
          return img
        }
        // If it's just a URL string, wrap it
        if (typeof img === 'string') {
          return { url: img, is_thumbnail: false, rank: 0 }
        }
        // If it's an object with just url, add missing fields
        if (img.url) {
          return { url: img.url, is_thumbnail: img.is_thumbnail ?? false, rank: img.rank ?? 0 }
        }
        return null
      }).filter(Boolean) || []
    }
    if (Array.isArray(variant.variant_images)) {
      normalizedVariantImages = variant.variant_images.map((img: any) => {
        if (img.url && (img.is_thumbnail !== undefined || img.rank !== undefined)) {
          return img
        }
        if (typeof img === 'string') {
          return { url: img, is_thumbnail: false, rank: 0 }
        }
        if (img.url) {
          return { url: img.url, is_thumbnail: img.is_thumbnail ?? false, rank: img.rank ?? 0 }
        }
        return null
      }).filter(Boolean) || []
    }

    return {
      id: variant.id,
      title: variant.title,
      inventory_quantity: variant.stocked_quantity || 0,
      options: variantOptions,
      variant_images: normalizedVariantImages,
      calculated_price: {
        calculated_amount: calculatedAmount,
        original_amount: calculatedAmount, // Algolia doesn't have original price, so use same
        currency_code: currencyCode,
      },
    }
  }) || []

  return {
    ...algoliaProduct,
    options: backendOptions,
    variants: backendVariants,
  }
}

/**
 * Check if a product is in Algolia format (without proper option structure)
 */
export function isAlgoliaProduct(product: any): boolean {
  return (
    product?.options &&
    Array.isArray(product.options) &&
    product.options.length > 0 &&
    // Algolia options are plain objects with key-value pairs, not {id, title, values}
    product.options[0]?.id === undefined &&
    product.options[0]?.title === undefined
  )
}
