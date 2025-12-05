"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useMemo } from "react"
import { StarRating } from "@/components/atoms"
import { useCartStore } from "@/store/useCartStore"
import { Review } from "@/types/reviews"
import toast, { Toaster } from "react-hot-toast"

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
}

interface ColorOption {
  id: string
  label: string
  bg: string
  ring: string
}

export default function ProductDetailClient({
  product,
  reviews,
}: {
  product: Product
  reviews: Review[]
}) {
  const [index, setIndex] = useState(0)

  const averageRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return 0
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  }, [reviews])

  const totalReviews = reviews.length

  const colorOption = product.options?.find(
    (opt) => opt.title.toLowerCase() === "color"
  )
  const colors: ColorOption[] =
    colorOption?.values.map((v) => {
      let bgClass = "bg-gray-200"
      let ringClass = "ring-gray-300"

      switch (v.value.toLowerCase()) {
        case "white":
          bgClass = "bg-white"
          ringClass = "ring-gray-300"
          break
        case "black":
          bgClass = "bg-black"
          ringClass = "ring-gray-700"
          break
        case "red":
          bgClass = "bg-red-500"
          ringClass = "ring-red-300"
          break
        case "green":
          bgClass = "bg-green-500"
          ringClass = "ring-green-300"
          break
        case "blue":
          bgClass = "bg-blue-500"
          ringClass = "ring-blue-300"
          break
        case "yellow":
          bgClass = "bg-yellow-400"
          ringClass = "ring-yellow-300"
          break
        case "orange":
          bgClass = "bg-orange-500"
          ringClass = "ring-orange-300"
          break
        case "purple":
          bgClass = "bg-purple-500"
          ringClass = "ring-purple-300"
          break
        case "pink":
          bgClass = "bg-pink-500"
          ringClass = "ring-pink-300"
          break
        case "gray":
        case "grey":
          bgClass = "bg-gray-500"
          ringClass = "ring-gray-300"
          break
        case "brown":
          bgClass = "bg-amber-700"
          ringClass = "ring-amber-400"
          break
        case "cyan":
          bgClass = "bg-cyan-500"
          ringClass = "ring-cyan-300"
          break
        case "teal":
          bgClass = "bg-teal-500"
          ringClass = "ring-teal-300"
          break
        case "indigo":
          bgClass = "bg-indigo-500"
          ringClass = "ring-indigo-300"
          break
        case "lime":
          bgClass = "bg-lime-500"
          ringClass = "ring-lime-300"
          break
        case "amber":
          bgClass = "bg-amber-500"
          ringClass = "ring-amber-300"
          break
        case "violet":
          bgClass = "bg-violet-500"
          ringClass = "ring-violet-300"
          break
        case "rose":
          bgClass = "bg-rose-500"
          ringClass = "ring-rose-300"
          break
        default:
          bgClass = "bg-gray-200"
          ringClass = "ring-gray-300"
          break
      }

      return { id: v.id, label: v.value, bg: bgClass, ring: ringClass }
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
    product.variants?.map((v) => {
      const sizeOpt = v.options.find((o) =>
        product.options
          ?.find((opt) => opt.title.toLowerCase() === "size")
          ?.values.some((val) => val.value === o.value)
      )
      return sizeOpt?.value
    }) || []

  const sizes = [...new Set(variantSizes)].filter(Boolean)

  const [selectedColor, setSelectedColor] = useState(colors[0]?.id)
  const [selectedSize, setSelectedSize] = useState(sizes[0])
  const images = product.images?.map((img) => img.url).filter((url) => url) || [
    "/images/not-available/not-available.png",
  ]

  const selectedVariant = product.variants?.find((v) => {
    const colorLabel = colors.find((c) => c.id === selectedColor)?.label
    const sizeLabel = selectedSize
    const hasColor =
      colors.length > 0 ? v.options?.some((o) => o.value === colorLabel) : true
    const hasSize =
      sizes.length > 0 ? v.options?.some((o) => o.value === sizeLabel) : true
    return hasColor && hasSize
  })

  const price = selectedVariant?.calculated_price?.calculated_amount ?? 0
  const originalPrice =
    selectedVariant?.calculated_price?.original_amount ?? price
  const discountPercent =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0
  const currency =
    selectedVariant?.calculated_price?.currency_code?.toUpperCase() ?? "NPR"

  const handleAddToCart = async () => {
    const colorLabel = colors.find((c) => c.id === selectedColor)?.label
    const sizeLabel = selectedSize
    const variant = selectedVariant

    if (!variant) {
      toast.error("Please select a valid variant")
      return
    }

    try {
      await useCartStore.getState().add(variant.id, 1)
      toast.success("Item added to cart!")
    } catch (e) {
      toast.error("Failed to add item")
    }
  }

  return (
    <main className="min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />

      <section className="w-full bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto py-4 px-4">
          <div className="flex items-center justify-between gap-3">
            <Link
              href={product.store?.url || "/coming-soon"}
              className="inline-flex mt-2 items-end w-full max-w-[163px] h-[21px] text-[14px] leading-[21px] font-medium text-[#425699] hover:underline font-poppins"
            >
              Visit  {product.store?.name || "Store"}
            </Link>
            {totalReviews > 0 && (
              <div className="flex items-center gap-3">
                <StarRating rate={averageRating} starSize={22} />
                <div className="text-sm font-medium text-[#222222]">
                  {averageRating.toFixed(1)}
                  <span className="text-gray-500 ml-1">({totalReviews})</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-2">
            <div className="flex-1">
              <h1 className="text-sm font-medium leading-[21px] text-[#666666] flex items-end">
                {product.title}
              </h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-sm bg-[#F80000] text-white px-2 py-1 rounded-sm font-semibold">
                  #Best Seller
                </span>
                <Link
                  href={product.store?.url || "/coming-soon"} className="text-md font-medium mt-1 text-contentBlue">
                  in {product?.collection?.title}
                </Link>
              </div>
              <div className="mt-2 text-[#222222] text-sm">
                <span className="font-semibold">
                  {product.soldLastMonth || "0"}
                </span>{" "}
                Sold Out in past month
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto pb-6 space-y-6 px-4">
        <div className="w-screen relative left-1/2 right-1/2 -translate-x-1/2 bg-[#D9D9D9] lg:bg-white flex justify-center py-4">
          <div className="w-[220px] sm:w-[250px] md:w-[284px] lg:w-[296px] h-[232px] sm:h-[264px] md:h-[296px] lg:h-[320px] overflow-hidden rounded-[16px] flex items-center justify-center">
            <Image
              src={images[index] || "/images/not-available/not-available.png"}
              alt={product.title + " image"}
              width={296}
              height={320}
              className="object-cover w-full h-full rounded-[16px]"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full ${i === index ? "bg-blue-800" : "bg-gray-300"
                }`}
              aria-label={`View image ${i + 1}`}
            />
          ))}
        </div>

        <hr className="block lg:hidden -mx-4 w-screen border-t border-gray-300 mt-3" />
        <hr className="hidden lg:block border-t border-gray-300 mt-3" />

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {colors.length > 0 && (
            <div>
              <div className="text-[16px] font-normal text-black mb-2">
                Color:{" "}
                <span className="font-semibold text-[16px] text-black">
                  {colors.find((c) => c.id === selectedColor)?.label}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c.id)}
                    className={`w-[84px] h-[74px] rounded-[8px] overflow-hidden flex items-center justify-center ${selectedColor === c.id
                        ? "border-2 border-[#1A315A]"
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
              <div className="text-base font-normal mb-2 text-[#222222]">
                Size:
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s, i) => {
                  const shortLabel = sizeShortMap[s?.toLowerCase() ?? ""] || s

                  return (
                    <button
                      key={`${s}-${i}`}
                      onClick={() => setSelectedSize(s)}
                      className={`w-[50px] h-[40px] px-2 py-2 rounded-[8px] flex items-center justify-center text-sm uppercase tracking-wide ${selectedSize === s
                          ? "border-2 border-[#1A315A] bg-white shadow text-[#333333]"
                          : "border border-[#333333] bg-transparent text-[#333333]"
                        }`}
                    >
                      {shortLabel}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <hr className="block lg:hidden -mx-4 w-screen border-t border-gray-300 mt-3" />
        <hr className="hidden lg:block border-t border-gray-300 mt-3" />

        <div className="mt-3 flex flex-col gap-1">
          <div className="bg-[#F80000] text-white px-3 py-1.5 rounded-sm text-sm font-semibold w-fit">
            {discountPercent}% OFF + Cash on Delivery
          </div>
          <div className="flex items-center pt-1">
            <div className="pr-2 py-0.5 text-[32px] text-[#F80000] rounded-md font-medium">
              -{discountPercent}%
            </div>
            <div className="px-2 rounded-md text-xs font-semibold flex items-baseline gap-1">
              <span className="text-[14px] leading-none self-start">
                {currency}
              </span>
              <span className="text-[32px] font-medium leading-none">
                {price}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-normal font-base text-gray-600">
              M.R.P.:{" "}
              <span className="line-through">
                {currency} {originalPrice}
              </span>
            </div>
            <div className="bg-[#EAEFFF] text-[#307345] text-base font-medium">
              Save {currency} {originalPrice - price}
            </div>
          </div>
        </div>

        <hr className="block lg:hidden -mx-4 w-screen border-t border-gray-300 mt-3" />
        <hr className="hidden lg:block border-t border-gray-300 mt-3" />

        <details className="mt-4">
          <summary className="cursor-pointer font-medium text-[18px] text-[#222222] flex justify-between items-center list-none">
            <span>Product Details</span>
            <Image
              src="/images/icons/arrow.png"
              alt="arrow"
              width={16}
              height={16}
            />
          </summary>
          <div>
            <table className="w-full font-semibold text-[16px] text-[#222222] text-left">
              <tbody>
                <tr>
                  <td className="py-2 w-40">Material</td>
                  <td className="py-2 font-normal text-[16px]">
                    {product?.material || "Not given"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2">Fit</td>
                  <td className="py-2 font-normal text-[16px]">Regular</td>
                </tr>
                <tr>
                  <td className="py-2">Care</td>
                  <td className="py-2 font-normal text-[16px]">
                    Machine wash cold
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>

        <hr className="block lg:hidden -mx-4 w-screen border-t border-gray-300 mt-3" />
        <hr className="hidden lg:block border-t border-gray-300 mt-3" />

        <details className="mt-4">
          <summary className="cursor-pointer font-medium text-[18px] text-[#222222] flex justify-between items-center list-none">
            <span>Product Specification</span>
            <Image
              src="/images/icons/arrow.png"
              alt="arrow"
              width={16}
              height={16}
            />
          </summary>
          <div>
            <table className="w-full font-semibold text-[16px] text-[#222222] text-left">
              <tbody>
                <tr>
                  <td className="py-2 w-40">Brand</td>
                  <td className="py-2 font-normal text-[16px]">Puma</td>
                </tr>
                <tr>
                  <td className="py-2 w-40">Model</td>
                  <td className="py-2 font-normal text-[16px]">TSH-1234</td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>

        <hr className="block lg:hidden -mx-4 w-screen border-t border-gray-300 mt-3" />
        <hr className="hidden lg:block border-t border-gray-300 mt-3" />

        <details className="mt-4">
          <summary className="cursor-pointer font-medium text-[18px] text-[#222222] flex justify-between items-center list-none">
            <span>Questions & Reviews</span>
            <Image
              src="/images/icons/arrow.png"
              alt="arrow"
              width={16}
              height={16}
              className="transition-transform duration-300 group-open:rotate-180"
            />
          </summary>
          <div className="space-y-3">
            {totalReviews > 0 ? (
              <div className="flex items-center gap-2">
                <StarRating rate={averageRating} starSize={18} />
                <span className="text-[14px] text-[#222222] font-medium">
                  {averageRating.toFixed(1)} out of 5
                </span>
                <span className="text-[12px] font-normal ml-1">
                  ({totalReviews.toLocaleString()} review
                  {totalReviews !== 1 ? "s" : ""})
                </span>
              </div>
            ) : (
              <span className="text-[12px] font-normal">No reviews yet</span>
            )}

            <div>
              <p className="text-[14px] text-[#222222] font-medium">
                Customers say
              </p>
              {totalReviews > 0 && reviews[0]?.customer_note ? (
                <span className="text-[14px] font-normal text-[#666666]">
                  &quot;{reviews[0].customer_note}&quot;
                </span>
              ) : (
                <span className="text-[14px] font-normal text-[#666666]">
                  &quot;No reviews yet.&quot;
                </span>
              )}
            </div>

            {reviews.map((review) => (
              <div key={review.id} className="rounded-md space-y-2">
                <div className="flex items-center gap-3">
                  <Image
                    src={`/images/users/john-doe.jpg`}
                    alt="Reviewer"
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full object-cover"
                    quality={80}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-[14px] text-[#222222]">
                      {review.customer.first_name} {review.customer.last_name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <StarRating rate={review.rating} starSize={15} />
                  <span className="text-[10px] font-normal text-[#FA6308]">
                    Verified Purchase
                  </span>
                </div>

                <div className="text-[14px] font-medium text-[#222222]">
                  {review.customer_note}
                </div>

                <div className="text-[10px] font-normal text-[#888888] mt-1">
                  Reviewed on {new Date(review.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </details>
      </section>

      <hr className="block lg:hidden -mx-4 w-screen border-t border-gray-300 mt-3" />
      <hr className="hidden lg:block border-t border-gray-300 mt-3" />

      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-4 py-3 shadow-lg z-50">
        <div className="max-w-4xl mx-auto flex gap-3">
          <button
            onClick={handleAddToCart}
            className="w-[180px] h-[40px] md:flex-1 md:w-auto md:h-[48px] bg-gradient-to-t from-[#3002FC] to-[#3002FC] text-white rounded-[24px] font-medium flex items-center justify-center gap-2 shadow"
          >
            <Image
              src="/images/icons/cart.png"
              alt="Cart"
              width={20}
              height={20}
            />
            Add to cart
          </button>
          <button
            onClick={() => console.log("Buy now", product.id)}
            className="w-[180px] h-[40px] md:flex-1 md:w-auto md:h-[48px] bg-gradient-to-r from-[#FF4A53] to-[#FFA626] text-white rounded-[24px] font-medium flex items-center justify-center gap-2 shadow"
          >
            Buy now
          </button>
        </div>
      </div>
    </main>
  )
}
