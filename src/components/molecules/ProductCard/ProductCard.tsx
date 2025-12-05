"use client"

import Image from "next/image"
import { StarRating } from "@/components/atoms"
import { HttpTypes } from "@medusajs/types"
import { useCartStore } from "@/store/useCartStore"
import { toast, Toaster } from "react-hot-toast"
import { useState, useRef } from "react"
import { AddVariantSheet } from "../AddVariantModal/AddVariantModal"
import { RatingSummary } from "@/types/reviews"
import { motion } from "framer-motion"


interface AddVariantSheetProps {
  product: HttpTypes.StoreProduct
}

export const ProductCard = ({
  api_product,
  locale,
  ratingSummary = { average_rating: 0, total_reviews: 0 },
}: {
  api_product: HttpTypes.StoreProduct | null
  locale: string
  ratingSummary?: RatingSummary
}) => {
  const [showModal, setShowModal] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [cardPos, setCardPos] = useState({ top: 0, left: 0, width: 0, height: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const addToCart = useCartStore((state) => state.add)

  if (!api_product || !api_product.variants?.[0]) return null

  const variant = api_product.variants[0]
  const calculatedPrice = variant.calculated_price
  if (!calculatedPrice) return <div>Price not available</div>

  const price = Number(calculatedPrice.calculated_amount)
  const originalPrice = Number(calculatedPrice.original_amount)
  const currency = calculatedPrice.currency_code?.toUpperCase() ?? "USD"

  const hasDiscount = originalPrice > price
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  const productImage =
    api_product?.images?.[0]?.url || "/images/not-available/not-available.png"

  const { average_rating, total_reviews } = ratingSummary

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isAddingToCart || !variant.id) return

    setIsAddingToCart(true)
    try {
      await addToCart(variant.id, 1)
      toast.success("Added to cart!")
    } catch (error) {
      toast.error("Failed to add to cart")
      console.error("Add to cart error:", error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleOpenModal = (e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    setCardPos({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    })
    setShowModal(true)
  }

  return (
    <div ref={cardRef} className="w-full max-w-md mx-auto flex flex-row md:flex-col gap-3 relative">
      <Toaster position="top-right" reverseOrder={false} />

      <motion.div
        className="w-[45%] md:w-full flex-shrink-0 cursor-pointer"
        onClick={handleOpenModal}
        whileTap={{ scale: 0.95, opacity: 0.8 }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <Image
          src={productImage}
          alt={api_product.title}
          width={196}
          height={300}
          className={`rounded-sm object-contain md:object-cover bg-[#F8F8F8] border border-[#999999]
            ${hasDiscount ? "h-[319px]" : "h-[300px]"}
            w-[196px]
             md:w-full`}
        />
      </motion.div>

      <div className="w-[55%] md:w-full flex flex-col justify-between h-full">
        <div className="flex flex-col gap-1">
          <h2
            onClick={handleOpenModal}
            className="text-[clamp(14px,2vw,18px)] font-normal text-[#111111] cursor-pointer hover:underline"
          >
            {api_product.title}
          </h2>

          {total_reviews > 0 ? (
            <div className="flex items-center gap-1">
              <span className="font-bold text-[#222222]">
                {average_rating.toFixed(1)}
              </span>

              <StarRating rate={average_rating} starSize={12} />

              <span className="text-[#777777] text-[clamp(10px,1.2vw,14px)]">
                ({total_reviews} {total_reviews === 1 ? "review" : "reviews"})
              </span>
            </div>
          ) : (
            <span className="text-[#777777] text-[clamp(10px,1.2vw,14px)]">
              No reviews yet
            </span>
          )}

          <p className="text-[clamp(10px,1vw,12px)] font-normal text-[#777777]">
            {ratingSummary.last_month_sales
              ? `${ratingSummary.last_month_sales}+ bought last month`
              : ""}
          </p>

          <div className="flex items-start gap-2 mt-2">
            <p className="flex gap-1 items-start">
              <span className="font-normal text-[clamp(12px,1.5vw,16px)] text-[#111111] leading-none">
                {currency}
              </span>
              <span className="font-medium text-[clamp(32px,6vw,40px)] text-[#111111] leading-none">
                {price}
              </span>
            </p>

            {hasDiscount && (
              <p className="text-[clamp(12px,1.5vw,16px)] font-medium text-[#777777] line-through mt-2">
                {currency} {originalPrice}
              </p>
            )}
          </div>

          {hasDiscount && (
            <div className="w-[83px] h-[32px] bg-[#F80000] text-white text-[clamp(12px,1.5vw,16px)] font-medium rounded flex items-center justify-center mt-1">
              {discountPercent}% off
            </div>
          )}
        </div>

        <p className="text-sm font-bold mt-1 flex items-center">
          <span className="bg-green-100 text-[clamp(10px,1vw,12px)] font-medium text-[#008000] rounded">
            Savings
          </span>
          <span className="text-[#777777] text-[clamp(10px,1vw,12px)] font-normal ml-2">
            Buy one, get one free
          </span>
        </p>

        <p className="text-[clamp(10px,1vw,12px)] font-normal text-[#FF0000] mt-1">
          Only 4 left in stock — order soon
        </p>

        <p className="text-[clamp(10px,1vw,12px)] font-normal mt-1">
          FREE delivery on <strong>Sat, 27 Sept</strong> for members
        </p>

        <motion.button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          className={`w-[175px] h-[30px] lg:w-auto lg:h-auto mt-3 flex items-center justify-center gap-2 py-2 rounded-lg text-[clamp(12px,1.5vw,16px)] font-medium
            ${isAddingToCart
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#3002FC] hover:bg-blue-700 active:bg-blue-800"
            } text-[#FFFFFF]`}
        >
          <Image
            src="/images/icons/cart.png"
            alt="Add to cart logo"
            className="w-4 h-4"
            width={16}
            height={16}
          />
          {isAddingToCart ? "Adding..." : "Add to Cart"}
        </motion.button>

        {showModal && (
          <AddVariantSheet
            product={api_product}
            ratingSummary={ratingSummary}
            cardPos={cardPos}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  )
}
