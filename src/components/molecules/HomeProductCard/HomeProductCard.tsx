'use client'

import Image from "next/image"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { AddVariantSheet } from "../AddVariantModal/AddVariantModal"
import { HttpTypes } from "@medusajs/types"
import { motion } from "framer-motion"
import { useCartStore } from "@/store/useCartStore"
import toast, { Toaster } from "react-hot-toast"



interface HomeProductCardProps {
    api_product: HttpTypes.StoreProduct
    className?: string
    hasOfferSticker?: boolean
    allProducts?: HttpTypes.StoreProduct[]
    productIndex?: number
}

export const HomeProductCard = ({
    api_product,
    className,
    hasOfferSticker = false,
    allProducts = [],
    productIndex = 0
}: HomeProductCardProps) => {

    const [showModal, setShowModal] = useState(false)
    const [cardPos, setCardPos] = useState({ top: 0, left: 0, width: 0, height: 0 })
    const [isAddingToCart, setIsAddingToCart] = useState(false)
    const [currentModalProductIndex, setCurrentModalProductIndex] = useState(productIndex)
    const addToCart = useCartStore((state) => state.add)

    // --- Extract fields from the Medusa product ---
    const id = api_product.id
    const title = api_product.title
    const description = api_product.description

    const imageUrl = api_product.images?.[0]?.url || "/images/not-available/not-available.png"

    const currentPrice =
        api_product?.variants?.[0]?.calculated_price?.calculated_amount ?? 0

    const handleOpenModal = (e: React.MouseEvent) => {
        const target = e.currentTarget as HTMLElement
        const rect = target.getBoundingClientRect()
        setCardPos({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
        })
        setCurrentModalProductIndex(productIndex)
        setShowModal(true)
    }

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (isAddingToCart || !api_product.variants?.[0]?.id) return

        setIsAddingToCart(true)
        try {
            await addToCart(api_product.variants[0].id, 1)
            toast.success("Added to cart!")
        } catch (error) {
            toast.error("Failed to add to cart")
            console.error("Add to cart error:", error)
        } finally {
            setIsAddingToCart(false)
        }
    }

    return (
        <div
            className={cn(
                "w-[180px] bg-[#F7F7FF] rounded-lg h-[100%] overflow-hidden shadow-sm",
                className
            )}
        >
            <motion.div
                className="w-full h-[45%] relative cursor-pointer"
                onClick={handleOpenModal}
                whileTap={{ scale: 0.95, opacity: 0.8 }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
                <Image
                    src={imageUrl}
                    alt={title}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover rounded-t-xl"
                />
                {hasOfferSticker && (
                    <Image
                        src={"/images/product/offer-sticker.png"}
                        alt={"sticker image"}
                        width={300}
                        height={300}
                        className="w-[40px] h-[40px] absolute top-4 left-4 z-20"
                    />
                )}
            </motion.div>

            <div className="p-3 flex flex-col gap-1">
                <p
                    onClick={handleOpenModal}
                    className="text-[12px] font-medium min-h-[32px] line-clamp-2 cursor-pointer hover:underline"
                    style={{ color: "#32425A" }}
                >
                    {title}
                </p>

                <div className="flex items-center gap-x-2">
                    <span className="text-[12px] font-semibold" style={{ color: "#2C49E0" }}>
                        Rs. {currentPrice}
                    </span>
                </div>

                <p
                    className="text-[9px] max-h-[32px] leading-snug mt-1 line-clamp-2"
                    style={{ color: "#768397" }}
                >
                    {description}
                </p>

                <button
                    className="flex items-center justify-center mt-2 text-[12px] text-white py-2 px-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "#4444FF" }}
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                >
                    <Image src="/images/icons/cart.png" alt="Home Product Card logo" className="w-4 h-4 mr-2" height={14} width={14} />
                    {isAddingToCart ? "Adding..." : "Add to Cart"}
                </button>

                {showModal && (
                    <AddVariantSheet
                        product={allProducts.length > 0 ? allProducts[currentModalProductIndex] : api_product}
                        cardPos={cardPos}
                        onClose={() => setShowModal(false)}
                        products={allProducts.length > 0 ? allProducts : [api_product]}
                        currentProductIndex={currentModalProductIndex}
                        onProductChange={(newIndex) => setCurrentModalProductIndex(newIndex)}
                    />
                )}
            </div>
            <Toaster position="top-right" reverseOrder={false} />
        </div>
    )
}
