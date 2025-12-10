import { useState, useMemo, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion"
import { MdOutlineKeyboardArrowUp } from "react-icons/md"
import { FaRegBookmark } from "react-icons/fa"
import { IoShareOutline } from "react-icons/io5"
import { useCartStore } from "@/store/useCartStore"
import toast, { Toaster } from "react-hot-toast"
import { StarRating } from "@/components/atoms"
import { Review } from "@/types/reviews"
import { HttpTypes } from "@medusajs/types"
// import SellerProducts from "../SellerProducts/SellerProducts"

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
  description?: string
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
  product: (Product | HttpTypes.StoreProduct) & {
    store?: { name: string; url: string }
    soldLastMonth?: number
    material?: string | null
  }
  reviews?: Review[]
  ratingSummary?: { average_rating: number; total_reviews: number }
  cardPos: { top: number; left: number; width: number; height: number }
  onClose: () => void
  products?: any[]
  currentProductIndex?: number
  onProductChange?: (index: number) => void
}

export function AddVariantSheet({
  product,
  reviews: initialReviews = [],
  ratingSummary,
  cardPos,
  onClose,
  products = [],
  currentProductIndex = 0,
  onProductChange,
}: AddVariantSheetProps) {
  const router = useRouter()
  const params = useParams()
  const locale = params?.locale || "en"
  const [index, setIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [productIndex, setProductIndex] = useState(currentProductIndex)
  const [direction, setDirection] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const reviews = initialReviews
  const cartItems = useCartStore((state) => state.items)
  const hasCartItems = cartItems.length > 0
  const y = useMotionValue(cardPos.top)
  
  const currentProduct = products.length > 0 ? products[productIndex] : product
  const hasMultipleProducts = products.length > 1

  const smoothClose = useCallback(() => {
    animate(y, window.innerHeight, {
      type: "spring",
      stiffness: 200,
      damping: 25,
      onComplete: onClose,
    })
  }, [y, onClose])

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])



  const paginate = useCallback((newDirection: number) => {
    if (!hasMultipleProducts) return
    
    const newIndex = productIndex + newDirection
    if (newIndex >= 0 && newIndex < products.length) {
      setDirection(newDirection)
      setProductIndex(newIndex)
      setIndex(0)
      onProductChange?.(newIndex)
    }
  }, [productIndex, products.length, hasMultipleProducts, onProductChange])

  const totalReviews = ratingSummary?.total_reviews ?? reviews?.length ?? 0

  const averageRating = useMemo(() => {
    if (ratingSummary?.average_rating) return ratingSummary.average_rating
    if (totalReviews === 0) return 0
    return reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews
  }, [reviews, totalReviews, ratingSummary])

  const colorOption = currentProduct.options?.find(
    (opt: any) => opt.title.toLowerCase() === "color"
  )

  const colors: ColorOption[] =
    colorOption?.values?.map((v: any) => {
      let bgClass = "bg-gray-200"
      let ringClass = "ring-gray-300"

      switch (v.value.toLowerCase()) {
        case "white":
          bgClass = "bg-white"
          ringClass = "ring-gray-300"
          break
        case "black":
          bgClass = "bg-black"
          ringClass = "ring-gray-700"
          break
        case "red":
          bgClass = "bg-red-500"
          ringClass = "ring-red-300"
          break
        case "green":
          bgClass = "bg-green-500"
          ringClass = "ring-green-300"
          break
        case "blue":
          bgClass = "bg-blue-500"
          ringClass = "ring-blue-300"
          break
        case "yellow":
          bgClass = "bg-yellow-400"
          ringClass = "ring-yellow-300"
          break
        case "orange":
          bgClass = "bg-orange-500"
          ringClass = "ring-orange-300"
          break
        case "purple":
          bgClass = "bg-purple-500"
          ringClass = "ring-purple-300"
          break
        case "pink":
          bgClass = "bg-pink-500"
          ringClass = "ring-pink-300"
          break
        case "gray":
        case "grey":
          bgClass = "bg-gray-500"
          ringClass = "ring-gray-300"
          break
        case "brown":
          bgClass = "bg-amber-700"
          ringClass = "ring-amber-400"
          break
        case "cyan":
          bgClass = "bg-cyan-500"
          ringClass = "ring-cyan-300"
          break
        case "teal":
          bgClass = "bg-teal-500"
          ringClass = "ring-teal-300"
          break
        case "indigo":
          bgClass = "bg-indigo-500"
          ringClass = "ring-indigo-300"
          break
        case "lime":
          bgClass = "bg-lime-500"
          ringClass = "ring-lime-300"
          break
        case "amber":
          bgClass = "bg-amber-500"
          ringClass = "ring-amber-300"
          break
        case "violet":
          bgClass = "bg-violet-500"
          ringClass = "ring-violet-300"
          break
        case "rose":
          bgClass = "bg-rose-500"
          ringClass = "ring-rose-300"
          break
        default:
          bgClass = "bg-gray-200"
          ringClass = "ring-gray-300"
          break
      }

      return {
        id: v.id,
        label: v.value,
        bg: bgClass,
        ring: ringClass,
      }
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
    currentProduct.variants?.map((v: any) => {
      const sizeOpt = v?.options?.find((o: any) =>
        currentProduct?.options
          ?.find((opt: any) => opt?.title?.toLowerCase() === "size")
          ?.values?.some((val: any) => val.value === o.value)
      )
      return sizeOpt?.value
    }) || []

  const sizes = [...new Set(variantSizes)].filter(Boolean) as string[]

  const [selectedColor, setSelectedColor] = useState(colors[0]?.id)
  const [selectedSize, setSelectedSize] = useState(sizes[0])

  const images =
    currentProduct.images?.map((img: any) => img.url).filter((url: any) => url) || [
      "/images/not-available/not-available.png",
    ]

  const selectedVariant = currentProduct.variants?.find((v: any) => {
    const colorLabel = colors.find((c) => c.id === selectedColor)?.label
    const sizeLabel = selectedSize
    const hasColor = colors.length > 0
      ? v.options?.some((o: any) => o.value === colorLabel)
      : true
    const hasSize = sizes.length > 0
      ? v.options?.some((o: any) => o.value === sizeLabel)
      : true
    return hasColor && hasSize
  })

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
    if (!selectedVariant) {
      toast.error("Please select a valid variant")
      return
    }
    try {
      await useCartStore.getState().add(selectedVariant.id, 1)
      smoothClose()
    } catch {
      toast.error("Failed to add item")
    }
  }

  const handleBuyNow = async () => {
    if (!selectedVariant) {
      toast.error("Please select a valid variant")
      return
    }
    try {
      await useCartStore.getState().add(selectedVariant.id, 1)
      onClose()
      router.push(`/${locale}/check`)
    } catch {
      toast.error("Failed to add item")
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={smoothClose}
      >
        <motion.div
          className="bg-white absolute rounded-t-2xl shadow-xl flex flex-col overflow-hidden"
          style={{ top: y }}
          initial={{
            top: cardPos.top,
            left: cardPos.left,
            width: cardPos.width,
            height: cardPos.height,
            borderRadius: 15,
          }}
          animate={{
            top: isExpanded ? 0 : window.innerHeight * 0.25,
            left: 0,
            width: "100%",
            height: isExpanded ? "100%" : window.innerHeight * 0.75,
            borderRadius: isExpanded ? 0 : 20,
          }}
          exit={{
            top: cardPos.top,
            left: cardPos.left,
            width: cardPos.width,
            height: cardPos.height,
            borderRadius: 15,
          }}
          transition={{ type: "spring", stiffness: 230, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            className="flex justify-center pt-2 cursor-grab active:cursor-grabbing"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.3}
            onDragEnd={(e, info) => {
              if (info.offset.y > 80) {
                if (isExpanded) setIsExpanded(false)
                else smoothClose()
              } else if (info.offset.y < -50 && !isExpanded) {
                setIsExpanded(true)
              }
            }}
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </motion.div>

          <div className="flex justify-between items-center pt-2 px-4 pb-1">
            <h3
              onClick={() => {
                if (isExpanded) smoothClose()
                else setIsExpanded(true)
              }}
              className="font-bold text-lg cursor-pointer"
            >
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.25 }}
              >
                <MdOutlineKeyboardArrowUp size={28} />
              </motion.div>
            </h3>
            <div className="flex gap-2">
              <button className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full">
                <FaRegBookmark />
              </button>
              <button className="px-3 py-1 h-8 rounded">
                <IoShareOutline size={22} />
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col relative">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={productIndex}
                initial={{ x: direction > 0 ? "100%" : "-100%", opacity: 0, scale: 0.95 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 }
                }}
                className="absolute inset-0 flex flex-col"
              >
                <div
                  ref={contentRef}
                  className={`flex-1 ${isExpanded ? "overflow-y-auto" : "overflow-hidden"}`}
                  onTouchStart={(e) => {
                    const content = contentRef.current
                    if (!content) return
                    
                    const touch = e.touches[0]
                    const startX = touch.clientX
                    const startY = touch.clientY
                    const startTime = Date.now()
                    const isAtTop = content.scrollTop === 0
                    let swipeDirection: 'horizontal' | 'vertical' | null = null
                    let isDraggingDown = false

                    const handleTouchMove = (e: TouchEvent) => {
                      const touch = e.touches[0]
                      const deltaX = touch.clientX - startX
                      const deltaY = touch.clientY - startY
                      
                      if (!swipeDirection && (Math.abs(deltaX) > 15 || Math.abs(deltaY) > 15)) {
                        swipeDirection = Math.abs(deltaX) > Math.abs(deltaY) * 1.5 ? 'horizontal' : 'vertical'
                      }

                      if (swipeDirection === 'vertical' && isAtTop) {
                        isDraggingDown = true
                        if (deltaY > 80) {
                          if (isExpanded) {
                            setIsExpanded(false)
                          } else {
                            smoothClose()
                          }
                          isDraggingDown = false
                        } else if (deltaY < -60 && !isExpanded) {
                          setIsExpanded(true)
                          isDraggingDown = false
                        }
                      }
                    }

                    const handleTouchEnd = (e: TouchEvent) => {
                      const touch = e.changedTouches[0]
                      const deltaX = touch.clientX - startX
                      const deltaTime = Date.now() - startTime
                      
                      if (hasMultipleProducts && swipeDirection === 'horizontal' && Math.abs(deltaX) > 80 && deltaTime < 300) {
                        if (deltaX < 0) {
                          paginate(1) 
                        } else {
                          paginate(-1) 
                        }
                      }
                      
                      document.removeEventListener('touchmove', handleTouchMove)
                      document.removeEventListener('touchend', handleTouchEnd)
                    }

                    document.addEventListener('touchmove', handleTouchMove, { passive: true })
                    document.addEventListener('touchend', handleTouchEnd)
                  }}
                >
                  <main className="pb-1">
              <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{ duration: 3000 }}
              />

              <section className="w-full bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto pt-1 pb-4 px-4">
                  <div className="flex items-center justify-between gap-3">
                    <Link
                      href={
                        (currentProduct as any).seller?.handle
                          ? `/${locale}/sellerpage?seller_handle=${(currentProduct as any).seller.handle}`
                          : (currentProduct.store?.url || "#")
                      }
                      className="inline-flex items-end text-[14px] leading-[21px] font-medium text-[#425699] hover:underline font-poppins"
                    >
                      Visit the {(currentProduct as any).seller?.name || currentProduct.store?.name || "Store"}
                    </Link>
                    {totalReviews > 0 && (
                      <div className="flex items-center gap-3">
                        <StarRating rate={averageRating} starSize={22} />
                        <div className="text-sm font-medium text-[#222222]">
                          {averageRating.toFixed(1)}{" "}
                          <span className="text-gray-500 ml-1">({totalReviews})</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-2">
                    <div className="flex-1">
                      <h1 className="text-sm font-medium leading-[21px] text-[#666666] flex items-end">
                        {currentProduct.title}
                      </h1>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-sm bg-[#F80000] text-white px-2 py-1 rounded-sm font-semibold">
                          #Best Seller
                        </span>
                        <span className="text-md font-medium mt-1 text-contentBlue">
                          in {currentProduct?.collection?.title}
                        </span>
                      </div>
                      <div className="mt-2 text-[#222222] text-sm">
                        <span className="font-semibold">
                          {currentProduct.soldLastMonth || "0"}
                        </span>{" "}
                        Sold Out in past month
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="max-w-4xl mx-auto pb-6 space-y-6 px-4">
                <div className="w-screen relative left-1/2 right-1/2 -translate-x-1/2 bg-[#D9D9D9] lg:bg-white flex justify-center py-4">
                  <div className="relative w-[220px] sm:w-[250px] md:w-[284px] lg:w-[296px] overflow-hidden rounded-[16px]">
                    <div className="h-[232px] sm:h-[264px] md:h-[296px] lg:h-[320px]">
                      <div className="w-full h-full">
                        <Image
                          src={images[index] || "/images/not-available/not-available.png"}
                          alt={`${currentProduct.title} image ${index + 1}`}
                          width={296}
                          height={320}
                          className="object-cover w-full h-full rounded-[16px]"
                          draggable={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {images.length > 1 && (
                  <div className="mt-4 flex items-center justify-center gap-2">
                    {images.map((_: any, i: number) => (
                      <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === index ? "bg-blue-800 w-4" : "bg-gray-300"
                          }`}
                        aria-label={`View image ${i + 1}`}
                      />
                    ))}
                  </div>
                )}

                <hr className="block lg:hidden -mx-4 w-screen border-t border-gray-300 mt-3" />
                <hr className="hidden lg:block border-t border-gray-300 mt-3" />

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {colors.length > 0 && (
                    <div>
                      <div className="text-[16px] font-normal text-black mb-2">
                        Color:{" "}
                        <span className="font-semibold text-[16px] text-black">
                          {colors.find((c) => c.id === selectedColor)?.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {colors.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => setSelectedColor(c.id)}
                            className={`w-[84px] h-[74px] rounded-[8px] overflow-hidden flex items-center justify-center ${selectedColor === c.id
                              ? "border-2 border-[#1A315A]"
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
                      <div className="text-base font-normal mb-2 text-[#222222]">
                        Size:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {sizes.map((s, i) => {
                          const shortLabel = sizeShortMap[s?.toLowerCase() ?? ""] || s
                          return (
                            <button
                              key={`${s}-${i}`}
                              onClick={() => setSelectedSize(s)}
                              className={`w-[50px] h-[40px] px-2 py-2 rounded-[8px] flex items-center justify-center text-sm uppercase tracking-wide ${selectedSize === s
                                ? "border-2 border-[#1A315A] bg-white shadow text-[#333333]"
                                : "border border-[#333333] bg-transparent text-[#333333]"
                                }`}
                            >
                              {shortLabel}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <hr className="block lg:hidden -mx-4 w-screen border-t border-gray-300 mt-3" />
                <hr className="hidden lg:block border-t border-gray-300 mt-3" />

                <div className="mt-3 flex flex-col gap-1">
                  {discountPercent > 0 && (
                    <div className="bg-[#F80000] text-white px-3 py-1.5 rounded-sm text-sm font-semibold w-fit">
                      {discountPercent}% OFF + Cash on Delivery
                    </div>
                  )}
                  <div className="flex items-center pt-1">
                    {discountPercent > 0 && (
                      <div className="pr-2 py-0.5 text-[32px] text-[#F80000] rounded-md font-medium">
                        -{discountPercent}%
                      </div>
                    )}
                    <div className="px-2 rounded-md text-xs font-semibold flex items-baseline gap-1">
                      <span className="text-[14px] leading-none self-start">{currency}</span>
                      <span className="text-[32px] font-medium leading-none">{price}</span>
                    </div>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="text-normal font-base text-gray-600">
                        M.R.P.: <span className="line-through">{currency} {originalPrice}</span>
                      </div>
                      <div className="bg-[#EAEFFF] text-[#307345] text-base font-medium">
                        Save {currency} {originalPrice - price}
                      </div>
                    </div>
                  )}
                </div>

                <hr className="block lg:hidden -mx-4 w-screen border-t border-gray-300 mt-3" />
                <hr className="hidden lg:block border-t border-gray-300 mt-3" />

                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-[18px] text-[#222222] flex justify-between items-center list-none">
                    <span>Product Details</span>
                    <Image src="/images/icons/arrow.png" alt="arrow" width={16} height={16} />
                  </summary>
                  <div>
                    <table className="w-full font-semibold text-[16px] text-[#222222] text-left">
                      <tbody>
                        <tr>
                          <td className="py-2 w-40">Material</td>
                          <td className="py-2 font-normal text-[16px]">
                            {currentProduct?.material || "Not given"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2">Fit</td>
                          <td className="py-2 font-normal text-[16px]">Regular</td>
                        </tr>
                        <tr>
                          <td className="py-2">Care</td>
                          <td className="py-2 font-normal text-[16px]">Machine wash cold</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </details>

                <hr className="block lg:hidden -mx-4 w-screen border-t border-gray-300 mt-3" />
                <hr className="hidden lg:block border-t border-gray-300 mt-3" />

                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-[18px] text-[#222222] flex justify-between items-center list-none">
                    <span>Product Description</span>
                    <Image src="/images/icons/arrow.png" alt="arrow" width={16} height={16} />
                  </summary>

                  <div className="mt-2">
                    <p className="text-[16px] font-normal text-[#222222] leading-relaxed">
                      {product?.description}
                    </p>
                  </div>
                </details>

                <hr className="block lg:hidden -mx-4 w-screen border-t border-gray-300 mt-3" />
                <hr className="hidden lg:block border-t border-gray-300 mt-3" />


                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-[18px] text-[#222222] flex justify-between items-center list-none">
                    <span>Product Specification</span>
                    <Image src="/images/icons/arrow.png" alt="arrow" width={16} height={16} />
                  </summary>
                  <div>
                    <table className="w-full font-semibold text-[16px] text-[#222222] text-left">
                      <tbody>
                        <tr>
                          <td className="py-2 w-40">Brand</td>
                          <td className="py-2 font-normal text-[16px]">Puma</td>
                        </tr>
                        <tr>
                          <td className="py-2 w-40">Model</td>
                          <td className="py-2 font-normal text-[16px]">TSH-1234</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </details>

                <hr className="block lg:hidden -mx-4 w-screen border-t border-gray-300 mt-3" />
                <hr className="hidden lg:block border-t border-gray-300 mt-3" />

                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-[18px] text-[#222222] flex justify-between items-center list-none">
                    <span>Questions & Reviews</span>
                    <Image
                      src="/images/icons/arrow.png"
                      alt="arrow"
                      width={16}
                      height={16}
                      className="transition-transform duration-300 group-open:rotate-180"
                    />
                  </summary>
                  <div className="space-y-3">
                    {totalReviews > 0 ? (
                      <div className="flex items-center gap-2">
                        <StarRating rate={averageRating} starSize={18} />
                        <span className="text-[14px] text-[#222222] font-medium">
                          {averageRating.toFixed(1)} out of 5
                        </span>
                        <span className="text-[12px] font-normal ml-1">
                          ({totalReviews.toLocaleString()} review{totalReviews !== 1 ? "s" : ""})
                        </span>
                      </div>
                    ) : (
                      <span className="text-[12px] font-normal">No reviews yet</span>
                    )}
                    <div>
                      <p className="text-[14px] text-[#222222] font-medium">Customers say</p>
                      {totalReviews > 0 && reviews[0]?.customer_note ? (
                        <span className="text-[14px] font-normal text-[#666666]">
                          &quot;{reviews[0].customer_note}&quot;
                        </span>
                      ) : (
                        <span className="text-[14px] font-normal text-[#666666]">
                          &quot;No reviews yet.&quot;
                        </span>
                      )}
                    </div>
                    {reviews.map((review) => (
                      <div key={review.id} className="rounded-md space-y-2">
                        <div className="flex items-center gap-3">
                          <Image
                            src="/images/users/john-doe.jpg"
                            alt="Reviewer"
                            width={24}
                            height={24}
                            className="w-6 h-6 rounded-full object-cover"
                            quality={80}
                          />
                          <div className="flex flex-col">
                            <span className="font-medium text-[14px] text-[#222222]">
                              {review.customer.first_name} {review.customer.last_name}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <StarRating rate={review.rating} starSize={15} />
                          <span className="text-[10px] font-normal text-[#FA6308]">
                            Verified Purchase
                          </span>
                        </div>
                        <div className="text-[14px] font-medium text-[#222222]">
                          {review.customer_note}
                        </div>
                        <div className="text-[10px] font-normal text-[#888888] mt-1">
                          Reviewed on {new Date(review.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              </section>
             {/* <SellerProducts sellerId={(product as any).seller?.id} /> */}

              <div className={`w-full px-4 pt-6 ${hasCartItems ? "pb-24" : "pb-4"}`}>
                <div className="flex gap-3">
                  <motion.button
                    onClick={handleAddToCart}
                    whileTap={{ scale: 0.92 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="flex-1 h-[40px] bg-gradient-to-t from-[#3002FC] to-[#3002FC] text-white rounded-[20px] text-sm font-medium flex items-center justify-center gap-2 shadow"
                  >
                    <Image src="/images/icons/cart.png" alt="Cart" width={16} height={16} />
                    Add to cart
                  </motion.button>
                  <motion.button
                    onClick={handleBuyNow}
                    whileTap={{ scale: 0.92 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="flex-1 h-[40px] bg-gradient-to-r from-[#FF4A53] to-[#FFA626] text-white rounded-[20px] text-sm font-medium flex items-center justify-center gap-2 shadow"
                  >
                    Buy now
                  </motion.button>
                </div>
                </div>
              </main>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

interface AddVariantModalProps {
  product: (Product | HttpTypes.StoreProduct) & {
    store?: { name: string; url: string }
    soldLastMonth?: number
    material?: string | null
  }
  reviews?: Review[]
  ratingSummary?: { average_rating: number; total_reviews: number }
  onClose: () => void
}

export function AddVariantModal({
  product,
  reviews,
  ratingSummary,
  onClose,
}: AddVariantModalProps) {
  const defaultCardPos = {
    top: typeof window !== "undefined" ? window.innerHeight / 2 : 400,
    left: typeof window !== "undefined" ? window.innerWidth / 2 : 200,
    width: 200,
    height: 200,
  }

  return (
    <AddVariantSheet
      product={product}
      reviews={reviews}
      ratingSummary={ratingSummary}
      cardPos={defaultCardPos}
      onClose={onClose}
    />
  )
}