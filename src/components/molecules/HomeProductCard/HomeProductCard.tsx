import Image from "next/image"
import { cn } from "@/lib/utils"

interface ProductCardProps {
    imageUrl: string
    title: string
    currentPrice: number
    oldPrice?: number
    description: string
    discount?: string
    className?: string
}

export const HomeProductCard = ({
    imageUrl,
    title,
    currentPrice,
    oldPrice,
    description,
    discount,
    className,
}: ProductCardProps) => {
    return (
        <div
            className={cn(
                "w-[180px] bg-[#F7F7FF] rounded-xl border border-gray-200 overflow-hidden shadow-sm h-[100%]",
                className
            )}
        >
            <div className="w-full h-[45%]">
                <Image
                    src={imageUrl}
                    alt={title}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover rounded-t-xl"
                />
            </div>

            <div className="p-3 flex flex-col gap-1">
                <p
                    className="text-[12px] font-medium h-[32px] line-clamp-2"
                    style={{ color: "#32425A" }}
                >
                    {title}
                </p>


                <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold" style={{ color: "#2C49E0" }}>
                        Rs. {currentPrice}
                    </span>

                    {oldPrice && <span
                        className="text-[8px] line-through"
                        style={{ color: "#FF6161" }}
                    >
                        Rs. {oldPrice}
                    </span>}
                </div>

                {discount && <span
                    className="text-[12px] text-white py-[2px] px-2 w-fit rounded-md font-medium"
                    style={{ backgroundColor: "#F9573F" }}
                >
                    {discount}
                </span>}

                <p
                    className="text-[9px] leading-snug mt-1 line-clamp-2"
                    style={{ color: "#768397" }}
                >
                    {description}
                </p>

                <button
                    className="flex items-center justify-center mt-2  text-[12px] text-white py-2 px-3 rounded-md font-medium"
                    style={{ backgroundColor: "#4444FF" }}
                >

                    <img src="/images/icons/cart.png" className="w-4 h-4" />

                    Add to Cart
                </button>
            </div>
        </div>
    )
}
