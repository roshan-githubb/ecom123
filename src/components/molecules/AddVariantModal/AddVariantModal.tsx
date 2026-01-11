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
import { useInventoryStore } from "@/store/useInventoryStore"
import { useInventorySync } from "@/hooks/useInventorySync"
import { Review, SimpleRatingSummary } from "@/types/reviews"
import { HttpTypes } from "@medusajs/types"
import { useParams } from "next/navigation"
import { StoreIcon } from "lucide-react"
import SimilarProducts from "../SimilarProducts/SimilarProduct"
import { StarRating } from "@/components/atoms"

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
  ratingSummary?: SimpleRatingSummary
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
  ratingSummary?: SimpleRatingSummary
  onToggleMode?: () => void
  locale?: string
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [imgIndex, setImgIndex] = useState(0)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const [isAtTop, setIsAtTop] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)
  const [reviews, setReviews] = useState<any[]>([])
  const [loadingReviews, setLoadingReviews] = useState(false)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  // Questions functionality state
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [questionText, setQuestionText] = useState('')
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [questions, setQuestions] = useState<any[]>([])
  const [questionsPage, setQuestionsPage] = useState(1)
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const questionsPerPage = 5

  // Reply functionality state
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)
  const [expandedThreads, setExpandedThreads] = useState<Set<number>>(new Set())
  
  const { getAdjustedInventory } = useInventoryStore()
  
  // Sync inventory with cart state
  useInventorySync()

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Fetch reviews when product changes
  useEffect(() => {
    if (product?.id && isFullScreen) {
      setLoadingReviews(true)
      import('@/lib/data/reviews').then(({ getProductReviews }) => {
        getProductReviews(product.id, 10, 0)
          .then(response => {
            const reviews = response?.data?.reviews || []
            setReviews(reviews)
          })
          .catch(error => {
            console.error('Failed to fetch reviews:', error)
            setReviews([])
          })
          .finally(() => {
            setLoadingReviews(false)
          })
      })
    }
  }, [product?.id, isFullScreen])

  // Check if user is logged in (simplified client-side check)
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Simple demo: assume user is logged in if there's any auth-related cookie or localStorage
        // In a real app, you'd check for a valid JWT token or session
        const hasAuthCookie = document.cookie.includes('connect.sid') || 
                             document.cookie.includes('session') ||
                             document.cookie.includes('auth')
        const hasAuthStorage = localStorage.getItem('user') || 
                              localStorage.getItem('token') ||
                              localStorage.getItem('session')
        
        // For demo purposes, let's assume user is logged in 50% of the time randomly
        // Replace this with your actual auth check
        setIsLoggedIn(!!(hasAuthCookie || hasAuthStorage || Math.random() > 0.5))
      } catch (error) {
        // If localStorage is not available (SSR), default to false
        setIsLoggedIn(false)
      }
    }
    checkAuth()
  }, [])

  // Load mock questions data with threaded conversations
  useEffect(() => {
    if (product?.id && isFullScreen) {
      setLoadingQuestions(true)
      // Mock threaded questions data - replace with actual API call
      setTimeout(() => {
        const mockQuestions = [
          {
            id: 1,
            question: "What sizes are available for this product?",
            askedBy: "John D.",
            askedAt: "2024-01-05T10:30:00Z",
            answer: "We have sizes S, M, L, XL, and XXL available. Please check the size chart for detailed measurements.",
            answeredBy: "Vendor",
            answeredAt: "2024-01-05T14:20:00Z",
            replies: [
              {
                id: 11,
                text: "Thanks! Is the sizing true to size or should I size up?",
                author: "John D.",
                createdAt: "2024-01-05T15:30:00Z",
                isVendor: false
              },
              {
                id: 12,
                text: "I'd recommend going with your normal size. The fit is pretty accurate to the size chart.",
                author: "Vendor",
                createdAt: "2024-01-05T16:45:00Z",
                isVendor: true
              },
              {
                id: 13,
                text: "I bought this last month and went with my normal size - fits perfectly!",
                author: "Lisa K.",
                createdAt: "2024-01-05T18:20:00Z",
                isVendor: false
              }
            ]
          },
          {
            id: 2,
            question: "Is this product suitable for outdoor activities?",
            askedBy: "Sarah M.",
            askedAt: "2024-01-04T16:45:00Z",
            answer: "Yes, this product is designed for outdoor use and is water-resistant. However, it's not completely waterproof.",
            answeredBy: "Vendor",
            answeredAt: "2024-01-04T18:30:00Z",
            replies: [
              {
                id: 21,
                text: "What about heavy rain? Will it hold up?",
                author: "Sarah M.",
                createdAt: "2024-01-04T19:15:00Z",
                isVendor: false
              },
              {
                id: 22,
                text: "For light rain it's fine, but for heavy downpours I'd recommend a proper rain jacket over it.",
                author: "Vendor",
                createdAt: "2024-01-04T20:30:00Z",
                isVendor: true
              },
              {
                id: 23,
                text: "I've used it hiking in light rain and it worked great! Very comfortable.",
                author: "Mike T.",
                createdAt: "2024-01-04T21:45:00Z",
                isVendor: false
              }
            ]
          },
          {
            id: 3,
            question: "What is the material composition?",
            askedBy: "Mike R.",
            askedAt: "2024-01-03T09:15:00Z",
            answer: "This product is made from 80% cotton and 20% polyester blend for comfort and durability.",
            answeredBy: "Vendor",
            answeredAt: "2024-01-03T11:45:00Z",
            replies: []
          },
          {
            id: 4,
            question: "How long does shipping usually take?",
            askedBy: "Emma L.",
            askedAt: "2024-01-02T14:20:00Z",
            answer: "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days.",
            answeredBy: "Vendor",
            answeredAt: "2024-01-02T16:10:00Z",
            replies: [
              {
                id: 41,
                text: "Do you ship internationally?",
                author: "Emma L.",
                createdAt: "2024-01-02T17:30:00Z",
                isVendor: false
              },
              {
                id: 42,
                text: "Yes! International shipping takes 7-14 business days depending on location.",
                author: "Vendor",
                createdAt: "2024-01-02T18:45:00Z",
                isVendor: true
              }
            ]
          },
          {
            id: 5,
            question: "Can I return this if it doesn't fit?",
            askedBy: "Alex K.",
            askedAt: "2024-01-01T12:00:00Z",
            answer: "Yes, we offer a 30-day return policy for unused items in original packaging.",
            answeredBy: "Vendor",
            answeredAt: "2024-01-01T15:30:00Z",
            replies: [
              {
                id: 51,
                text: "What about return shipping costs?",
                author: "Alex K.",
                createdAt: "2024-01-01T16:45:00Z",
                isVendor: false
              },
              {
                id: 52,
                text: "Return shipping is free for defective items, otherwise customer pays return shipping.",
                author: "Vendor",
                createdAt: "2024-01-01T17:30:00Z",
                isVendor: true
              },
              {
                id: 53,
                text: "That's fair! Most places charge for returns.",
                author: "Jenny P.",
                createdAt: "2024-01-01T18:15:00Z",
                isVendor: false
              }
            ]
          },
          {
            id: 6,
            question: "Is there a warranty on this product?",
            askedBy: "Lisa P.",
            askedAt: "2023-12-30T11:30:00Z",
            answer: "Yes, this product comes with a 1-year manufacturer warranty against defects.",
            answeredBy: "Vendor",
            answeredAt: "2023-12-30T13:45:00Z",
            replies: []
          }
        ]
        setQuestions(mockQuestions)
        setLoadingQuestions(false)
      }, 500)
    }
  }, [product?.id, isFullScreen])

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

  // Question handling functions
  const handleAskSeller = () => {
    if (!isLoggedIn) {
      alert('Please log in to ask a question')
      return
    }
    setShowQuestionForm(true)
  }

  const handleSubmitQuestion = async () => {
    if (!questionText.trim()) {
      alert('Please enter your question')
      return
    }

    setIsSubmittingQuestion(true)
    try {
      // TODO: Replace with actual API call to submit question
      // await submitQuestion(product.id, questionText)
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Add the new question to the list (mock behavior)
      const newQuestion = {
        id: questions.length + 1,
        question: questionText,
        askedBy: "You",
        askedAt: new Date().toISOString(),
        answer: null,
        answeredBy: null,
        answeredAt: null,
        replies: [] // Initialize empty replies array
      }
      setQuestions([newQuestion, ...questions])
      
      alert('Question submitted successfully! The vendor will respond soon.')
      setQuestionText('')
      setShowQuestionForm(false)
    } catch (error) {
      alert('Failed to submit question. Please try again.')
    } finally {
      setIsSubmittingQuestion(false)
    }
  }

  const handleCancelQuestion = () => {
    setQuestionText('')
    setShowQuestionForm(false)
  }

  // Reply handling functions
  const handleReplyToQuestion = (questionId: number) => {
    if (!isLoggedIn) {
      alert('Please log in to reply')
      return
    }
    setReplyingTo(questionId)
    setReplyText('')
  }

  const handleSubmitReply = async (questionId: number) => {
    if (!replyText.trim()) {
      alert('Please enter your reply')
      return
    }

    setIsSubmittingReply(true)
    try {
      // TODO: Replace with actual API call to submit reply
      // await submitReply(questionId, replyText)
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Add the new reply to the question thread (mock behavior)
      const newReply = {
        id: Date.now(), // Simple ID for demo
        text: replyText,
        author: "You",
        createdAt: new Date().toISOString(),
        isVendor: false // In real app, check if current user is vendor
      }
      
      setQuestions(prevQuestions => 
        prevQuestions.map(q => 
          q.id === questionId 
            ? { ...q, replies: [...(q.replies || []), newReply] }
            : q
        )
      )
      
      // Expand the thread to show the new reply
      setExpandedThreads(prev => new Set([...prev, questionId]))
      
      alert('Reply posted successfully!')
      setReplyText('')
      setReplyingTo(null)
    } catch (error) {
      alert('Failed to post reply. Please try again.')
    } finally {
      setIsSubmittingReply(false)
    }
  }

  const handleCancelReply = () => {
    setReplyText('')
    setReplyingTo(null)
  }

  const toggleThread = (questionId: number) => {
    setExpandedThreads(prev => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
      }
      return newSet
    })
  }

  // Pagination for questions
  const totalQuestionsPages = Math.ceil(questions.length / questionsPerPage)
  const paginatedQuestions = questions.slice(
    (questionsPage - 1) * questionsPerPage,
    questionsPage * questionsPerPage
  )

  const handleQuestionsPageChange = (page: number) => {
    setQuestionsPage(page)
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

  // Calculate inventory for selected variant
  const getVariantInventory = (variant: any) => {
    if (!variant) return 0
    
    // Try direct inventory_quantity first (regular products)
    let originalInventory = 0
    if (variant.inventory_quantity !== undefined) {
      originalInventory = variant.inventory_quantity || 0
    } else {
      // Try nested inventory structure (top products API)
      const inventoryItem = variant.inventory_items?.[0]
      if (inventoryItem?.inventory?.location_levels) {
        // Sum up available_quantity from all location levels
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
    selectedVariant?.calculated_price?.currency_code?.toUpperCase() ?? "INR"

  const handleAddToCart = async () => {
    if (!selectedVariant || isSelectedVariantOutOfStock) {
      if (isSelectedVariantOutOfStock) {
        return // Do nothing for out of stock items
      }
      return cartToast.showErrorToast("Variant unavailable")
    }
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
            disabled={isSelectedVariantOutOfStock}
            className={`px-6 py-2 rounded-lg font-medium transition-colors shadow-md ${
              isSelectedVariantOutOfStock
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-myBlue text-white hover:bg-blue-700"
            }`}
          >
            ADD
          </button>
        </div>

        {/* Product Info */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className={`flex items-center mb-2 ${isFullScreen? 'gap-2': 'gap-0'}`}>
            <span className="text-xs bg-red-600 text-white px-2 py-1 rounded font-semibold flex-shrink-0">
              #Best Seller
            </span>
            <div className={`flex ${isFullScreen? 'gap-16':'gap-4'}`}>
            <span className="text-xs ml-1 font-medium text-blue-600 min-w-0 truncate flex-1">
              in {product.collection?.title}
            </span>
            <div className="flex ml-6 flex-shrink-0">
            {ratingSummary && ratingSummary.total_reviews > 0 && (
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  <StarRating rate={ratingSummary.average_rating} starSize={12} />
                </div>
                <span className="text-xs text-gray-600">
                  ({ratingSummary.total_reviews})
                </span>
              </div>
              
            )}
            </div>
            </div>
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
              <span>Questions & Reviews ({questions.length + reviews.length})</span>
              <MdOutlineKeyboardArrowDown />
            </summary>
            <div className="mt-4 space-y-6">
              
              {/* Questions Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 text-sm">QnA ({questions.length})</h3>
                  {isLoggedIn && !showQuestionForm && (
                    <button
                      onClick={handleAskSeller}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Ask Seller
                    </button>
                  )}
                </div>

                {!isLoggedIn && (
                  <div className="bg-gray-50 rounded-lg p-4 text-center mb-4">
                    <p className="text-gray-600 text-sm mb-2">Want to ask a question about this product?</p>
                    <button className="text-blue-600 font-medium text-sm hover:underline">
                      Log in to ask seller
                    </button>
                  </div>
                )}

                {showQuestionForm && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Question
                      </label>
                      <textarea
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        placeholder="Ask anything about this product - size, material, shipping, etc."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        rows={3}
                        maxLength={500}
                      />
                      <div className="text-right text-xs text-gray-500 mt-1">
                        {questionText.length}/500 characters
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={handleSubmitQuestion}
                        disabled={isSubmittingQuestion || !questionText.trim()}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        {isSubmittingQuestion ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Submitting...
                          </div>
                        ) : (
                          'Submit Question'
                        )}
                      </button>
                      <button
                        onClick={handleCancelQuestion}
                        disabled={isSubmittingQuestion}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Questions List */}
                {loadingQuestions ? (
                  <div className="text-sm text-gray-600">Loading questions...</div>
                ) : questions.length > 0 ? (
                  <div className="space-y-4">
                    {paginatedQuestions.map((question) => (
                      <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800 font-medium mb-1">{question.question}</p>
                            <p className="text-xs text-gray-500 mb-3">
                              Asked by {question.askedBy} • {new Date(question.askedAt).toLocaleDateString()}
                            </p>
                            
                            {question.answer ? (
                              <div className="bg-green-50 border-green-400 p-3 mb-3">
                                <div className="flex items-start gap-2">
                                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-800">{question.answer}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Answered by {question.answeredBy} • {new Date(question.answeredAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-3">
                                <p className="text-sm text-yellow-800">Waiting for seller response...</p>
                              </div>
                            )}

                            {/* Thread Actions */}
                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                              {question.replies && question.replies.length > 0 && (
                                <button
                                  onClick={() => toggleThread(question.id)}
                                  className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                  </svg>
                                  {expandedThreads.has(question.id) ? 'Hide' : 'Show'} {question.replies.length} {question.replies.length === 1 ? 'reply' : 'replies'}
                                </button>
                              )}
                              
                              {isLoggedIn && (
                                <button
                                  onClick={() => handleReplyToQuestion(question.id)}
                                  className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                  </svg>
                                  Reply
                                </button>
                              )}
                            </div>

                            {/* Threaded Replies */}
                            {question.replies && question.replies.length > 0 && expandedThreads.has(question.id) && (
                              <div className="ml-4 border-l-2 border-gray-200 pl-4 space-y-3">
                                {question.replies.map((reply: any) => (
                                  <div key={reply.id} className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-start gap-2">
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        reply.isVendor ? 'bg-green-100' : 'bg-blue-100'
                                      }`}>
                                        {reply.isVendor ? (
                                          <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                          </svg>
                                        ) : (
                                          <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                          </svg>
                                        )}
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className={`text-xs font-medium ${
                                            reply.isVendor ? 'text-green-700' : 'text-gray-700'
                                          }`}>
                                            {reply.author}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            {new Date(reply.createdAt).toLocaleDateString()}
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-800">{reply.text}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Reply Form */}
                            {replyingTo === question.id && (
                              <div className="ml-4 mt-3 bg-gray-50 rounded-lg p-3">
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Your Reply
                                    </label>
                                    <textarea
                                      value={replyText}
                                      onChange={(e) => setReplyText(e.target.value)}
                                      placeholder="Join the conversation..."
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                      rows={2}
                                      maxLength={300}
                                    />
                                    <div className="text-right text-xs text-gray-500 mt-1">
                                      {replyText.length}/300 characters
                                    </div>
                                  </div>
                                  
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleSubmitReply(question.id)}
                                      disabled={isSubmittingReply || !replyText.trim()}
                                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                      {isSubmittingReply ? (
                                        <div className="flex items-center gap-2">
                                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                          Posting...
                                        </div>
                                      ) : (
                                        'Post Reply'
                                      )}
                                    </button>
                                    <button
                                      onClick={handleCancelReply}
                                      disabled={isSubmittingReply}
                                      className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Questions Pagination */}
                    {totalQuestionsPages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-4">
                        <button
                          onClick={() => handleQuestionsPageChange(questionsPage - 1)}
                          disabled={questionsPage === 1}
                          className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        
                        <div className="flex gap-1">
                          {Array.from({ length: totalQuestionsPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => handleQuestionsPageChange(page)}
                              className={`px-3 py-1 text-sm rounded-md ${
                                page === questionsPage
                                  ? 'bg-blue-600 text-white'
                                  : 'border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>
                        
                        <button
                          onClick={() => handleQuestionsPageChange(questionsPage + 1)}
                          disabled={questionsPage === totalQuestionsPages}
                          className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm">No questions yet. Be the first to ask!</p>
                  </div>
                )}
              </div>

              {/* Reviews Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-800 text-sm mb-4">Reviews ({reviews.length})</h3>
                {loadingReviews ? (
                  <div className="text-sm text-gray-600">Loading reviews...</div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <div className="items-center gap-2 mb-2">
                          <div className="flex gap-4">
                          <span className="text-sm font-medium text-gray-900">
                            {review.customer?.first_name} {review.customer?.last_name}
                          </span>
                          <div className="flex mt-1">
                            <StarRating rate={review.rating} starSize={12} />
                          </div>
                          </div>
                          
                        </div>
                        <p className="text-sm text-gray-700">{review.customer_note}</p>
                        <span className="text-xs text-gray-500">
                          Posted on {new Date(review.created_at).toLocaleDateString()}
                          </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <p className="text-sm">No reviews yet. Be the first to review!</p>
                  </div>
                )}
              </div>
            </div>
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
