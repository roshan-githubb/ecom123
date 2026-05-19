"use client"

import { HttpTypes } from "@medusajs/types"
import { ProductsList, ProductsPagination, ProductListingHeader } from "@/components/organisms"
import { PRODUCT_LIMIT } from "@/const"
import { listProducts } from "@/lib/data/products"
import { getRegion } from "@/lib/data/regions"
import { getAllDescendantCategoryIdsByMpath } from "@/lib/data/categories"
import { sortProductsByInventory } from "@/lib/sortProducts/sortProducts"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { FilterIcon } from "@/icons"

interface CategoryProductListingProps {
  category: HttpTypes.StoreProductCategory
  locale: string
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function CategoryProductListing({
  category,
  locale,
  searchParams,
}: CategoryProductListingProps) {
  const router = useRouter()
  const urlSearchParams = useSearchParams()
  const [products, setProducts] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set())
  const [showAllSubcategories, setShowAllSubcategories] = useState(false)
  const [showAllTypes, setShowAllTypes] = useState<Set<string>>(new Set())

  const INITIAL_DISPLAY_COUNT = 5

  const hasSubcategories = category.category_children && category.category_children.length > 0
  const currentPage = parseInt((searchParams?.page as string) || "1", 10)

  useEffect(() => {
    loadProducts()
  }, [category.id, currentPage])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const region = await getRegion(locale)
      if (!region) throw new Error("Region not found")

      const descendantIds = await getAllDescendantCategoryIdsByMpath(category.id)
      
      const categoryIds = [category.id, ...descendantIds]

      console.log(`=== Category Hierarchy for ${category.name} ===`)
      console.log(`Current category: ${category.name} (${category.id})`)
      console.log(`Found ${descendantIds.length} descendant categories`)
      console.log(`Total category IDs to query: ${categoryIds.length}`)
      console.log('Category IDs:', categoryIds)

      // Fetch products for all category IDs
      const { response } = await listProducts({
        pageParam: currentPage,
        queryParams: {
          q: '',
          limit: PRODUCT_LIMIT,
          category_id: categoryIds,
        },
        regionId: region.id,
      })

      console.log(`Products found: ${response?.products?.length || 0}`)

      const sortedProducts = sortProductsByInventory(response?.products || [])
      setProducts(sortedProducts)
      setTotalCount(response?.count || 0)
    } catch (error) {
      console.error("Error loading products:", error)
      setProducts([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }

  const handleSubcategoryFilter = (subcategoryHandle: string | null) => {
    if (subcategoryHandle) {
      // Navigate to the subcategory page
      router.push(`/categories/${subcategoryHandle}`)
    }
  }

  const toggleSubcategory = (subcategoryId: string) => {
    setExpandedSubcategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(subcategoryId)) {
        newSet.delete(subcategoryId)
      } else {
        newSet.add(subcategoryId)
      }
      return newSet
    })
  }

  const toggleShowAllTypes = (subcategoryId: string) => {
    setShowAllTypes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(subcategoryId)) {
        newSet.delete(subcategoryId)
      } else {
        newSet.add(subcategoryId)
      }
      return newSet
    })
  }

  const pages = Math.ceil(totalCount / PRODUCT_LIMIT) || 1

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Mobile Filter Toggle */}
      {hasSubcategories && (
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 bg-myBlue text-white rounded-lg mb-4 text-sm"
        >
          <FilterIcon size={18} />
          <span>Filters</span>
        </button>
      )}

      {/* Sidebar Filters */}
      {hasSubcategories && (
        <aside
          className={`
            ${showFilters ? 'block' : 'hidden'} lg:block
            w-full lg:w-64 flex-shrink-0
            bg-white rounded-lg shadow-sm
            lg:sticky lg:top-20 lg:h-fit
            max-h-[calc(100vh-6rem)] overflow-y-auto
          `}
        >
          {/* All Products Option */}
          <button
            onClick={() => handleSubcategoryFilter(null)}
            className="w-full text-left px-4 py-3 border-b border-gray-200 transition-colors text-sm hover:bg-gray-50 font-medium"
          >
            All {category.name}
          </button>

          {/* Subcategory Filters with Types */}
          {(showAllSubcategories 
            ? category.category_children 
            : category.category_children?.slice(0, INITIAL_DISPLAY_COUNT)
          )?.map((subcategory) => {
            const hasTypes = subcategory.category_children && subcategory.category_children.length > 0
            const isExpanded = expandedSubcategories.has(subcategory.id)
            const showingAllTypes = showAllTypes.has(subcategory.id)
            const types = subcategory.category_children || []
            const displayedTypes = showingAllTypes ? types : types.slice(0, INITIAL_DISPLAY_COUNT)
            
            return (
              <div key={subcategory.id} className="border-b border-gray-200">
                {/* Subcategory */}
                <div className="flex items-center">
                  <button
                    onClick={() => handleSubcategoryFilter(subcategory.handle)}
                    className="flex-1 text-left px-4 py-3 transition-colors text-sm hover:bg-gray-50 font-medium text-gray-900"
                  >
                    {subcategory.name}
                  </button>
                  
                  {/* Arrow toggle for types */}
                  {hasTypes && (
                    <button
                      onClick={() => toggleSubcategory(subcategory.id)}
                      className="p-3 hover:bg-gray-50 transition-colors"
                      aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                      <svg
                        className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {/* Types (children of subcategory) */}
                {hasTypes && isExpanded && (
                  <div className="bg-gray-50">
                    {displayedTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => handleSubcategoryFilter(type.handle)}
                        className="w-full text-left px-8 py-2.5 transition-colors text-xs hover:bg-gray-100 text-gray-600 border-t border-gray-200"
                      >
                        {type.name}
                      </button>
                    ))}
                    
                    {/* Show More/Less for Types */}
                    {types.length > INITIAL_DISPLAY_COUNT && (
                      <button
                        onClick={() => toggleShowAllTypes(subcategory.id)}
                        className="w-full text-left px-8 py-2.5 transition-colors text-xs hover:bg-gray-100 text-myBlue font-medium border-t border-gray-200"
                      >
                        {showingAllTypes 
                          ? `- Show Less` 
                          : `+ Show More (${types.length - INITIAL_DISPLAY_COUNT} more)`
                        }
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {/* Show More/Less for Subcategories */}
          {category.category_children && category.category_children.length > INITIAL_DISPLAY_COUNT && (
            <button
              onClick={() => setShowAllSubcategories(!showAllSubcategories)}
              className="w-full text-left px-4 py-3 transition-colors text-sm hover:bg-gray-50 text-myBlue font-medium"
            >
              {showAllSubcategories 
                ? `- Show Less` 
                : `+ Show More (${category.category_children.length - INITIAL_DISPLAY_COUNT} more)`
              }
            </button>
          )}
        </aside>
      )}

      {/* Products Section */}
      <div className="flex-1">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-myBlue"></div>
          </div>
        ) : (
          <>
            <ProductListingHeader total={totalCount} />
            <div className="mt-4">
              <ProductsList products={products} locale={locale} />
              {pages > 1 && <ProductsPagination pages={pages} />}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
