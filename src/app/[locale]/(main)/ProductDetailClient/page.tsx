"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { useCartStore } from "@/store/useCartStore"
import { Review, SimpleRatingSummary } from "@/types/reviews"
import { cartToast } from "@/lib/cart-toast"
import { Toaster } from "react-hot-toast"
import { ProductCardInternal } from "@/components/molecules/AddVariantModal/AddVariantModal"
import { useInventoryStore } from "@/store/useInventoryStore"
import { logViewProduct } from "@/lib/firebase/analytics"
// import { FaRegBookmark } from "react-icons/fa"
interface ProductOptionValue {
  id: string
  value: string
}

interface ProductOption {
  id: string
  title: string
  values: ProductOptionValue[]
}

interface ProductVariantOption {
  id: string
  value: string
}

interface ProductVariant {
  id: string
  options: ProductVariantOption[]
  calculated_price?: {
    calculated_amount: number
    original_amount: number
    currency_code: string
  }
}

interface Product {
  id: string
  title: string
  store?: { name: string; url: string }
  collection?: { title: string }
  soldLastMonth?: number
  review_count?: number
  material?: string
  images?: { url: string }[]
  options?: ProductOption[]
  variants?: ProductVariant[]
  description?: string
}

interface ColorOption {
  id: string
  label: string
  bg: string
  ring: string
}

export default function ProductDetailClient({
  product,
  reviews,
  ratingSummary,
}: {
  product: Product
  reviews: Review[]
  ratingSummary?: SimpleRatingSummary
}) {
  const [index, setIndex] = useState(0)
  const { getAdjustedInventory } = useInventoryStore()
  const [isHydrated, setIsHydrated] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const averageRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return 0
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  }, [reviews])

  const totalReviews = reviews.length

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => {
    const initial: Record<string, string> = {}
    product.options?.forEach((option: any) => {
      if (option.values && option.values.length > 0) {
        initial[option.title] = option.values[0].value
      }
    })
    return initial
  })

  const handleOptionSelect = (optionTitle: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionTitle]: value,
    }))
  }

  const selectedVariant =
    product.variants?.find((variant: any) => {
      return variant.options?.every((variantOption: any) => {
        const optionTitle = product.options?.find((opt: any) =>
          opt.values?.some((val: any) => val.value === variantOption.value)
        )?.title

        if (!optionTitle) return true
        return selectedOptions[optionTitle] === variantOption.value
      })
    }) || product.variants?.[0]

  useEffect(() => {
    if (product && selectedVariant) {
      const price = selectedVariant?.calculated_price?.calculated_amount ?? 0
      logViewProduct(product.id, product.title, price)
    }
  }, [product, selectedVariant])

  const colorOption = product.options?.find(
    (opt) => opt.title.toLowerCase() === "color"
  )
  const colors: ColorOption[] =
    colorOption?.values.map((v) => {
      let bgClass = "bg-gray-200"

      switch (v.value.toLowerCase()) {
        case "white":
          bgClass = "bg-white"
          break
        case "black":
          bgClass = "bg-black"
          break
        case "red":
          bgClass = "bg-red-500"
          break
        case "green":
          bgClass = "bg-green-500"
          break
        case "blue":
          bgClass = "bg-blue-500"
          break
        case "yellow":
          bgClass = "bg-yellow-400"
          break
        case "orange":
          bgClass = "bg-orange-500"
          break
        case "purple":
          bgClass = "bg-purple-500"
          break
        case "pink":
          bgClass = "bg-pink-500"
          break
        case "gray":
        case "grey":
          bgClass = "bg-gray-500"
          break
        case "brown":
          bgClass = "bg-amber-700"
          break
        case "cyan":
          bgClass = "bg-cyan-500"
          break
        case "teal":
          bgClass = "bg-teal-500"
          break
        case "indigo":
          bgClass = "bg-indigo-500"
          break
        case "lime":
          bgClass = "bg-lime-500"
          break
        case "amber":
          bgClass = "bg-amber-500"
          break
        case "violet":
          bgClass = "bg-violet-500"
          break
        case "rose":
          bgClass = "bg-rose-500"
          break
        default:
          bgClass = "bg-gray-200"
          break
      }

      return { id: v.id, label: v.value, bg: bgClass, ring: "ring-gray-300" }
    }) || []

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

  const images = product.images?.map((img) => img.url).filter((url) => url) || [
    "/images/not-available/not-available.png",
  ]

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

    return isHydrated
      ? getAdjustedInventory(variant.id, originalInventory)
      : originalInventory
  }

  const selectedVariantInventory = getVariantInventory(selectedVariant)
  const isSelectedVariantOutOfStock = selectedVariantInventory <= 0

  const price = selectedVariant?.calculated_price?.calculated_amount ?? 0
  const originalPrice =
    selectedVariant?.calculated_price?.original_amount ?? price
  const discountPercent =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0
  const currency =
    selectedVariant?.calculated_price?.currency_code?.toUpperCase() ?? "NPR"

  const handleAddToCart = async () => {
    const variant = selectedVariant

    if (!variant) {
      cartToast.showErrorToast("Please select a valid variant")
      return
    }

    setIsAdding(true)
    try {
      await useCartStore.getState().add(variant.id, 1)
      cartToast.showCartToast()
    } catch (e) {
      cartToast.showErrorToast()
    } finally {
      setIsAdding(false)
    }
  }

  const startX = useRef(0)
  const endX = useRef(0)
  const isDragging = useRef(false)

  const next = () => {
    setIndex((prev) => (prev + 1) % images.length)
  }

  const prev = () => {
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleSwipe = () => {
    const diff = endX.current - startX.current
    if (Math.abs(diff) < 50) return
    if (diff < 0) next()
    else prev()
  }

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    isDragging.current = false
    startX.current = e.touches[0].clientX
  }
  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    endX.current = e.touches[0].clientX
    isDragging.current = true
  }
  const onTouchEnd = () => {
    if (isDragging.current) handleSwipe()
  }

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true
    startX.current = e.clientX
  }

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return
    endX.current = e.clientX
  }

  const onMouseUp = () => {
    if (!isDragging.current) return
    isDragging.current = false
    handleSwipe()
  }

  const handleWishlistToggle = () => {
    cartToast.showErrorToast("Wishlist feature coming soon!")
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.title,
          text: `Check out ${product.title}`,
          url: window.location.href,
        })
        .catch(() => {
          // User cancelled share
        })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      cartToast.showCartToast()
    }
  }

  console.log(
    "product:",
    product?.images?.map((img: any) => img.url)
  )

  return (
    <main className="min-h-screen bg-white">
      <Toaster position="top-right" reverseOrder={false} />

      {/* <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center p-3 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex-1 mx-3 min-w-0">
            <h1 className="text-sm font-medium text-gray-800 truncate">
              {product.title}
            </h1>
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={handleWishlistToggle}
              className="w-9 h-9 flex items-center justify-center bg-gray-50 rounded-full text-gray-600 hover:bg-gray-100 flex-shrink-0 transition-colors"
            >
              <FaRegBookmark size={14} />
            </button>
            <button
              onClick={handleShare}
              className="w-9 h-9 flex items-center justify-center bg-gray-50 rounded-full text-gray-600 hover:bg-gray-100 flex-shrink-0 transition-colors"
            >
              <IoShareOutline size={18} />
            </button>
          </div>
        </div>

        <div
          className="w-full bg-gray-200 py-4 relative flex justify-center select-none"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={() => {
            isDragging.current = false
          }}
        >
          <div className="w-[220px] sm:w-[250px] md:w-[284px] lg:w-[296px] h-[232px] sm:h-[264px] md:h-[296px] lg:h-[320px] overflow-hidden rounded-2xl flex items-center justify-center">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={(e, info) => {
                if (info.offset.x < -50 && index < images.length - 1) {
                  setIndex(index + 1)
                } else if (info.offset.x > 50 && index > 0) {
                  setIndex(index - 1)
                }
              }}
              className="w-full h-full active:scale-95 active:opacity-80 transition-transform"
            >
              <Image
                src={images[index] || "/images/not-available/not-available.png"}
                alt={"Product image"}
                width={296}
                height={320}
                className="object-cover w-full h-full rounded-2xl pointer-events-none"
              />
            </motion.div>
          </div>
        </div>

        <div className="flex justify-center gap-2 py-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-all active:scale-95 ${
                i === index ? "bg-blue-800 w-4" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <div className="px-4 py-3 flex justify-between items-center border-b border-gray-200">
          <div className="text-sm text-blue-600 font-medium">
            <Link
              href={
                (product as any).seller?.handle
                  ? `/sellerpage?seller_handle=${(product as any).seller.handle}`
                  : product.store?.url || "#"
              }
              className="inline-flex items-end text-[14px] leading-[21px] font-medium text-[#425699] hover:underline font-poppins"
            >
              Visit the{" "}
              {(product as any).seller?.name || product.store?.name || "Store"}
            </Link>
          </div>
          <div className="flex flex-col items-end gap-1">
            {isSelectedVariantOutOfStock ? (
              <span className="text-xs text-red-600 font-medium mr-3">
                Out of stock
              </span>
            ) : selectedVariantInventory > 0 &&
              selectedVariantInventory < 10 ? (
              <span className="text-xs text-red-600 font-medium mr-3">
                Only {selectedVariantInventory} left in stock
              </span>
            ) : null}
            <button
              onClick={handleAddToCart}
              disabled={isSelectedVariantOutOfStock || isAdding}
              className={`px-6 py-2 rounded-lg font-medium transition-colors shadow-md min-w-[80px] ${
                isSelectedVariantOutOfStock
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isAdding
                    ? "bg-myBlue/70 text-white cursor-wait"
                    : "bg-myBlue text-white hover:bg-blue-700"
              }`}
            >
              {isAdding ? (
                <span className="flex items-center justify-center gap-1">
                  <svg
                    className="animate-spin h-3 w-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding...
                </span>
              ) : (
                "ADD MORE"
              )}
            </button>
          </div>
        </div>

        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center mb-2 gap-2">
            <span className="text-xs bg-red-600 text-white px-2 py-1 rounded font-semibold flex-shrink-0">
              #Best Seller
            </span>
            <div className="flex gap-4 flex-1">
              <span className="text-xs ml-1 font-medium text-blue-600 min-w-0 truncate flex-1">
                in {product.collection?.title}
              </span>
              {totalReviews > 0 && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <StarRating rate={averageRating} starSize={12} />
                  <span className="text-xs text-gray-600">
                    ({totalReviews})
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-800">
            <span className="font-semibold">
              {product.soldLastMonth || "0"}
            </span>{" "}
            Sold in past month
          </div>
        </div>

        <hr className="border-gray-300" />

        {product.options && product.options.length > 0 && (
          <>
            <div className="px-4 py-4 space-y-4">
              {product.options.map((option: any) => {
                const isColorOpt = option.title.toLowerCase() === "color"
                const isSizeOpt = option.title.toLowerCase() === "size"
                const selectedValue = selectedOptions[option.title]

                return (
                  <div key={option.id}>
                    <div className="text-base font-normal text-black mb-2">
                      {option.title}:{" "}
                      <span className="font-semibold">{selectedValue}</span>
                    </div>

                    {isColorOpt && colors.length > 0 ? (
                      <div className="flex gap-3 flex-wrap">
                        {colors.map((c) => (
                          <button
                            key={c.id}
                            onClick={() =>
                              handleOptionSelect(option.title, c.label)
                            }
                            className={`w-[84px] h-[74px] rounded-lg overflow-hidden flex items-center justify-center ${
                              selectedValue === c.label
                                ? "border-2 border-blue-800"
                                : "border border-gray-300"
                            }`}
                          >
                            <div className={`${c.bg} w-full h-full`} />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex gap-2 flex-wrap">
                        {option.values?.map((value: any) => (
                          <button
                            key={value.id}
                            onClick={() =>
                              handleOptionSelect(option.title, value.value)
                            }
                            className={`${
                              isSizeOpt ? "w-[50px] h-[40px]" : "px-3 py-2"
                            } rounded-lg flex items-center justify-center text-sm ${
                              selectedValue === value.value
                                ? "border-2 border-blue-800 bg-white text-gray-800"
                                : "border border-gray-800 bg-transparent text-gray-800"
                            }`}
                          >
                            {isSizeOpt
                              ? sizeShortMap[value.value?.toLowerCase()] ||
                                value.value
                              : value.value}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <hr className="border-gray-300" />
          </>
        )}

        <div className="px-4 py-3 space-y-2">
          {discountPercent > 0 && (
            <div className="bg-red-600 text-white px-3 py-1.5 rounded text-sm font-semibold w-fit">
              {discountPercent}% OFF + Cash on Delivery
            </div>
          )}
          <div className="flex items-center">
            {discountPercent > 0 && (
              <div className="text-red-600 text-2xl font-medium mr-2">
                -{discountPercent}%
              </div>
            )}
            <div className="flex items-baseline">
              <span className="text-sm">{currency}</span>
              <span className="text-2xl font-medium ml-1">{price}</span>
            </div>
          </div>
          {discountPercent > 0 && (
            <div className="flex items-center gap-3">
              <div className="text-gray-600">
                M.R.P.:{" "}
                <span className="line-through">
                  {currency} {originalPrice}
                </span>
              </div>
              <div className="bg-blue-50 text-green-700 px-2 py-1 rounded text-sm font-medium">
                Save {currency} {originalPrice - price}
              </div>
            </div>
          )}
        </div>

        <hr className="border-gray-300" />

        <div className="px-4 space-y-4 pb-20">
          <details className="py-2" open>
            <summary className="cursor-pointer font-medium text-lg text-gray-800 flex justify-between items-center">
              <span>Product Details</span>
              <MdOutlineKeyboardArrowDown />
            </summary>
            <div className="mt-2">
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td className="py-2 w-32 font-semibold">Material</td>
                    <td className="py-2">
                      {product.material || "Not specified"}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold">Fit</td>
                    <td className="py-2">Regular</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold">Care</td>
                    <td className="py-2">Machine wash cold</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </details>

          <hr className="border-gray-300" />

          <details className="py-2" open>
            <summary className="cursor-pointer font-medium text-lg text-gray-800 flex justify-between items-center">
              <span>Product Description</span>
              <MdOutlineKeyboardArrowDown />
            </summary>
            <div className="mt-2">
              <p className="text-sm text-gray-700 leading-relaxed">
                {product.description || "No description available"}
              </p>
            </div>
          </details>

          <hr className="border-gray-300" />

          <details className="py-2" open>
            <summary className="cursor-pointer font-medium text-lg text-gray-800 flex justify-between items-center">
              <span>Reviews ({totalReviews})</span>
              <MdOutlineKeyboardArrowDown />
            </summary>
            <div className="mt-4 space-y-4">
              {totalReviews > 0 ? (
                <>
                  <div className="flex items-center gap-2">
                    <StarRating rate={averageRating} starSize={18} />
                    <span className="text-sm text-gray-800 font-medium">
                      {averageRating.toFixed(1)} out of 5
                    </span>
                    <span className="text-xs font-normal ml-1">
                      ({totalReviews.toLocaleString()} review
                      {totalReviews !== 1 ? "s" : ""})
                    </span>
                  </div>
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-200 pb-4 last:border-b-0"
                    >
                      <div className="items-center gap-2 mb-2">
                        <div className="flex gap-4">
                          <span className="text-sm font-medium text-gray-900">
                            {review.customer?.first_name}{" "}
                            {review.customer?.last_name}
                          </span>
                          <div className="flex mt-1">
                            <StarRating rate={review.rating} starSize={12} />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">
                        {review.customer_note}
                      </p>
                      <span className="text-xs text-gray-500">
                        Posted on{" "}
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </>
              ) : (
                <NoReviews />
              )}
            </div>
          </details>
        </div>
      </div> */}
      <ProductCardInternal
        product={product}
        // onClose={smoothClose}
        isFullScreen={true}
        // onScrollChange={handleScrollChange}
        // onOverscrollUp={goToSheet}
        // overscrollY={overscrollY}
        lightboxImages={product?.images?.map((img: any) => img.url) || []}
        ratingSummary={ratingSummary}
        // onToggleMode={isFullscreen ? goToSheet : goToFullscreen}
      />
    </main>
  )
}
