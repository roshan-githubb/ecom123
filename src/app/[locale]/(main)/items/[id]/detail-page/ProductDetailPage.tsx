'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const sampleImages = [
    '/images/product/cotton-Tshirt.jpg',
    '/images/product/wireless-headphone.jpg',
    '/images/product/cotton-Tshirt.jpg',
]

const colors = [
    { id: 'white', label: 'White', bg: 'bg-white', ring: 'ring-gray-300' },
    { id: 'black', label: 'Black', bg: 'bg-black', ring: 'ring-gray-700' },
    { id: 'blue', label: 'Blue', bg: 'bg-blue-500', ring: 'ring-blue-300' },
]

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

function StarIcon({ className = 'w-4 h-4' }: { className?: string }) {
    return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.137 3.49a1 1 0 00.95.69h3.665c.969 0 1.371 1.24.588 1.81l-2.965 2.16a1 1 0 00-.364 1.118l1.137 3.49c.3.921-.755 1.688-1.54 1.118l-2.965-2.16a1 1 0 00-1.176 0l-2.965 2.16c-.784.57-1.838-.197-1.54-1.118l1.137-3.49a1 1 0 00-.364-1.118L2.708 9.917c-.783-.57-.38-1.81.588-1.81h3.665a1 1 0 00.95-.69l1.137-3.49z" />
        </svg>
    )
}

export default function ItemDetailPage({ id }: { id: string }) {
    const [index, setIndex] = useState(0)
    const [selectedColor, setSelectedColor] = useState(colors[0].id)
    const [selectedSize, setSelectedSize] = useState('M')

    // placeholder product data (replace with real fetch)
    const product = {
        id,
        store: { name: 'H&M', url: '/stores/hm' },
        title: 'Puma Cotton Shirt',
        rating: 4.6,
        reviews: 3240,
        soldLastMonth: '1.5k+',
        price: 1925,
        mrp: 3500,
        save: 1575,
        badges: ['BESTSELLER'],
        images: sampleImages,
    }

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Top rectangular card - full width, bottom border, no margin */}
            <section className="w-full bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto py-4 px-4">
                    {/* store link */}
                    <div className="mb-1">
                        <Link href={product.store.url} className="text-sm font-medium text-contentBlue hover:underline">
                            Visit the {product.store.name} store
                        </Link>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex-1">
                            <div className="flex justify-between"> <h1 className="text-xl md:text-2xl font-semibold">{product.title}</h1>

                                <div className="flex items-center gap-3 mt-2">
                                    <div className="flex items-center gap-1">
                                        {/* stars */}
                                        <div className="flex items-center text-contentOrange">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <StarIcon key={i} className="w-4 h-4" />
                                            ))}
                                        </div>
                                        <div className="text-sm text-gray-700 font-medium">{product.rating}</div>
                                    </div>

                                    <div className="text-sm text-gray-500">({product.reviews.toLocaleString()})</div>
                                </div>
                            </div>
                            {/* badges */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {product.badges.map((b) => (
                                    <span key={b} className="text-xs bg-[#f80707] border text-white px-2 py-1 rounded-md font-medium">
                                        #{b}
                                    </span>
                                ))}
                                <Link href={product.store.url} className="text-sm font-medium mt-1 text-contentBlue hover:underline">
                                    in Shirt & Tops
                                </Link>
                            </div>

                            <div className=" mt-2"><span className="font-semibold text-[#222222] ">{product.soldLastMonth} Sold Out</span> in last month</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content area */}
            <section className="max-w-4xl mx-auto pb-6 space-y-6">
                {/* Carousel */}
                <div className=" shadow-sm">
                    <div className="relative bg-gray-50 py-4 h-64 md:h-96 flex items-center rounded-xl justify-center overflow-hidden">
                        {/* center image */}
                        <Image
                            src={product.images[index]}
                            alt={product.title + ' image'}
                            width={800}
                            height={800}
                            className="object-contain rounded-xl max-h-full"
                        />
                    </div>

                    {/* dots */}
                    <div className=" mt-4 flex items-center justify-center gap-2">
                        {product.images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                className={`w-3 h-3 rounded-full ${i === index ? 'bg-gray-800' : 'bg-gray-300'}`}
                                aria-label={`View image ${i + 1}`}
                            />
                        ))}
                    </div>

                    {/* color & size selectors in a row on mobile */}
                    <div className=" px-4 mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Color selector */}
                        <div>
                            <div className="text-sm font-medium mb-2">
                                Color: <span className="font-bold">{colors.find((c) => c.id === selectedColor)?.label}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                {sampleImages.map((imgSrc, i) => {
                                    const isSelected = index === i
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setIndex(i)
                                                setSelectedColor(i.toString()) // optional: if you still want to track "color id"
                                            }}
                                            className={`w-14 h-14 rounded-md border overflow-hidden flex items-center justify-center ${isSelected ? 'ring-2 ring-offset-1 ring-blue-600' : 'border-gray-300'}`}
                                            aria-pressed={isSelected}
                                        >
                                            <Image
                                                src={imgSrc}
                                                alt={`Variant ${i + 1}`}
                                                width={56}
                                                height={56}
                                                className="object-cover w-full h-full"
                                            />
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* <div>
                            <div className="text-sm font-medium mb-2">Color: <span className="font-bold">{colors.find((c) => c.id === selectedColor)?.label}</span></div>
                            <div className="flex items-center gap-3">
                                {colors.map((c) => (
                                    <button
                                        key={c.id}
                                        onClick={() => setSelectedColor(c.id)}
                                        className={`flex items-center justify-center w-10 h-10 rounded-md border ${selectedColor === c.id ? 'ring-2 ring-offset-1' : 'border-gray-300'
                                            }`}
                                        aria-pressed={selectedColor === c.id}
                                        title={c.label}
                                    >
                                        <span className={`w-6 h-6 rounded ${c.bg} ${c.id === 'white' ? 'border' : ''}`}></span>
                                    </button>
                                ))}

                            </div>
                        </div> */}

                        {/* Size selector */}
                        <div>
                            <div className="text-sm font-medium text-gray-700 mb-2">Size:
                                {/* <span className="font-bold">{selectedSize}</span> */}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {sizes.map((s) => {
                                    const isSelected = selectedSize === s
                                    return (
                                        <button
                                            key={s}
                                            onClick={() => setSelectedSize(s)}
                                            className={`px-3 py-1.5 rounded-md border uppercase text-sm tracking-wide ${isSelected ? 'bg-gray-900 text-white border-gray-900' : 'bg-transparent text-gray-700 border-gray-300'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    )
                                })}
                            </div>
                            {/* <div className="text-xs text-gray-500 mt-2">Selected: <span className="font-medium"></span></div> */}
                        </div>
                    </div>

                    {/* Price & Badges Section */}
                    <div className="px-4 mt-4 flex flex-col gap-3 pb-3">

                        {/* 🔴 Big Red Badge */}
                        <div className="bg-red-600 text-white px-3 py-1.5 rounded-md text-sm font-semibold w-fit">
                            45% OFF + Cash on Delivery
                        </div>

                        {/* 🔽 Two Chips: -45% | Rs 1925 */}
                        <div className="flex items-center gap-2">
                            {/* Chip 1 */}
                            <div className="px-2 py-0.5 text-[32px] text-red-600 rounded-md text-xs font-semibold">
                                -45%
                            </div>

                            {/* Chip 2 */}
                            <div className="px-2 py-0.5   rounded-md text-xs font-semibold flex items-baseline gap-0.5">
                                <span className="text-[14px] align-top relative -top-0.5">Rs</span>
                                <span className="text-[32px] font-bold">1925</span>
                            </div>
                        </div>

                        {/* 🔽 MRP + Save Badge */}
                        <div className="flex items-center gap-3">

                            {/* MRP */}
                            <div className="text-sm text-gray-600">
                                MRP: <span className="line-through">Rs 3500</span>
                            </div>

                            {/* Save Badge */}
                            <div className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-md">
                                Save Rs 1575
                            </div>
                        </div>
                    </div>

                </div>

                {/* Accordions */}
                <div className="space-y-3 px-3 ">
                    <details className="bg-white rounded-xl p-4 shadow-sm">
                        <summary className="cursor-pointer font-medium text-black">Product details</summary>
                        <div className="mt-3">
                            <table className="w-full text-sm text-left">
                                <tbody>
                                    <tr className="border-t border-gray-100">
                                        <td className="py-2 font-medium w-40">Material</td>
                                        <td className="py-2">100% Cotton</td>
                                    </tr>
                                    <tr className="border-t border-gray-100">
                                        <td className="py-2 font-medium">Fit</td>
                                        <td className="py-2">Regular</td>
                                    </tr>
                                    <tr className="border-t border-gray-100">
                                        <td className="py-2 font-medium">Care</td>
                                        <td className="py-2">Machine wash cold</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </details>

                    <details className="bg-white rounded-xl p-4 shadow-sm">
                        <summary className="cursor-pointer font-medium text-black">Product specification</summary>
                        <div className="mt-3">
                            <table className="w-full text-sm text-left">
                                <tbody>
                                    <tr className="border-t border-gray-100">
                                        <td className="py-2 font-medium w-40">Brand</td>
                                        <td className="py-2">Puma</td>
                                    </tr>
                                    <tr className="border-t border-gray-100">
                                        <td className="py-2 font-medium">Model</td>
                                        <td className="py-2">TSH-1234</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </details>

                    <details className="bg-white rounded-xl p-4 shadow-sm">
                        <summary className="cursor-pointer font-medium text-black">Questions & Reviews</summary>
                        <div className="mt-3 space-y-3">
                            {/* Rating Summary */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center text-contentOrange">
                                    <span className="font-bold text-lg">{product.rating}</span>
                                    <StarIcon className="w-5 h-5 ml-2" />
                                </div>
                                <div className="text-sm text-gray-600">{product.reviews.toLocaleString()} global ratings</div>
                            </div>

                            {/* Review Card */}
                            <div className=" p-4 rounded-md space-y-2">

                                {/* Avatar + Name */}
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={`/images/users/john-doe.jpg`}
                                        alt="Reviewer"
                                        width={50}
                                        height={50}
                                        className="w-10 h-10 rounded-full object-cover"
                                        quality={80}
                                    />

                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm">John Doe</span>

                                        {/* Stars + Verified */}
                                        <div className="flex items-center gap-1 text-contentOrange text-xs">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon key={i} className="w-3.5 h-3.5" />
                                            ))}
                                            <span className="text-[10px] text-gray-600 ml-1">Verified Purchase</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Debut location + date */}
                                <div className="text-[10px] text-gray-500 mt-1">
                                    Reviewed in the United States on October 13, 2025
                                </div>

                                {/* Size + Qty */}
                                <div className="text-[10px] text-gray-400">
                                    Size: Medium <span className="text-gray-400">(Quantity: 1)</span>
                                </div>

                                {/* Review Text */}
                                <div className="text-xs text-gray-500 mt-2">
                                    “{`I’ve been using this product for a few weeks now, and I’m genuinely impressed by the build quality and comfort.
The fit is exactly as described, and the material feels durable without being too heavy.
I also appreciate the attention to small details, which makes it feel more premium than expected.
Overall, it exceeded my expectations, and I wouldn’t hesitate to recommend it to others.`}”
                                </div>
                            </div>
                        </div>
                    </details>
                </div>

                {/* Sticky Action Bar */}
                <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-4 py-3 shadow-lg z-50">
                    <div className="max-w-4xl mx-auto flex gap-3">
                        <button
                            onClick={() => console.log('Add to cart', product.id, selectedSize, selectedColor)}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-full font-medium flex items-center justify-center gap-2 shadow"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13l-1.2 6m12.2-6l1.2 6M7 13h10" />
                            </svg>
                            Add to cart
                        </button>

                        <button
                            onClick={() => console.log('Buy now', product.id)}
                            className="flex-1 bg-gradient-to-r from-orange-700 to-orange-400 text-white py-3 rounded-full font-medium flex items-center justify-center gap-2 shadow"
                        >
                            Buy now
                        </button>
                    </div>
                </div>

            </section>

        </main>
    )
}
