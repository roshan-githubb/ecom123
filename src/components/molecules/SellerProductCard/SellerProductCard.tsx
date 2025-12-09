"use client"

import Image from "next/image"

interface SellerProductCardProps {
    imageSrc: string
    title: string
    weight: string
    rating: number
    reviewCount: number
    discount: number
    price: number
    mrp: number
    saveBadge?: number
    isSoldOut?: boolean
    deliveryTime?: string
}

export const SellerProductCard = ({
    imageSrc,
    title,
    weight,
    rating,
    reviewCount,
    discount,
    price,
    mrp,
    saveBadge,
    isSoldOut = false,
    deliveryTime = "15 MINS",
}: SellerProductCardProps) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden relative flex flex-col">
            <div className="relative w-full aspect-square">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-contain p-2"
                />

                {saveBadge && (
                    <div className="absolute top-2 left-2 bg-[#D32F2F] text-white text-[10px] font-semibold px-2 py-1 rounded">
                        Save ₹{saveBadge}
                    </div>
                )}

                {/* Sold Out Overlay */}
                {isSoldOut && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <span className="bg-white text-[#666666] text-xs font-semibold px-3 py-1 rounded">
                            SOLD OUT
                        </span>
                    </div>
                )}
            </div>


            <div className="p-2 flex flex-col gap-1 flex-grow">
                
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded-full border-2 border-green-600 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    </div>
                    <span className="text-xs text-gray-700 font-medium">{weight}</span>
                </div>

        
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                    {title}
                </h3>

                <div className="flex items-center gap-1">
                    <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <svg
                                key={i}
                                className={`w-3 h-3 ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
                                    }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                        ))}
                    </div>
                    <span className="text-[10px] text-gray-600">({reviewCount.toLocaleString()})</span>
                </div>

 
                <div className="bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-semibold px-2 py-0.5 rounded inline-block self-start">
                    {deliveryTime}
                </div>

                
                <div className="text-xs font-semibold text-green-700">
                    {discount}% OFF
                </div>

            
                <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold text-gray-900">₹{price}</span>
                    <span className="text-xs text-gray-500 line-through">MRP ₹{mrp}</span>
                </div>

            
                <button
                    className={`mt-2 w-full py-1.5 text-xs font-semibold rounded border ${isSoldOut
                            ? "bg-white text-gray-600 border-gray-400"
                            : "bg-white text-green-700 border-green-700"
                        }`}
                >
                    {isSoldOut ? "Notify" : "ADD"}
                </button>
            </div>
        </div>
    )
}
