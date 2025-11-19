"use client"

import Link from "next/link"
import Image from "next/image"
import { StarRating } from "@/components/atoms"
import { HttpTypes } from "@medusajs/types"

export const ProductCard = ({
  api_product,
}: {
  api_product: HttpTypes.StoreProduct | null
}) => {
  // Return nothing if no product
  if (!api_product || !api_product.variants?.[0]) return null

  const variant = api_product.variants[0]

  // Medusa v2+ price calculation
  const calculatedPrice = variant.calculated_price

  if (!calculatedPrice) {
    return <div>Price not available</div>
  }

  const price = Number(calculatedPrice.calculated_amount)
  const originalPrice = Number(calculatedPrice.original_amount)
  const currency = calculatedPrice.currency_code?.toUpperCase() ?? "USD"

  const hasDiscount = originalPrice > price
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  // Fallback product image
  const productImage =
    api_product?.images?.[0]?.url || "/images/product/wireless-headphone.jpg"

  return (
    <div className="w-full max-w-md mx-auto flex flex-row md:flex-col gap-3">
      <div className="w-[45%] md:w-full flex-shrink-0">
          <Image
  src={productImage}
  alt={api_product.title}
  width={196}
  height={300}
  className={`rounded-sm
  object-contain md:object-cover 
  bg-[#e5e5e5] 
  border border-[#999999]
  ${hasDiscount ? "h-[319px]" : "h-[300px]"}
  w-[196px] md:w-full`}
/>
      </div>

    
      <div className="w-[55%] md:w-full flex flex-col justify-between h-full">
        {/* Top Info Section */}
        <div className="flex flex-col gap-1">
          {/* Product Title */}
          <Link
            href={`/products/${api_product.id}`}
            className="block hover:underline"
          >
            <h2 className="text-[clamp(14px,2vw,18px)] font-normal text-[#111111]">
              {api_product.title}
            </h2>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1 flex-nowrap text-[clamp(10px,1.2vw,14px)]">
            <span className="font-bold text-[#222222]">4.5</span>
            <StarRating rate={4.5} starSize={12} />
            <span className="text-[#777777] text-[clamp(10px,1.2vw,14px)]">
              (15 reviews)
            </span>
          </div>

          <p className="text-[clamp(10px,1vw,12px)] font-normal text-[#777777]">
            4K+ bought last month
          </p>

          {/* Price Section */}
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
        </div>

        {/* Add to Cart Button */}
        <button className="w-[175px] h-[30px] lg:w-auto lg:h-auto mt-3 bg-[#3002FC] hover:bg-blue-700 active:bg-blue-800 text-[#FFFFFF] flex items-center justify-center gap-2 py-2 rounded-lg text-[clamp(12px,1.5vw,16px)] font-medium">
          <img src="/images/icons/cart.png" className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  )
}
