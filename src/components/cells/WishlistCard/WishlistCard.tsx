import { Button } from "@/components/atoms"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface WishlistCardProps {
  product: {
    id: string
    title: string
    thumbnail: string
    price: string
    rating: number
    reviews: number
    inStock: boolean
    description?: string
  }
}

export const WishlistCard = ({ product }: WishlistCardProps) => {
  return (
    <div
      className={cn(
        "w-full bg-[#F7F7FF] rounded-lg overflow-hidden shadow-sm flex flex-col h-full"
      )}
    >
      <div className="w-full h-[200px] relative">
        <LocalizedClientLink href={`/products/${product.id}`}>
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="w-full h-full object-cover rounded-t-xl"
          />
        </LocalizedClientLink>
      </div>

      <div className="p-3 flex flex-col gap-1 flex-grow justify-between">

        <LocalizedClientLink href={`/products/${product.id}`} className="block hover:underline">
          <p
            className="text-[12px] font-medium min-h-[32px] line-clamp-2"
            style={{ color: "#32425A" }}
          >
            {product.title}
          </p>
        </LocalizedClientLink>

        <div className="flex items-center gap-x-2">
          <span className="text-[12px] font-semibold" style={{ color: "#2C49E0" }}>
            {product.price}
          </span>
        </div>

        <p
          className="text-[9px] max-h-[32px] leading-snug mt-1 line-clamp-2"
          style={{ color: "#768397" }}
        >
          {product.description || "No description available"}
        </p>

        <div className="mt-auto flex flex-col gap-2 pt-2">
          {product.inStock ? (
            <p className="text-[9px] text-green-600">In Stock</p>
          ) : (
            <p className="text-[9px] text-red-600">Out of Stock</p>
          )}
        </div>

        <div className="mt-auto pt-2 flex flex-col gap-2">
    <button className="flex items-center justify-center w-full text-[12px] text-white py-2 px-3 rounded-md font-medium bg-myBlue"
      >
      <Image src="/images/icons/cart.png" alt="Cart" className="w-4 h-4 mr-2" height={16} width={16} />
      Add to Cart
    </button>

    <Button
      variant="tonal"
      className="text-[10px] h-7 px-1 bg-transparent border border-[#E5E7EB] rounded-md text-[#768397]">
      Delete
    </Button>
  </div>
      </div>
    </div>
  )
}
