'use client'

import Image from "next/image"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState } from "react"
import { AddVariantModal } from "../AddVariantModal/AddVariantModal"
import { HttpTypes } from "@medusajs/types"


interface ProductCardProps {
    id: string
    imageUrl: string
    title: string
    currentPrice: number
    oldPrice?: number
    description: string
    discount?: string
    className?: string
    hasOfferSticker?: boolean
}
interface HomeProductCardProps {
  api_product: HttpTypes.StoreProduct   // full Medusa product
  className?: string
  hasOfferSticker?: boolean
}
export const HomeProductCard = ({
  api_product,
  className,
  hasOfferSticker = false
}: HomeProductCardProps) => {

  const [showModal, setShowModal] = useState(false)

  // --- Extract fields from the Medusa product ---
  const id = api_product.id
  const title = api_product.title
  const description = api_product.description

  const imageUrl = api_product.images?.[0]?.url || "/images/not-available.png"

  const currentPrice =
   api_product?.variants?.[0]?.calculated_price?.calculated_amount ?? 0

//   const oldPrice =
//     api_product.prices?.[1]?.amount
//       ? api_product.prices[1].amount / 100
//       : undefined

//   const discount =
//     oldPrice && currentPrice
//       ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
//       : null


    return (
        <div
            className={cn(
                "w-[180px] bg-[#F7F7FF] rounded-lg h-[100%]  overflow-hidden shadow-sm ",
                className
            )}
        >
            <div className="w-full h-[45%] relative">
                <Image
                    src={imageUrl}
                    alt={title}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover rounded-t-xl"
                />
                {hasOfferSticker && (<Image
                    src={"/images/product/offer-sticker.png"}
                    alt={"sticker image"}
                    width={300}
                    height={300}
                    className="w-[40px] h-[40px]  absolute top-4 left-4 z-20 "
                />)}

            </div>

            <div className="p-3 flex flex-col gap-1">
                {/* title */}
                <Link
                    href={`/products/${id}`}
                    className="block hover:underline">
                    <p
                        className="text-[12px] font-medium min-h-[32px] line-clamp-2"
                        style={{ color: "#32425A" }}
                    >
                        {title}
                    </p>
                </Link>


                <div className="flex items-center gap-x-2">
                    <span className="text-[12px] font-semibold" style={{ color: "#2C49E0" }}>
                        Rs. {currentPrice}
                    </span>

                    {/* {oldPrice && <span
                        className="text-[8px] line-through"
                        style={{ color: "#FF6161" }}
                    >
                        Rs. {oldPrice}
                    </span>} */}
                </div>

                {/* {discount && <span
                    className="text-[12px] text-white py-[2px] px-2 w-fit rounded-md font-medium"
                    style={{ backgroundColor: "#F9573F" }}
                >
                    {discount}
                </span>} */}

                <p
                    className="text-[9px] max-h-[32px] leading-snug mt-1 line-clamp-2"
                    style={{ color: "#768397" }}
                >
                    {description}
                </p>

                <button
                    className="flex items-center justify-center mt-2  text-[12px] text-white py-2 px-3 rounded-md font-medium"
                    style={{ backgroundColor: "#4444FF" }}
                    onClick={() => setShowModal(true)}

                >

                    <Image src="/images/icons/cart.png" alt="Home Product Card logo" className="w-4 h-4 mr-2" height={14} width={14} />

                    Add to Cart
                </button>
                {showModal && (
                    <AddVariantModal
                        product={api_product}
                        onClose={() => setShowModal(false)}
                    />
                )}
            </div>
        </div>
    )
}
