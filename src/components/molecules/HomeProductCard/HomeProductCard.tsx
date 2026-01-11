'use client'

import Image from "next/image"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { AddVariantSheet } from "../AddVariantModal/AddVariantModal"
import { HttpTypes } from "@medusajs/types"
import { motion } from "framer-motion"
import { useCartStore } from "@/store/useCartStore"
import { useInventoryStore } from "@/store/useInventoryStore"
import { cartToast } from "@/lib/cart-toast"
import { getStockDisplayInfo } from "@/lib/helpers/stock-display"
import { useInventorySync } from "@/hooks/useInventorySync"
import { StarRating } from "@/components/atoms/StarRating/StarRating"
import { SimpleRatingSummary } from "@/types/reviews"



interface HomeProductCardProps {
    api_product: HttpTypes.StoreProduct
    className?: string
    hasOfferSticker?: boolean
    allProducts?: HttpTypes.StoreProduct[]
    productIndex?: number
    ratingSummary?: SimpleRatingSummary
}

export const HomeProductCard = ({
    api_product,
    className,
    hasOfferSticker = false,
    allProducts = [],
    productIndex = 0,
    ratingSummary
}: HomeProductCardProps) => {
    // console.log("HomeProductCard product: ", api_product );

    const [showModal, setShowModal] = useState(false)
    const [cardPos, setCardPos] = useState({ top: 0, left: 0, width: 0, height: 0 })
    const [isAddingToCart, setIsAddingToCart] = useState(false)
    const [currentModalProductIndex, setCurrentModalProductIndex] = useState(productIndex)
    const [isHydrated, setIsHydrated] = useState(false)
    const addToCart = useCartStore((state) => state.add)
    const { getAdjustedInventory } = useInventoryStore()

    // Sync inventory with cart state on component mount and navigation
    useInventorySync()

    // Handle hydration
    useEffect(() => {
        setIsHydrated(true)
    }, [])

    // --- Extract fields from the Medusa product ---
    const title = api_product.title
    const description = api_product.description

    const imageUrl = api_product.images?.[0]?.url || "/images/not-available/not-available.png"

    const currentPrice =
        api_product?.variants?.[0]?.calculated_price?.calculated_amount ?? 0

    // Calculate original total inventory
    // Handle different inventory data structures (top products vs regular products)
    const originalTotalInventory = api_product?.variants?.reduce(
        (sum, variant) => {
            // Try direct inventory_quantity first (regular products)
            if (variant.inventory_quantity !== undefined) {
                return sum + (variant.inventory_quantity || 0)
            }
            
            // Try nested inventory structure (top products API)
            const inventoryItem = (variant as any).inventory_items?.[0]
            if (inventoryItem?.inventory?.location_levels) {
                // Sum up available_quantity from all location levels
                const totalFromLocations = inventoryItem.inventory.location_levels.reduce(
                    (locationSum: number, locationLevel: any) => {
                        return locationSum + (locationLevel.available_quantity || 0)
                    },
                    0
                )
                return sum + totalFromLocations
            }
            
            return sum
        },
        0
    ) || 0

    // Use hydration-safe inventory calculation
    const totalInventory = isHydrated 
        ? api_product?.variants?.reduce(
            (sum, variant) => {
                // Try direct inventory_quantity first (regular products)
                let originalInventory = 0
                if (variant.inventory_quantity !== undefined) {
                    originalInventory = variant.inventory_quantity || 0
                } else {
                    // Try nested inventory structure (top products API)
                    const inventoryItem = (variant as any).inventory_items?.[0]
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
                
                const adjustedInventory = getAdjustedInventory(variant.id, originalInventory)
                return sum + adjustedInventory
            },
            0
          ) || 0
        : originalTotalInventory

    // Get dynamic stock display information
    const stockInfo = getStockDisplayInfo(totalInventory)


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
        if (isAddingToCart || !api_product.variants?.[0]?.id || totalInventory <= 0) return

        setIsAddingToCart(true)
        try {
            await addToCart(api_product.variants[0].id, 1)
            
            // Inventory is now handled in the cart store
            
            cartToast.showCartToast()
        } catch (error) {
            cartToast.showErrorToast()
            console.error("Add to cart error:", error)
        } finally {
            setIsAddingToCart(false)
        }
    }

    return (
        <div
            className={cn(
                "w-[180px] bg-[#F7F7FF] rounded-lg h-[100%] max-h-[350px] overflow-hidden shadow-sm",
                className
            )}
        >
            <motion.div
                onClick={handleOpenModal}
                whileTap={{ scale: 0.95, opacity: 0.8 }}
                whileHover={{ scale: 1.02 }}
                className="w-full h-[45%] relative cursor-pointer"
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

            <div className="p-3 flex flex-col justify-between h-[55%]">
                <div className="flex flex-col">
                    <p
                        onClick={handleOpenModal}
                        className="text-[12px] font-medium min-h-[32px] line-clamp-2 cursor-pointer hover:underline"
                        style={{ color: "#32425A" }}
                    >
                        {title}
                    </p>

                    <div className="flex items-center gap-x-2 mt-1">
                        <span className="text-[12px] font-semibold" style={{ color: "#2C49E0" }}>
                            Rs. {currentPrice}
                        </span>
                    </div>

                    {ratingSummary && ratingSummary.total_reviews > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                            <StarRating rate={ratingSummary.average_rating} starSize={12} />
                            <span className="text-[9px] text-gray-500">
                                ({ratingSummary.total_reviews})
                            </span>
                        </div>
                    )}

                    <p
                        className="text-[9px] max-h-[32px] leading-snug mt-1 line-clamp-2"
                        style={{ color: "#768397" }}
                    >
                        {description}
                    </p>

                    {stockInfo.showWarning && (
                        <p className="text-[9px] font-medium mt-1" style={{ color: stockInfo.textColor }}>
                            {stockInfo.message}
                        </p>
                    )}
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className={`flex items-center justify-center mt-auto text-[12px] text-white py-2 px-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed
            ${isAddingToCart || totalInventory <= 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-myBlue hover:bg-blue-700 active:bg-blue-800"
                        } text-[#FFFFFF]`}
                >
                    <Image src="/images/icons/cart.png" alt="Home Product Card logo" className="w-4 h-4 mr-2" height={14} width={14} />
                    {isAddingToCart ? "Adding..." : (totalInventory <= 0 ? "Out of Stock" : "Add to Cart")}
                </button>

                {showModal && (
                    <AddVariantSheet
                        product={allProducts.length > 0 ? allProducts[currentModalProductIndex] : api_product}
                        cardPos={cardPos}
                        onClose={() => setShowModal(false)}
                        products={allProducts.length > 0 ? allProducts : [api_product]}
                        currentProductIndex={currentModalProductIndex}
                        onProductChange={(newIndex) => setCurrentModalProductIndex(newIndex)}
                        ratingSummary={ratingSummary}
                    />
                )}
            </div>
        </div>
    )
}
