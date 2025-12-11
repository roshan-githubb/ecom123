import { useState, useMemo, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion"
import { MdOutlineKeyboardArrowDown, MdClose } from "react-icons/md"
import { FaRegBookmark } from "react-icons/fa"
import { IoShareOutline } from "react-icons/io5"
import { useCartStore } from "@/store/useCartStore"
import toast, { Toaster } from "react-hot-toast"
import { StarRating } from "@/components/atoms"
import { Review } from "@/types/reviews"
import { HttpTypes } from "@medusajs/types"

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
  locale 
}: { 
  product: any
  onClose: () => void
  locale: string 
}) {
  const router = useRouter()
  const [imgIndex, setImgIndex] = useState(0)
  
  const colorOption = product.options?.find(
    (opt: any) => opt.title.toLowerCase() === "color"
  )

  const colors: ColorOption[] = colorOption?.values?.map((v: any) => {
      let bgClass = "bg-gray-200"
      let ringClass = "ring-gray-300"
      switch (v.value.toLowerCase()) {
        case "white": bgClass = "bg-white"; break;
        case "black": bgClass = "bg-black"; break;
        case "red": bgClass = "bg-red-500"; break;
        case "green": bgClass = "bg-green-500"; break;
        case "blue": bgClass = "bg-blue-500"; break;
        default: bgClass = "bg-gray-200"; break;
      }
      return { id: v.id, label: v.value, bg: bgClass, ring: ringClass }
    }) || []

  const sizeShortMap: Record<string, string> = {
    small: "S", medium: "M", large: "L", "extra large": "XL", xl: "XL", l: "L", m: "M", s: "S",
  }

  const variantSizes = product.variants?.map((v: any) => {
      const sizeOpt = v?.options?.find((o: any) =>
        product?.options?.find((opt: any) => opt?.title?.toLowerCase() === "size")
          ?.values?.some((val: any) => val.value === o.value)
      )
      return sizeOpt?.value
    }) || []

  const sizes = [...new Set(variantSizes)].filter(Boolean) as string[]
  const [selectedColor, setSelectedColor] = useState(colors[0]?.id)
  const [selectedSize, setSelectedSize] = useState(sizes[0])

  const images = product.images?.map((img: any) => img.url).filter((url: any) => url) || ["/images/not-available/not-available.png"]

  const selectedVariant = product.variants?.find((v: any) => {
    const colorLabel = colors.find((c) => c.id === selectedColor)?.label
    const sizeLabel = selectedSize
    const hasColor = colors.length > 0 ? v.options?.some((o: any) => o.value === colorLabel) : true
    const hasSize = sizes.length > 0 ? v.options?.some((o: any) => o.value === sizeLabel) : true
    return hasColor && hasSize
  }) || product.variants?.[0]

  const price = selectedVariant?.calculated_price?.calculated_amount ?? 0
  const originalPrice = selectedVariant?.calculated_price?.original_amount ?? price
  const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0
  const currency = selectedVariant?.calculated_price?.currency_code?.toUpperCase() ?? "INR"

  const handleAddToCart = async () => {
    if (!selectedVariant) return toast.error("Variant unavailable")
    try {
      await useCartStore.getState().add(selectedVariant.id, 1)
      toast.success("Added to cart")
    } catch {
      toast.error("Failed to add item")
    }
  }

  const handleBuyNow = async () => {
    if (!selectedVariant) return toast.error("Variant unavailable")
    try {
      await useCartStore.getState().add(selectedVariant.id, 1)
      onClose()
      router.push(`/${locale}/check`)
    } catch {
      toast.error("Failed to add item")
    }
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex justify-between items-center p-3 border-b border-gray-100 bg-white z-10 sticky top-0">
        <button onClick={onClose} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <MdOutlineKeyboardArrowDown size={28} />
        </button>
        <div className="flex gap-2">
          <button className="w-9 h-9 flex items-center justify-center bg-gray-50 rounded-full text-gray-600">
            <FaRegBookmark size={14} />
          </button>
          <button className="w-9 h-9 flex items-center justify-center bg-gray-50 rounded-full text-gray-600">
            <IoShareOutline size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="relative w-full aspect-[4/3] bg-gray-50 flex items-center justify-center p-4">
           <Image
              src={images[imgIndex] || "/images/not-available/not-available.png"}
              alt={product.title}
              fill
              className="object-contain"
              draggable={false}
           />
           {images.length > 1 && (
             <div className="absolute bottom-4 flex gap-1.5">
               {images.map((_: any, i: number) => (
                 <button
                   key={i}
                   onClick={() => setImgIndex(i)}
                   className={`h-1.5 rounded-full transition-all ${i === imgIndex ? "w-4 bg-gray-800" : "w-1.5 bg-gray-300"}`}
                 />
               ))}
             </div>
           )}
        </div>

        <div className="p-4 space-y-5">
           <div>
             <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">8 MINS</span>
             </div>
             <h1 className="text-xl font-bold text-gray-900 leading-tight">{product.title}</h1>
             <div className="text-sm text-gray-500 mt-1">{product.category || product.collection?.title}</div>
           </div>

           {(colors.length > 0 || sizes.length > 0) && (
             <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Select Variant</h3>
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {colors.length > 0 ? (
                    colors.map((c) => (
                       <div 
                         key={c.id}
                         onClick={() => setSelectedColor(c.id)}
                         className={`min-w-[120px] p-3 rounded-xl border relative cursor-pointer ${selectedColor === c.id ? "border-blue-600 bg-blue-50" : "border-gray-200"}`}
                       >
                          {selectedColor === c.id && <div className="absolute top-0 left-0 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-br-lg rounded-tl-lg">SELECTED</div>}
                          <div className={`w-6 h-6 rounded-full border border-gray-300 mb-2 ${c.bg}`} />
                          <div className="text-sm font-bold text-gray-800">{c.label}</div>
                       </div>
                    ))
                  ) : (
                    sizes.map((s) => (
                      <div 
                         key={s}
                         onClick={() => setSelectedSize(s)}
                         className={`min-w-[100px] p-3 rounded-xl border relative cursor-pointer ${selectedSize === s ? "border-blue-600 bg-blue-50" : "border-gray-200"}`}
                       >
                          {selectedSize === s && <div className="absolute top-0 left-0 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-br-lg rounded-tl-lg">SELECTED</div>}
                          <div className="text-sm font-bold text-gray-800 mt-2">{sizeShortMap[s?.toLowerCase()] || s}</div>
                       </div>
                    ))
                  )}
                </div>
             </div>
           )}

           <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center py-3 border-b border-gray-100 cursor-pointer">
                 <span className="font-semibold text-gray-900">Product Details</span>
                 <MdOutlineKeyboardArrowDown />
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100 cursor-pointer">
                 <span className="font-semibold text-gray-900">Nutritional Info</span>
                 <MdOutlineKeyboardArrowDown />
              </div>
           </div>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
         <div className="flex justify-between items-center">
            <div>
               <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Inclusive of all taxes</div>
               <div className="flex items-center gap-2">
                 <span className="text-lg font-bold text-gray-900">{currency}{price}</span>
                 {discountPercent > 0 && <span className="text-xs text-gray-400 line-through">{currency}{originalPrice}</span>}
               </div>
            </div>
            <button 
              onClick={handleAddToCart}
              className="bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-green-200 active:scale-95 transition-transform"
            >
              Add to cart
            </button>
         </div>
      </div>
    </div>
  )
}

export function AddVariantSheet({
  product: initialProduct,
  products = [],
  currentProductIndex = 0,
  onClose,
}: AddVariantSheetProps) {
  const params = useParams()
  const locale = (params?.locale as string) || "en"
  const scrollRef = useRef<HTMLDivElement>(null)
  const y = useMotionValue(window.innerHeight)

  const activeProducts = products.length > 0 ? products : [initialProduct]

  useEffect(() => {
    animate(y, 0, { type: "spring", stiffness: 300, damping: 30 })
    
    if (scrollRef.current && products.length > 0) {
      const container = scrollRef.current
      const card = container.children[currentProductIndex] as HTMLElement
      if (card) {
        // Calculation to center the card with the left padding gap
        const offset = card.offsetLeft - 16
        container.scrollTo({ left: offset, behavior: "instant" })
      }
    }
  }, [currentProductIndex, products.length, y])

  const smoothClose = () => {
    animate(y, window.innerHeight, {
      type: "spring", stiffness: 200, damping: 25,
      onComplete: onClose,
    })
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={smoothClose}
      >
        <motion.div
          style={{ y }}
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-0 w-full h-[95vh] md:h-[90vh]"
        >
          <div className="absolute -top-12 w-full flex justify-center pointer-events-none">
             <button onClick={smoothClose} className="bg-white/10 backdrop-blur-md p-2 rounded-full pointer-events-auto text-white hover:bg-white/20 transition-colors">
                <MdClose size={24} />
             </button>
          </div>

          <div 
             ref={scrollRef}
             className="flex h-full w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory pl-4 gap-4 pb-0 no-scrollbar items-end md:items-center md:pl-[calc(50vw-200px)] md:pr-[calc(50vw-200px)]"
          >
             {activeProducts.map((prod, idx) => (
                <div 
                   key={prod.id || idx}
                   className="relative flex-shrink-0 w-[88vw] md:w-[400px] h-full md:h-[800px] snap-center bg-white rounded-t-2xl md:rounded-2xl overflow-hidden shadow-2xl"
                >
                   <ProductCardInternal 
                      product={prod} 
                      onClose={smoothClose}
                      locale={locale}
                   />
                </div>
             ))}
             <div className="w-1 flex-shrink-0" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export function AddVariantModal(props: AddVariantSheetProps) {
  return <AddVariantSheet {...props} />
}