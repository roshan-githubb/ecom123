"use client"

import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { useState } from "react"
import { CollapseIcon } from "@/icons"

interface HierarchicalCategoryMenuProps {
  categories: HttpTypes.StoreProductCategory[]
  onClose?: () => void
}

export const HierarchicalCategoryMenu = ({
  categories,
  onClose,
}: HierarchicalCategoryMenuProps) => {
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [loadingLink, setLoadingLink] = useState<string | null>(null)
  const INITIAL_DISPLAY_COUNT = 7
  
  const displayedCategories = showAllCategories 
    ? categories 
    : categories.slice(0, INITIAL_DISPLAY_COUNT)

  return (
    <nav className="flex flex-col bg-white">
      {/* All Products Link */}
      <LocalizedClientLink
        href="/products"
        onClick={() => setLoadingLink('/products')}
        className="px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors border-b border-gray-200 flex items-center justify-between"
      >
        <span>All Products</span>
        {loadingLink === '/products' && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-myBlue"></div>
        )}
      </LocalizedClientLink>

      {/* 2-Level Categories */}
      {displayedCategories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          onClose={onClose}
          loadingLink={loadingLink}
          setLoadingLink={setLoadingLink}
        />
      ))}

      {/* Show More/Less for Categories */}
      {categories.length > INITIAL_DISPLAY_COUNT && (
        <button
          onClick={() => setShowAllCategories(!showAllCategories)}
          className="px-4 py-3 text-sm font-medium text-myBlue hover:bg-gray-100 transition-colors border-t border-gray-200 text-left"
        >
          {showAllCategories 
            ? `- Show Less` 
            : `+ Show More (${categories.length - INITIAL_DISPLAY_COUNT} more)`
          }
        </button>
      )}
    </nav>
  )
}

interface CategoryItemProps {
  category: HttpTypes.StoreProductCategory
  onClose?: () => void
  loadingLink: string | null
  setLoadingLink: (link: string | null) => void
}

const CategoryItem = ({ category, onClose, loadingLink, setLoadingLink }: CategoryItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showAllSubcategories, setShowAllSubcategories] = useState(false)
  const INITIAL_DISPLAY_COUNT = 5
  
  const hasSubcategories =
    category.category_children && category.category_children.length > 0

  const displayedSubcategories = showAllSubcategories
    ? category.category_children
    : category.category_children?.slice(0, INITIAL_DISPLAY_COUNT)

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (hasSubcategories) {
      setIsExpanded(!isExpanded)
    }
  }

  const categoryHref = `/categories/${category.handle}`

  return (
    <div className="border-b border-gray-200">
      {/* Category Level */}
      <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-900 hover:bg-gray-100 transition-colors">
        <LocalizedClientLink
          href={categoryHref}
          className="flex-1 font-medium flex items-center justify-between"
          onClick={() => setLoadingLink(categoryHref)}
        >
          <span>{category.name}</span>
          {loadingLink === categoryHref && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-myBlue ml-2"></div>
          )}
        </LocalizedClientLink>

        {hasSubcategories && (
          <button
            onClick={handleToggle}
            className="p-1 hover:bg-gray-200 rounded ml-2"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            <CollapseIcon
              size={16}
              className={`transition-transform duration-200 text-gray-600 ${
                isExpanded ? "rotate-0" : "-rotate-90"
              }`}
            />
          </button>
        )}
      </div>

      {/* Subcategories (Level 1) */}
      {hasSubcategories && isExpanded && (
        <div className="bg-gray-50">
          {displayedSubcategories?.map((subcategory) => {
            const subcategoryHref = `/categories/${subcategory.handle}`
            return (
              <LocalizedClientLink
                key={subcategory.id}
                href={subcategoryHref}
                onClick={() => setLoadingLink(subcategoryHref)}
                className="block px-8 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-between"
              >
                <span>{subcategory.name}</span>
                {loadingLink === subcategoryHref && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-myBlue"></div>
                )}
              </LocalizedClientLink>
            )
          })}

          {/* Show More/Less for Subcategories */}
          {category.category_children && category.category_children.length > INITIAL_DISPLAY_COUNT && (
            <button
              onClick={() => setShowAllSubcategories(!showAllSubcategories)}
              className="w-full text-left px-8 py-2.5 text-sm font-medium text-myBlue hover:bg-gray-100 transition-colors border-t border-gray-200"
            >
              {showAllSubcategories 
                ? `- Show Less` 
                : `+ Show More (${category.category_children.length - INITIAL_DISPLAY_COUNT} more)`
              }
            </button>
          )}
        </div>
      )}
    </div>
  )
}
