"use server"

import { sdk } from "@/lib/config"
import { HttpTypes } from "@medusajs/types"

interface CategoriesProps {
  query?: Record<string, any>
  headingCategories?: string[]
}

export const listCategories = async ({
  query,
  headingCategories = [],
}: Partial<CategoriesProps> = {}) => {
  const limit = query?.limit || 100

  const categories = await sdk.client
    .fetch<{
      product_categories: HttpTypes.StoreProductCategory[]
    }>("/store/product-categories", {
      query: {
        fields: "handle, name, rank, parent_category_id, metadata",
        limit,
        ...query,
      },
      cache: "force-cache",
      next: { revalidate: 3600 },
    })
    .then(({ product_categories }) => product_categories)
    .catch((error) => {
      return []
    })


  const parentCategories = categories.filter(({ name }) =>
    headingCategories.includes(name.toLowerCase())
  )

  const childrenCategories = categories.filter(
    ({ name }) => !headingCategories.includes(name.toLowerCase())
  )

  return {
    categories: childrenCategories.filter(
      ({ parent_category_id }) => !parent_category_id
    ),
    parentCategories: parentCategories,
  }
}

/**
 * Fetch hierarchical categories with 2-level nesting (Shopify/Meesho pattern)
 * Category -> Subcategory (both clickable)
 * Types and Values are used as filters on product listing page
 */
export const listHierarchicalCategories = async () => {
  const categories = await sdk.client
    .fetch<{
      product_categories: HttpTypes.StoreProductCategory[]
    }>("/store/product-categories", {
      query: {
        fields: "*category_children,*category_children.category_children",
        limit: 100,
      },
      cache: "force-cache",
      next: { revalidate: 3600 },
    })
    .then(({ product_categories }) => product_categories)
    .catch((error) => {
      console.error("Error fetching hierarchical categories:", error)
      return []
    })

  // Filter to get only root categories (no parent)
  const rootCategories = categories.filter(
    (cat) => !cat.parent_category_id
  )

  return rootCategories
}

/**
 * Get all descendant category IDs using mpath (materialized path)
 * This works for any depth of hierarchy
 */
export const getAllDescendantCategoryIdsByMpath = async (categoryId: string): Promise<string[]> => {
  try {
    // Fetch all categories with mpath
    const response = await sdk.client.fetch<{
      product_categories: (HttpTypes.StoreProductCategory & { mpath?: string })[]
    }>("/store/product-categories", {
      query: {
        fields: "id,mpath,name",
        limit: 1000,
      },
    })

    const allCategories = response.product_categories || []
    
    console.log(`=== getAllDescendantCategoryIdsByMpath for ${categoryId} ===`)
    console.log(`Total categories fetched: ${allCategories.length}`)
    
    // Find the current category to see its mpath
    const currentCategory = allCategories.find(c => c.id === categoryId)
    console.log('Current category mpath:', currentCategory?.mpath)
    
    // Show all categories that might be related
    const relatedCategories = allCategories.filter(c => 
      c.name?.toLowerCase().includes('computer') || 
      c.name?.toLowerCase().includes('keyboard') ||
      c.name?.toLowerCase().includes('electronic')
    )
    console.log('Related categories:', relatedCategories.map(c => ({ 
      name: c.name, 
      id: c.id,
      mpath: c.mpath 
    })))
    
    // Find all descendants using mpath
    // We need to find categories where:
    // 1. mpath contains ".categoryId." (categoryId is in the middle)
    // 2. OR mpath ends with ".categoryId" and has more segments after
    const descendants = allCategories.filter(cat => {
      if (!cat.mpath) return false
      
      // Check if this category's mpath contains the current categoryId as a segment
      // and has more segments after it (meaning it's a descendant)
      const segments = cat.mpath.split('.')
      const categoryIndex = segments.indexOf(categoryId)
      
      // If categoryId is found and there are more segments after it, it's a descendant
      const isDescendant = categoryIndex !== -1 && categoryIndex < segments.length - 1
      
      if (isDescendant) {
        console.log(`Found descendant: ${cat.name} (${cat.id}) - mpath: ${cat.mpath}`)
      }
      return isDescendant
    })

    console.log(`Found ${descendants.length} descendants`)

    return descendants.map(cat => cat.id)
  } catch (error) {
    console.error(`Error fetching descendants for category ${categoryId}:`, error)
    return []
  }
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = `${categoryHandle.join("/")}`

  const category = await sdk.client
    .fetch<HttpTypes.StoreProductCategoryListResponse>(
      `/store/product-categories`,
      {
        query: {
          fields: "*category_children,*category_children.category_children",
          handle,
        },
        cache: "force-cache",
        next: { revalidate: 300 },
      }
    )
    .then(({ product_categories }) => product_categories[0])

  return category
}
