"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { StarRating } from "@/components/atoms"

const sampleImages = [
  "/images/product/cotton-Tshirt.jpg",
  "/images/product/wireless-headphone.jpg",
  "/images/product/cotton-Tshirt.jpg",
]

const colors = [
  { id: "white", label: "White", bg: "bg-white", ring: "ring-gray-300" },
  { id: "black", label: "Black", bg: "bg-black", ring: "ring-gray-700" },
  { id: "blue", label: "Blue", bg: "bg-blue-500", ring: "ring-blue-300" },
]

const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

function StarIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.137 3.49a1 1 0 00.95.69h3.665c.969 0 1.371 1.24.588 1.81l-2.965 2.16a1 1 0 00-.364 1.118l1.137 3.49c.3.921-.755 1.688-1.54 1.118l-2.965-2.16a1 1 0 00-1.176 0l-2.965 2.16c-.784.57-1.838-.197-1.54-1.118l1.137-3.49a1 1 0 00-.364-1.118L2.708 9.917c-.783-.57-.38-1.81.588-1.81h3.665a1 1 0 00.95-.69l1.137-3.49z" />
    </svg>
  )
}

export default function ItemDetailPage({ id }: { id: string }) {
  const [index, setIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState(colors[0].id)
  const [selectedSize, setSelectedSize] = useState("M")

  const product = {
    id,
    store: { name: "H&M", url: "/stores/hm" },
    title: "Puma Cotton Shirt",
    rating: 4.6,
    reviews: 3240,
    soldLastMonth: "1.5k+",
    price: 1925,
    mrp: 3500,
    save: 1575,
    badges: ["BEST SELLER"],
    images: sampleImages,
  }

  return (
    <main className="min-h-screen">
      {/* Top Section */}
      <section className="w-full bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto py-4 px-4">
          {/* Store link + Rating inline */}
          <div className="flex items-center justify-between gap-3">
            <Link
              href={product.store.url}
              className="
                inline-flex
                items-end
                w-full max-w-[163px] h-[21px]
                text-[14px] leading-[21px]
                font-medium
                text-[#425699]
                hover:underline
                font-poppins
              "
            >
              Visit the {product.store.name} store
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {/* Stars */}
                <div className="flex items-center text-contentOrange">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className="w-6 h-6" />
                  ))}
                </div>
              </div>

              <div className="text-sm font-medium text-[#222222] leading-[21px]">
                {product.reviews.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Product Title + Badges */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex-1">
              <h1 className="text-sm font-medium leading-[21px] text-[#666666] flex items-end">
                {product.title}
              </h1>

              <div className="flex flex-wrap gap-2 mt-2">
                {product.badges.map((b) => (
                  <span
                    key={b}
                    className="text-xs bg-[#F80000] text-white px-2 py-1 rounded-sm font-medium"
                  >
                    #{b}
                  </span>
                ))}
                <Link
                  href={product.store.url}
                  className="text-sm font-normal mt-1 text-[#425699]"
                >
                  in Shirt & Tops
                </Link>
              </div>

              <div className="mt-2 text-[#222222] text-sm">
                <span className="font-semibold">{product.soldLastMonth}</span>{" "}
                <span className="font-semibold">Sold Out</span> in last month
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Images Carousel */}
      <section className="max-w-4xl mx-auto pb-6 space-y-6 px-4 border-b border-gray-200">
        <div className="relative -mx-4 bg-gray-50 py-4 h-64 md:h-96 flex items-center justify-center overflow-hidden">
          <div className="relative bg-gray-50 py-4 h-64 md:h-96 flex items-center justify-center overflow-hidden rounded-xl">
            <Image
              src={product.images[index]}
              alt={product.title + " image"}
              width={800}
              height={800}
              className="object-contain w-full h-full rounded-md"
            />
          </div>
        </div>

        {/* Dots */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {product.images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full ${
                i === index ? "bg-blue-800" : "bg-gray-300"
              }`}
              aria-label={`View image ${i + 1}`}
            />
          ))}
        </div>

        <hr className="-mx-4 w-screen border-t border-gray-300 mt-3" />

        {/* Color & Size */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Color Selector */}
          <div>
            <div className="text-[16px] font-normal text-black mb-2">
              Color:{" "}
              <span className="font-semibold text-[16px] text-black">
                {colors.find((c) => c.id === selectedColor)?.label}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {sampleImages.map((imgSrc, i) => {
                const isSelected = index === i
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setIndex(i)
                      setSelectedColor(i.toString())
                    }}
                    className={`w-[84px] h-[74px] rounded-[8px] overflow-hidden flex items-center justify-center ${
                      isSelected
                        ? "border-2 border-[#1A315A]"
                        : "border border-gray-300"
                    }`}
                    aria-pressed={isSelected}
                  >
                    <Image
                      src={imgSrc}
                      alt={`Variant ${i + 1}`}
                      width={84}
                      height={74}
                      className="object-cover w-full h-full"
                    />
                  </button>
                )
              })}
            </div>
          </div>

          <hr className="-mx-4 w-screen border-t border-gray-300 mt-3" />

          {/* Size Selector */}
          <div>
            <div className="text-base font-normal mb-2 text-[#222222]">
              Size:
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => {
                const isSelected = selectedSize === s
                return (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-[50px] h-[40px] px-2 py-2 rounded-[8px] flex items-center justify-center text-sm uppercase tracking-wide ${
                      isSelected
                        ? "border-2 border-[#1A315A] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-[#333333] font-normal text-base"
                        : "border border-[#333333] bg-transparent text-[#333333] font-normal text-base"
                    }`}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <hr className="-mx-4 w-screen border-t border-gray-300 mt-3" />

        {/* Price & Badges */}
        <div className="mt-4 flex flex-col gap-1">
          <div className="bg-[#F80000] text-[#FFFFFF] px-3 py-1.5 rounded-sm text-base font-medium w-fit">
            45% OFF + Cash on Delivery
          </div>
          <div className="flex items-center">
            <div className="px-1 py-0.5 text-[32px] text-[#F80000] rounded-md font-normal">
              -45%
            </div>
            <div className="px-2 py-0.5 text-[32px] text-[#222222] rounded-md text-xs font-semibold flex items-baseline gap-0.5">
              <span className="text-[14px] align-top relative -top-0.5">
                Rs
              </span>
              <span className="text-[32px] font-medium text-[#222222]">{product.price}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="font-normal text-base text-[#777777]">
              M.R.P.: <span className="line-through">Rs {product.mrp}</span>
            </div>
            <div className="bg-[#EAEFFF] text-[#307345] text-base font-medium">
              Save Rs {product.save}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <hr className="-mx-4 w-screen border-t border-gray-300" />
          {/* Product details */}
          <details className="">
            <summary className="cursor-pointer font-medium text-[18px] text-[#222222] flex justify-between items-center list-none">
              <span>Product Details</span>
              <Image
                src="/images/icons/arrow.png"
                alt="arrow"
                width={16}
                height={16}
                className="transition-transform duration-300 group-open:rotate-180"
              />
            </summary>
            <div>
              <table className="w-full font-semibold text-[16px] text-[#222222] text-left">
                <tbody>
                  <tr>
                    <td className="py-2 w-40">Material</td>
                    <td className="py-2 font-normal text-[16px]">100% Cotton</td>
                  </tr>
                  <tr>
                    <td className="py-2">Fit</td>
                    <td className="py-2 font-normal text-[16px]">Regular</td>
                  </tr>
                  <tr>
                    <td className="py-2">Care</td>
                    <td className="py-2 font-normal text-[16px]">Machine wash cold</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </details>

          <hr className="-mx-4 w-screen border-t border-gray-300 mt-3" />

          {/* Product specification */}
          <details className="">
            <summary className="cursor-pointer font-medium text-[18px] text-[#222222] flex justify-between items-center list-none">
              <span>Product specification</span>
              <Image
                src="/images/icons/arrow.png"
                alt="arrow"
                width={16}
                height={16}
                className="transition-transform duration-300 group-open:rotate-180"
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

          <hr className="-mx-4 w-screen border-t border-gray-300 mt-3" />

          {/* Questions & Reviews */}
          <details className="">
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
              {/* Rating Summary */}
              <div className="flex items-center gap-2">
                <StarRating rate={4.6} starSize={15} />
                <span className="text-[14px] text-[#222222] font-medium">
                  4.6 out of 5
                </span>
              </div>

              <span className="text-[12px] font-normal">3420 global rating</span>

              <div>
                <p className="text-[14px] text-[#222222] font-medium">
                  Customers say
                </p>
                <span className="text-[14px] font-normal text-[#666666]">
                  {`"Customers consistently praise this shirt for its perfect fit
                  and exceptional comfort, nothing the high-quality, soft fabric
                  offers great value for the price. Many highlight that it holds
                  up beautifully after washing with no shrinking, and the
                  accurate &apos;slim fit&apos; description makes online
                  shopping hassle-free. It has quickly become a go-to piece for
                  both the office and casual wear, with several users mentioning
                  they receive frequent compliments. Overall, buyers are highly
                  satisfied and report they are likely to purchase more colors."`}
                </span>
              </div>

              {/* Review Card */}
              <div className="rounded-md space-y-2">
                {/* Avatar + Name */}
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
                    <span className="font-medium text-[14px] text-[#222222]">John Doe</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-contentOrange text-xs">
                  <StarRating rate={5} starSize={15} />
                  <span className="text-[10px] font-normal text-[#FA6308]">
                    Verified Purchase
                  </span>
                </div>

                <div className="text-[14px] font-medium text-[#222222]">
                  Soft, Great shirt and fantastic quality
                </div>

                <div className="text-[10px] font-normal text-[#888888] mt-1">
                  Reviewed in the United States on October 13, 2025
                </div>

                <div className="text-[10px] font-normal text-[#888888]">
                  Size: Medium{" "}
                  <span className="text-gray-400">(Quantity: 1)</span>
                </div>

                <div className="text-[14px] font-normal text-[#666666]">
                  “
                  {`I’ve been using this product for a few weeks now, and I’m genuinely impressed by the build quality and comfort.
The fit is exactly as described, and the material feels durable without being too heavy.
I also appreciate the attention to small details, which makes it feel more premium than expected.
Overall, it exceeded my expectations, and I wouldn’t hesitate to recommend it to others.`}
                  ”
                </div>
              </div>
            </div>
          </details>

          <hr className="-mx-4 w-screen border-t border-gray-300 mt-3" />
        </div>

        {/* Sticky Action Bar */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-4 py-3 shadow-lg z-50">
          <div className="max-w-4xl mx-auto flex gap-3">
            <button
              onClick={() =>
                console.log(
                  "Add to cart",
                  product.id,
                  selectedSize,
                  selectedColor
                )
              }
              className="flex-1 bg-gradient-to-t from-[#3002FC] to-[#3002FC] text-white py-2 rounded-[24px] font-medium flex items-center justify-center gap-2 shadow"
            >
              <Image
                src="/images/icons/cart.png"
                alt="Cart"
                width={20}
                height={20}
                className="inline-block h-[0.75em] w-auto"
              />
              Add to cart
            </button>

            <button
              onClick={() => console.log("Buy now", product.id)}
              className="flex-1 bg-gradient-to-r from-[#FF4A53] to-[#FFA626] text-white py-2 rounded-[24px] font-medium flex items-center justify-center gap-2 shadow"
            >
              Buy now
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
