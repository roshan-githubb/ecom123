import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  motion,
  AnimatePresence,
  useMotionValue,
  animate,
  useTransform,
} from "framer-motion"
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md"
import { FaRegBookmark } from "react-icons/fa"
import { IoShareOutline } from "react-icons/io5"
import { useCartStore } from "@/store/useCartStore"
import { cartToast } from "@/lib/cart-toast"
import { Review } from "@/types/reviews"
import { HttpTypes } from "@medusajs/types"
import { useParams } from "next/navigation"
import { StoreIcon } from "lucide-react"
import SimilarProducts from "../SimilarProducts/SimilarProduct"

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
  seller?: { id: string; name: string; handle: string }
}
interface ColorOption {
  id: string
  label: string
  bg: string
  ring: string
}
interface AddVariantSheetProps {
  product: Product | HttpTypes.StoreProduct
  reviews?: Review[]
  ratingSummary?: { average_rating: number; total_reviews: number }
  cardPos: { top: number; left: number; width: number; height: number }
  onClose: () => void
  products?: any[]
  currentProductIndex?: number
  onProductChange?: (index: number) => void
}

function ProductCardInternal({
  product,
  onClose,
  isFullScreen,
  onScrollChange,
  onOverscrollUp,
  overscrollY,
  ratingSummary,
  onToggleMode,
  locale,
}: {
  product: any
  onClose: () => void
  isFullScreen: boolean
  onScrollChange: (isAtTop: boolean) => void
  onOverscrollUp?: () => void
  overscrollY?: any
  ratingSummary?: { average_rating: number; total_reviews: number }
  onToggleMode?: () => void
  locale?: string
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [imgIndex, setImgIndex] = useState(0)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const [isAtTop, setIsAtTop] = useState(true)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const atTop = e.currentTarget.scrollTop <= 5
    setIsAtTop(atTop)
    onScrollChange(atTop)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isFullScreen && isAtTop) {
      setTouchStartY(e.touches[0].clientY)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isFullScreen && isAtTop && touchStartY !== null) {
      const currentY = e.touches[0].clientY
      const deltaY = currentY - touchStartY

      if (deltaY > 80) {
        onOverscrollUp?.()
        setTouchStartY(null)
      }
    }
  }

  const handleTouchEnd = () => {
    setTouchStartY(null)
  }

  const images = product.images
    ?.map((img: any) => img.url)
    .filter((url: any) => url) || ["/images/not-available/not-available.png"]

  useEffect(() => {
    if (images.length <= 1) return

    autoPlayRef.current = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % images.length)
    }, 3000)

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [images.length])

  const handleManualImageChange = (index: number) => {
    setImgIndex(index)
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }
    if (images.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setImgIndex((prev) => (prev + 1) % images.length)
      }, 3000)
    }
  }

  const colorOption = product.options?.find(
    (opt: any) => opt.title.toLowerCase() === "color"
  )
  const colors: ColorOption[] =
    colorOption?.values?.map((v: any) => {
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
        case "indigo":
          bgClass = "bg-indigo-500"
          break
        case "teal":
          bgClass = "bg-teal-500"
          break
        case "cyan":
          bgClass = "bg-cyan-500"
          break
        case "lime":
          bgClass = "bg-lime-500"
          break
        case "emerald":
          bgClass = "bg-emerald-500"
          break
        case "sky":
          bgClass = "bg-sky-500"
          break
        case "violet":
          bgClass = "bg-violet-500"
          break
        case "fuchsia":
          bgClass = "bg-fuchsia-500"
          break
        case "rose":
          bgClass = "bg-rose-500"
          break
        case "amber":
          bgClass = "bg-amber-500"
          break
        case "brown":
          bgClass = "bg-amber-700"
          break
        case "gray":
        case "grey":
          bgClass = "bg-gray-500"
          break
        case "navy":
          bgClass = "bg-blue-900"
          break
        case "maroon":
          bgClass = "bg-red-900"
          break
        case "olive":
          bgClass = "bg-yellow-700"
          break
        case "silver":
          bgClass = "bg-gray-300"
          break
        case "gold":
          bgClass = "bg-yellow-500"
          break
        case "beige":
          bgClass = "bg-amber-100"
          break
        case "cream":
          bgClass = "bg-yellow-50"
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
  const variantSizes =
    product.variants?.map((v: any) => {
      const sizeOpt = v?.options?.find((o: any) =>
        product?.options
          ?.find((opt: any) => opt?.title?.toLowerCase() === "size")
          ?.values?.some((val: any) => val.value === o.value)
      )
      return sizeOpt?.value
    }) || []
  const sizes = [...new Set(variantSizes)].filter(Boolean) as string[]
  const [selectedColor, setSelectedColor] = useState(colors[0]?.id)
  const [selectedSize, setSelectedSize] = useState(sizes[0])

  const selectedVariant =
    product.variants?.find((v: any) => {
      const colorLabel = colors.find((c) => c.id === selectedColor)?.label
      const hasColor =
        colors.length > 0
          ? v.options?.some((o: any) => o.value === colorLabel)
          : true
      const hasSize =
        sizes.length > 0
          ? v.options?.some((o: any) => o.value === selectedSize)
          : true
      return hasColor && hasSize
    }) || product.variants?.[0]

  const price = selectedVariant?.calculated_price?.calculated_amount ?? 0
  const originalPrice =
    selectedVariant?.calculated_price?.original_amount ?? price
  const discountPercent =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0
  const currency =
    selectedVariant?.calculated_price?.currency_code?.toUpperCase() ?? "INR"

  const handleAddToCart = async () => {
    if (!selectedVariant) return cartToast.showErrorToast("Variant unavailable")
    try {
      await useCartStore.getState().add(selectedVariant.id, 1)
      cartToast.showCartToast()
    } catch {
      cartToast.showErrorToast()
    }
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex justify-between items-center p-3 border-b border-gray-100 bg-white z-10 sticky top-0">
        <button
          onClick={onToggleMode}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <motion.div
            animate={{ rotate: isFullScreen ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <MdOutlineKeyboardArrowUp size={28} />
          </motion.div>
        </button>

        <div className="flex-1 mx-3 min-w-0">
          <h1 className="text-sm font-medium text-gray-800 truncate text-center">
            {product.title}
          </h1>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <button className="w-9 h-9 flex items-center justify-center bg-gray-50 rounded-full text-gray-600 flex-shrink-0">
            <FaRegBookmark size={14} />
          </button>
          <button className="w-9 h-9 flex items-center justify-center bg-gray-50 rounded-full text-gray-600 flex-shrink-0">
            <IoShareOutline size={18} />
          </button>
        </div>
      </div>

      <motion.div
        ref={scrollRef}
        className={`flex-1 overflow-x-hidden ${
          isFullScreen ? "overflow-y-auto" : "overflow-y-hidden"
        }`}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-full bg-gray-200 py-4 relative flex justify-center">
          {images.length > 1 ? (
            <div className="relative w-[250px] md:w-[296px] overflow-hidden rounded-2xl">
              <motion.div
                className="relative w-full h-[264px] md:h-[320px]"
                drag={isFullScreen ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (!isFullScreen) return
                  const threshold = 50
                  if (info.offset.x > threshold && imgIndex > 0) {
                    handleManualImageChange(imgIndex - 1)
                  } else if (
                    info.offset.x < -threshold &&
                    imgIndex < images.length - 1
                  ) {
                    handleManualImageChange(imgIndex + 1)
                  }
                }}
              >
                <motion.div
                  className="flex absolute"
                  style={{ width: `${images.length * 100}%` }}
                  animate={{ x: `-${(imgIndex * 100) / images.length}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {images.map((img: string, i: number) => (
                    <div
                      key={i}
                      className="relative flex-shrink-0"
                      style={{ width: `${100 / images.length}%` }}
                    >
                      <div className="h-[264px] md:h-[320px] relative">
                        <Image
                          src={img || "/images/not-available/not-available.png"}
                          alt={`${product.title} - Image ${i + 1}`}
                          fill
                          className="object-cover"
                          draggable={false}
                        />
                      </div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              <div className="flex justify-center gap-2 py-3">
                {images.map((_: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => handleManualImageChange(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === imgIndex ? "bg-blue-800 w-4" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="relative w-[250px] md:w-[296px] overflow-hidden rounded-2xl">
                <div className="h-[264px] md:h-[320px] relative">
                  <Image
                    src={images[0] || "/images/not-available/not-available.png"}
                    alt={product.title}
                    fill
                    className="object-cover rounded-2xl"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-3 flex justify-between items-center border-b border-gray-200">
          <div className="text-sm text-blue-600 font-medium">
            <Link
              href={
                (product as any).seller?.handle
                  ? `/sellerpage?seller_handle=${
                      (product as any).seller.handle
                    }`
                  : product.store?.url || "#"
              }
              className="inline-flex items-end text-[14px] leading-[21px] font-medium text-[#425699] hover:underline font-poppins"
            >
              Visit the{" "}
              {(product as any).seller?.name || product.store?.name || "Store"}
            </Link>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-myBlue text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
          >
            ADD
          </button>
        </div>

        {/* Product Info */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs bg-red-600 text-white px-2 py-1 rounded font-semibold">
              #Best Seller
            </span>
            <span className="text-sm font-medium text-blue-600">
              in {product.collection?.title}
            </span>

            {/* Star Rating and Reviews */}
            {ratingSummary && ratingSummary.total_reviews > 0 && (
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className={`w-3 h-3 ${
                        star <= ratingSummary.average_rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-gray-600">
                  ({ratingSummary.total_reviews})
                </span>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-800">
            <span className="font-semibold">
              {product.soldLastMonth || "0"}
            </span>{" "}
            Sold Out in past month
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* Variant Selection */}
        <div className="px-4 py-4 space-y-4">
          {colors.length > 0 && (
            <div>
              <div className="text-base font-normal text-black mb-2">
                Color:{" "}
                <span className="font-semibold">
                  {colors.find((c) => c.id === selectedColor)?.label}
                </span>
              </div>
              <div className="flex gap-3">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c.id)}
                    className={`w-[84px] h-[74px] rounded-lg overflow-hidden flex items-center justify-center ${
                      selectedColor === c.id
                        ? "border-2 border-blue-800"
                        : "border border-gray-300"
                    }`}
                  >
                    <div className={`${c.bg} w-full h-full`} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div>
              <div className="text-base font-normal mb-2 text-gray-800">
                Size:
              </div>
              <div className="flex gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-[50px] h-[40px] rounded-lg flex items-center justify-center text-sm uppercase ${
                      selectedSize === s
                        ? "border-2 border-blue-800 bg-white text-gray-800"
                        : "border border-gray-800 bg-transparent text-gray-800"
                    }`}
                  >
                    {sizeShortMap[s?.toLowerCase()] || s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <hr className="border-gray-300" />

        {/* Price Section */}
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

        {/* Expandable Sections */}
        <div className="px-4 space-y-4 pb-20">
          <details className="py-2" open={isFullScreen}>
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

          <details className="py-2" open={isFullScreen}>
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

          <details className="py-2" open={isFullScreen}>
            <summary className="cursor-pointer font-medium text-lg text-gray-800 flex justify-between items-center">
              <span>Questions & Reviews</span>
              <MdOutlineKeyboardArrowDown />
            </summary>
            <div className="mt-2 text-sm text-gray-600">No reviews yet</div>
          </details>

          <hr className="border-gray-300" />

          <details className="py-2" open={isFullScreen}>
            <summary className="cursor-pointer font-medium text-lg text-gray-800 flex justify-between items-center list-none">
              <Link
                href={
                  (product as any).seller?.handle
                    ? `/sellerpage?seller_handle=${(product as any).seller.handle}`
                    : product.store?.url || "#"
                }
                className="inline-flex items-center text-[14px] leading-[21px] font-medium text-[#425699] hover:underline"
              >
                <span className="mr-2"><StoreIcon size={16} /></span> 
                Explore all {(product as any).seller?.name || product.store?.name || "Store"} products
              </Link>
            </summary>
          </details>

          <hr className="border-gray-300" />

          {(product as any).categories?.length > 0 && (
            <div className="py-2">
              <SimilarProducts 
                categoryId={(product as any).categories[0]?.id} 
                productId={(product as any)?.id} 
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export function AddVariantSheet({
  product: initialProduct,
  products = [],
  currentProductIndex = 0,
  onClose,
  ratingSummary,
}: AddVariantSheetProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const [viewMode, setViewMode] = useState<"sheet" | "fullscreen">("sheet")
  const [activeIndex, setActiveIndex] = useState(currentProductIndex)
  const [savedScrollPosition, setSavedScrollPosition] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isContentAtTop, setIsContentAtTop] = useState(true)

  const y = useMotionValue(window.innerHeight)
  const backdropOpacity = useMotionValue(0)

  const cardWidth = useMotionValue(85) 
  const cardScale = useTransform(cardWidth, [85, 100], [0.98, 1]) 
  const cardBorderRadius = useTransform(cardWidth, [85, 100], [20, 0]) 

  const activeCardY = useMotionValue(0)
  const fullscreenDragY = useMotionValue(0)
  const overscrollY = useMotionValue(0)

  const sheetPreviewScale = useTransform(fullscreenDragY, [0, 200], [1, 0.9])
  const sheetPreviewBorderRadius = useTransform(
    fullscreenDragY,
    [0, 200],
    [0, 16]
  )

  
  const combinedScale = useTransform(
    [cardScale, sheetPreviewScale],
    ([card, preview]) => (card as number) * (preview as number)
  )
  const combinedBorderRadius = useTransform(
    [cardBorderRadius, sheetPreviewBorderRadius],
    ([card, preview]) => Math.max(card as number, preview as number)
  )

  const activeProducts = products.length > 0 ? products : [initialProduct]

  useEffect(() => {
    const springConfig = {
      type: "spring" as const,
      stiffness: 400,
      damping: 35,
    }
    animate(y, 0, springConfig)
    animate(backdropOpacity, 1, { duration: 0.25, ease: "easeOut" })

    // Set initial active index
    setActiveIndex(currentProductIndex)

    
    if (scrollRef.current && products.length > 0) {
      requestAnimationFrame(() => {
        const container = scrollRef.current
        if (container) {
          const card = container.children[currentProductIndex] as HTMLElement
          if (card) {
            const offset = card.offsetLeft - 16
            container.scrollTo({ left: offset, behavior: "instant" })
          }
        }
      })
    }

    // Cleanup timeouts on unmount
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      if (scrollEndTimeoutRef.current) {
        clearTimeout(scrollEndTimeoutRef.current)
      }
    }
  }, [currentProductIndex, products.length, y, backdropOpacity])

  const smoothClose = () => {
    if (isTransitioning) return
    setIsTransitioning(true)

    animate(backdropOpacity, 0, { duration: 0.2, ease: "easeIn" })
    animate(y, window.innerHeight, {
      type: "spring",
      stiffness: 300,
      damping: 30,
      onComplete: onClose,
    })
  }

  const goToFullscreen = () => {
    if (isTransitioning) return
    setIsTransitioning(true)

    // Reset drag positions
    activeCardY.set(0)
    fullscreenDragY.set(0)

    if (scrollRef.current) {
      setSavedScrollPosition(scrollRef.current.scrollLeft)
    }

    setViewMode("fullscreen")

    // Optimized spring animations for native feel
    const springConfig = {
      type: "spring" as const,
      stiffness: 500,
      damping: 40,
      mass: 0.8,
    }

    // Coordinate animations with proper timing
    Promise.all([
      animate(y, 0, springConfig),
      animate(cardWidth, 100, springConfig),
    ]).then(() => {
      setIsTransitioning(false)
    })
  }

  const goToSheet = () => {
    if (isTransitioning) return
    setIsTransitioning(true)

    // Reset drag positions
    activeCardY.set(0)
    fullscreenDragY.set(0)

    // Optimized spring animations for native feel
    const springConfig = {
      type: "spring" as const,
      stiffness: 500,
      damping: 40,
      mass: 0.8,
    }

    // Start animations first, then change view mode
    Promise.all([
      animate(y, 0, springConfig),
      animate(cardWidth, 85, springConfig), // 85vw for main card
    ]).then(() => {
      setViewMode("sheet")
      
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          const container = scrollRef.current
          const card = container.children[activeIndex] as HTMLElement
          if (card) {
            const offset = card.offsetLeft - 16 
            container.scrollLeft = offset
          }
        }
      })
      
      setIsTransitioning(false)
    })
  }

  const handleScrollChange = (atTop: boolean) => {
    setIsContentAtTop(atTop)
  }

  // Track which card is currently active (horizontal scroll)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const scrollEndTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const updateActiveIndex = () => {
    if (!scrollRef.current || viewMode === "fullscreen") return

    const container = scrollRef.current
    const containerCenter = container.scrollLeft + container.clientWidth / 2

    let closestIndex = 0
    let closestDistance = Infinity

    // Only check actual product cards, not spacer
    for (let i = 0; i < activeProducts.length; i++) {
      const element = container.children[i] as HTMLElement
      if (!element) continue

      const elementCenter = element.offsetLeft + element.clientWidth / 2
      const distance = Math.abs(containerCenter - elementCenter)

      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = i
      }
    }

   
    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex)
      
    }
  }

  const handleHorizontalScroll = () => {
    if (!scrollRef.current || viewMode === "fullscreen") return

    setIsScrolling(true)

    updateActiveIndex()

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    if (scrollEndTimeoutRef.current) {
      clearTimeout(scrollEndTimeoutRef.current)
    }

    scrollEndTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false)
      updateActiveIndex()
    }, 150)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm will-change-opacity"
        style={{ opacity: backdropOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={smoothClose}
      >
        <motion.div
          style={{ y }}
          drag={viewMode === "sheet" ? "y" : false}
          dragElastic={false}
          dragMomentum={false}
          onDrag={(_, info) => {
            if (info.offset.y < 0) {
              y.set(0)
            }
          }}
          onDragEnd={(_, { offset, velocity }) => {
            // Prevent interactions during transitions
            if (isTransitioning) {
              animate(y, 0, { type: "spring", stiffness: 400, damping: 35 })
              return
            }

            // Sheet Mode: Dragging Up → go fullscreen, Dragging Down → close
            if (viewMode === "sheet") {
              // Don't allow mode change if currently scrolling horizontally
              if (isScrolling) {
                animate(y, 0, { type: "spring", stiffness: 400, damping: 35 })
                return
              }

              // More responsive thresholds for native feel
              if (offset.y < -40 || velocity.y < -300) {
                
                goToFullscreen()
                return
              }
              if (offset.y > 80 || velocity.y > 250) {
                smoothClose()
                return
              }
              // Reset position with optimized spring
              animate(y, 0, { type: "spring", stiffness: 400, damping: 35 })
            }
          }}
          onClick={(e) => e.stopPropagation()}
          className={`absolute bottom-0 w-full touch-none will-change-transform ${
            viewMode === "fullscreen" ? "h-screen" : "h-[95vh] md:h-[90vh]"
          }`}
        >
          {/* Drag Handle Indicator */}
          <div className="absolute -top-12 w-full flex justify-center pointer-events-none">
            <motion.div
              className="w-12 h-1.5 bg-white/60 rounded-full mb-4"
              animate={{
                width: viewMode === "fullscreen" ? 0 : 48,
                opacity: viewMode === "fullscreen" ? 0 : 0.5,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </div>

          <div
            ref={scrollRef}
            onScroll={handleHorizontalScroll}
            className={`flex h-full w-full overflow-y-hidden snap-x snap-mandatory pb-0 no-scrollbar items-end md:items-center will-change-scroll ${
              viewMode === "fullscreen"
                ? "overflow-x-hidden justify-center"
                : activeProducts.length === 1
                ? "overflow-x-hidden justify-center"
                : "overflow-x-auto pl-4 gap-2 touch-pan-x md:pl-[calc(50vw-200px)] md:pr-[calc(50vw-200px)]"
            }`}
          >
            {viewMode === "fullscreen" ? (
              // Fullscreen: Show only active card with optimized transforms
              <motion.div
                key={`fullscreen-${
                  activeProducts[activeIndex]?.id || activeIndex
                }`}
                layoutId={`product-${
                  activeProducts[activeIndex]?.id || activeIndex
                }`}
                layout
                style={{
                  scale: combinedScale,
                  borderRadius: combinedBorderRadius,
                  width: "100vw",
                }}
                transition={{
                  layout: {
                    type: "spring",
                    stiffness: 500,
                    damping: 40,
                    mass: 0.8,
                  },
                }}
                className="relative flex-shrink-0 h-full md:h-[800px] snap-center bg-white overflow-hidden shadow-2xl will-change-transform"
                drag={isContentAtTop ? "y" : false}
                dragElastic={false}
                dragMomentum={false}
                onDrag={(_, info) => {
                  const dragY = Math.max(0, info.offset.y)
                  fullscreenDragY.set(dragY)

                  // Prevent dragging above initial position
                  if (info.offset.y < 0) {
                    fullscreenDragY.set(0)
                  }
                }}
                onDragEnd={(_, { offset, velocity }) => {
                  if (offset.y > 80 || velocity.y > 250) {
                    animate(fullscreenDragY, 0, {
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                      mass: 0.8,
                      onComplete: () => {
                        goToSheet()
                      }
                    })
                  } else {
                    // Snap back to fullscreen
                    animate(fullscreenDragY, 0, {
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                      mass: 0.8,
                    })
                  }
                }}
              >
                <ProductCardInternal
                  product={activeProducts[activeIndex] || activeProducts[0]}
                  onClose={smoothClose}
                  isFullScreen={true}
                  onScrollChange={handleScrollChange}
                  onOverscrollUp={goToSheet}
                  overscrollY={overscrollY}
                  ratingSummary={ratingSummary}
                  onToggleMode={goToSheet}
                />
              </motion.div>
            ) : (
              activeProducts.map((prod, idx) => (
                <motion.div
                  key={prod.id || idx}
                  layout
                  style={{
                    scale: cardScale,
                    borderRadius: cardBorderRadius,
                    width: "85vw", 
                 }}
                  transition={{
                    layout: {
                      type: "spring",
                      stiffness: 500,
                      damping: 40,
                      mass: 0.8,
                    },
                  }}
                  className="relative flex-shrink-0 h-full md:h-[800px] snap-center bg-white overflow-hidden shadow-2xl will-change-transform"
                >
                  <ProductCardInternal
                    product={prod}
                    onClose={smoothClose}
                    isFullScreen={false}
                    onScrollChange={handleScrollChange}
                    ratingSummary={ratingSummary}
                    onToggleMode={goToFullscreen}
                  />
                </motion.div>
              ))
            )}
            {viewMode === "sheet" && <div className="w-1 flex-shrink-0" />}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export { AddVariantSheet as AddVariantModal }
