"use client"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import { Modal } from "@/components/molecules"
import { Button } from "@/components/atoms"
import { useCartStore } from "@/store/useCartStore"
import { useInventoryStore } from "@/store/useInventoryStore"
import { cartToast } from "@/lib/cart-toast"
import {
  findColorOption,
  isColorOption,
  isSizeOption
} from "@/lib/helpers/option-matcher"
import { createColorOptions, ColorOption } from "@/lib/helpers/color-mapper"
import { adaptAlgoliaProductToBackendFormat, isAlgoliaProduct } from "@/lib/helpers/algolia-product-adapter"


interface SelectVariantModalProps {
  product: any
  onClose: () => void
}

export function SelectVariantModal({ product: initialProduct, onClose }: SelectVariantModalProps) {
  const { getAdjustedInventory } = useInventoryStore()
  const [product, setProduct] = useState<any>(null)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

  // Adapt Algolia product format to backend format if needed
  useEffect(() => {
    if (!initialProduct) return

    let adaptedProduct = initialProduct
    if (isAlgoliaProduct(initialProduct)) {
      adaptedProduct = adaptAlgoliaProductToBackendFormat(initialProduct)
    }
    
    setProduct(adaptedProduct)

    // Initialize selected options with first value of each option
    const initial: Record<string, string> = {}
    adaptedProduct.options?.forEach((option: any) => {
      if (option.values && option.values.length > 0) {
        initial[option.title] = option.values[0].value
      }
    })
    setSelectedOptions(initial)
  }, [initialProduct])

  const [isAdding, setIsAdding] = useState(false)

  // Find selected variant based on selected options
  const selectedVariant = useMemo(() => {
    if (!product?.variants) return undefined
    
    return (
      product.variants.find((variant: any) => {
        return variant.options?.every((variantOption: any) => {
          const optionTitle = product.options?.find((opt: any) =>
            opt.values?.some((val: any) => val.value === variantOption.value)
          )?.title

          if (!optionTitle) return true
          return selectedOptions[optionTitle] === variantOption.value
        })
      }) || product.variants?.[0]
    )
  }, [selectedOptions, product?.variants, product?.options])

  // Get color options for color selection
  const colorOption = product ? findColorOption(product.options || []) : null
  const colors: ColorOption[] = colorOption
    ? createColorOptions(colorOption.values || [])
    : []

  // Size shorthand mapping
  const sizeShortMap: Record<string, string> = {
    small: "S",
    medium: "M",
    large: "L",
    "extra large": "XL",
    xl: "XL",
    l: "L",
    m: "M",
    s: "S",
  }

  // Calculate inventory for selected variant
  const getVariantInventory = (variant: any) => {
    if (!variant) return 0

    let originalInventory = 0
    if (variant.inventory_quantity !== undefined) {
      originalInventory = variant.inventory_quantity || 0
    } else {
      const inventoryItem = variant.inventory_items?.[0]
      if (inventoryItem?.inventory?.location_levels) {
        originalInventory = inventoryItem.inventory.location_levels.reduce(
          (locationSum: number, locationLevel: any) => {
            return locationSum + (locationLevel.available_quantity || 0)
          },
          0
        )
      }
    }

    return getAdjustedInventory(variant.id, originalInventory)
  }

  const selectedVariantInventory = getVariantInventory(selectedVariant)
  const isOutOfStock = selectedVariantInventory <= 0

  // Calculate pricing
  const price = selectedVariant?.calculated_price?.calculated_amount ?? 0
  const originalPrice = selectedVariant?.calculated_price?.original_amount ?? price
  const discountPercent =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0
  const currency =
    selectedVariant?.calculated_price?.currency_code?.toUpperCase() ?? "INR"

  // Handle option selection
  const handleOptionSelect = (optionTitle: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionTitle]: value,
    }))
  }

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedVariant || isOutOfStock) {
      if (isOutOfStock) {
        return
      }
      return cartToast.showErrorToast("Variant unavailable")
    }

    setIsAdding(true)
    try {
      await useCartStore.getState().add(selectedVariant.id, 1)
      cartToast.showCartToast()
      onClose()
    } catch {
      cartToast.showErrorToast()
    } finally {
      setIsAdding(false)
    }
  }

  if (!product) return null

  const images = product.images?.map((img: any) => img.url) || []

  return (
    <Modal heading="Choose Options" onClose={onClose} maxWidth="md">
      <div className="space-y-6">
        {/* Product Preview */}
        <div className="flex gap-4 mt-4">
          <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={images[0] || "/images/not-available/not-available.png"}
              alt={product.title}
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <h3 className="font-medium text-sm">{product.title}</h3>
            <div className="space-y-1">
              {isOutOfStock ? (
                <span className="text-xs text-red-600 font-medium">Out of stock</span>
              ) : selectedVariantInventory > 0 && selectedVariantInventory < 10 ? (
                <span className="text-xs text-red-600 font-medium">
                  Only {selectedVariantInventory} left
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Variants Grid - show first image for each variant */}
        {product.variants && product.variants.length > 0 && (
          <div className="pt-2 border-t">
            <div className="text-sm font-medium text-gray-800 mb-2">Available Variants</div>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
              {product.variants.map((variant: any) => {
                const vImg = variant.variant_images?.[0]?.url || product.images?.[0]?.url || "/images/not-available/not-available.png"
                const isSelected = selectedVariant?.id === variant.id
                const variantTitle = variant.title || (variant.options?.map((o: any) => o.value).join(" / ")) || "Variant"

                const onVariantClick = () => {
                  // Build selectedOptions from this variant's options
                  const newSelected: Record<string, string> = {}
                  variant.options?.forEach((vo: any) => {
                    const optionTitle = product.options?.find((opt: any) =>
                      opt.values?.some((val: any) => val.value === vo.value)
                    )?.title
                    if (optionTitle) newSelected[optionTitle] = vo.value
                  })
                  setSelectedOptions((prev) => ({ ...prev, ...newSelected }))
                }

                return (
                  <button
                    key={variant.id}
                    onClick={onVariantClick}
                    type="button"
                    className={`flex flex-col items-center p-1 rounded-md transition-shadow text-left ${isSelected ? 'ring-2 ring-blue-500 border border-blue-200' : 'border border-gray-200'}`}
                  >
                    <div className="w-full h-16 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                      <Image src={vImg} alt={variantTitle} width={64} height={64} className="object-cover w-full h-full" />
                    </div>
                    <div className="text-xs text-center mt-1 text-gray-700 truncate w-full">
                      {variantTitle}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Options Section */}
        {product.options && product.options.length > 0 && (
          <div className="space-y-4 border-t pt-4">
            {product.options.map((option: any) => {
              const isColorOpt = isColorOption(option.title)
              const isSizeOpt = isSizeOption(option.title)
              const selectedValue = selectedOptions[option.title]

              return (
                <div key={option.id}>
                  <div className="text-sm font-medium text-gray-800 mb-2">
                    {option.title}:{" "}
                    <span className="font-semibold text-gray-900">
                      {selectedValue}
                    </span>
                  </div>

                  {isColorOpt && colors.length > 0 ? (
                    <div className="flex gap-3 flex-wrap">
                      {colors.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => handleOptionSelect(option.title, c.label)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            selectedValue === c.label
                              ? "border-blue-600 ring-2 ring-blue-300"
                              : "border-gray-300"
                          }`}
                          style={{ backgroundColor: c.bg }}
                          title={c.label}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((value: any) => (
                        <button
                          key={value.id}
                          onClick={() => handleOptionSelect(option.title, value.value)}
                          className={`px-3 py-1.5 rounded-lg border-2 text-sm font-medium transition-all ${
                            selectedValue === value.value
                              ? "border-blue-600 bg-blue-50 text-blue-700"
                              : "border-gray-300 text-gray-700 hover:border-gray-400"
                          }`}
                        >
                          {isSizeOpt
                            ? sizeShortMap[value?.value?.toLowerCase()] || value.value
                            : value.value}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Price Section */}
        <div className="space-y-2 border-t pt-4">
          {discountPercent > 0 && (
            <div className="bg-red-600 text-white px-3 py-1.5 rounded text-sm font-semibold w-fit">
              {discountPercent}% OFF
            </div>
          )}

          <div className="flex items-center gap-2">
            {discountPercent > 0 && (
              <span className="text-red-600 text-lg font-medium">
                -{discountPercent}%
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-sm text-gray-600">{currency}</span>
              <span className="text-2xl font-bold text-gray-900">{price}</span>
            </div>
          </div>

          {discountPercent > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                M.R.P.:{" "}
                <span className="line-through">
                  {currency} {originalPrice}
                </span>
              </span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                Save {currency} {originalPrice - price}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 border-t pt-4">
          <Button
            onClick={onClose}
            variant="text"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            loading={isAdding}
            className={`flex-1 ${
              isOutOfStock
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-myBlue text-white hover:bg-opacity-90"
            }`}
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
