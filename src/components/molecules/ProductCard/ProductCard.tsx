
'use client'

import Link from "next/link"
import { CartIcon } from '@/icons'
import Image from 'next/image'
// import { ShoppingCart } from 'lucide-react'

export const ProductCard = ({
}: {
    }) => {
    return (
        <div className="w-full max-w-md mx-auto    flex flex-row md:flex-col gap-3">
            {/* Image Section */}
            <div className="w-[45%] md:w-full flex-shrink-0">
                <Image
                    src="/images/product/wireless-headphone.jpg"
                    alt="Product"
                    width={500}
                    height={500}
                    className="rounded-xl object-cover w-full h-full  md:max-h-64"
                />
            </div>

            {/* Info Section */}
            <div className="w-[55%] md:w-full flex flex-col justify-between">
                <div>
                    {/* Title */}

                    {/* Title */}
                    <Link href={`/items/1`} className="block hover:underline">
                        <h2 className="text-[16px] md:text-lg font-bold line-clamp-3">
                            Premium Wireless Headphones with Noise Cancellation | 42 Hour Battery Life
                        </h2>
                    </Link>


                    {/* Rating */}
                    <div className="flex items-center gap-1 mt-1">
                        {Array(5)
                            .fill(0)
                            .map((_, i) => (
                                <span key={i} className="text-yellow-400 ">★</span>
                            ))}
                        <span className="text-xs text-gray-500 ml-1"><span className="font-bold text-gray-700">4.5</span> (315 reviews)</span>
                    </div>

                    {/* Small Grey Line */}
                    <p className="text-xs text-gray-400 mt-0.5">
                        4K+ bought last month
                    </p>

                    {/* Price */}
                    <p className="text-xl md:text-xl font-extrabold mt-2"><span className="text-sm  relative"><span className=" ">NRs</span></span> 2000</p>

                    {/* Savings */}
                    <p className="text-sm text-green-600 font-medium mt-1">
                        Save 20% • Buy one get one free
                    </p>

                    {/* Stock Warning */}
                    <p className="text-md text-[#f80707] mt-1">
                        Only 3 left in stock — order soon
                    </p>

                    {/* Delivery Info */}
                    <p className="text-xs text-gray-600 mt-1">
                        FREE delivery on Saturday for first 5 buyers
                    </p>
                </div>

                {/* Add to Cart Button */}
                <button className="mt-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium">
                    <CartIcon size={16} color='#FFF' />
                    Add to Cart
                </button>
            </div>
        </div>
    )
}
