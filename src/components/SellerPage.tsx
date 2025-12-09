'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCartStore } from "@/store/useCartStore"
import toast, { Toaster } from "react-hot-toast"
import { RatingSummary } from "@/types/reviews"
import { AddVariantSheet } from "@/components/molecules/AddVariantModal/AddVariantModal"
import { motion } from "framer-motion"

interface MedusaOptionValue {
    id: string;
    value: string;
}

interface MedusaOption {
    id: string;
    title: string;
    values: MedusaOptionValue[];
}

interface MedusaPrice {
    calculated_amount: number;
    original_amount: number;
    currency_code: string;
}

interface MedusaVariant {
    id: string;
    title: string;
    inventory_quantity?: number;
    calculated_price?: MedusaPrice;
    options?: { value: string }[];
}

interface MedusaImage {
    id: string;
    url: string;
}

export interface MedusaProduct {
    id: string;
    title: string;
    handle: string;
    thumbnail: string | null;
    weight: string | null;
    images: MedusaImage[];
    variants: MedusaVariant[];
    options: MedusaOption[];
    collection?: { title: string };
}

export interface Seller {
    id: string;
    name: string;
    handle: string;
    store_status?: string;
}

interface SellerPageProps {
    seller?: Seller;
    products: MedusaProduct[];
    ratingsMap?: Record<string, RatingSummary>;
}


const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);

const VegIcon = () => (
    <div className="border border-green-600 p-[1px] w-3 h-3 flex items-center justify-center mr-1">
        <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
    </div>
);

const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-3 h-3 ${filled ? 'text-yellow-400' : 'text-gray-200'}`}>
        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
    </svg>
);


const ProductCard = ({ product, ratingSummary }: { product: MedusaProduct, ratingSummary?: RatingSummary }) => {
    const addToCart = useCartStore((state) => state.add);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [cardPos, setCardPos] = useState({ top: 0, left: 0, width: 0, height: 0 });

    const title = product.title;
    const image = product.thumbnail || product.images?.[0]?.url || '/images/not-available/not-available.png';
    const weight = product.weight ? `${product.weight} g` : null;

    const firstVariant = product.variants?.[0];

    if (!firstVariant) return null;

    const calculatedPrice = firstVariant.calculated_price;
    const price = calculatedPrice ? Number(calculatedPrice.calculated_amount) : 0;
    const mrp = calculatedPrice ? Number(calculatedPrice.original_amount) : price;
    const currency = calculatedPrice?.currency_code?.toUpperCase() ?? "INR";

    const discountPercentage = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
    const saveAmount = mrp - price;

    const isSoldOut = false;
    const lowStock = false;

    const averageRating = ratingSummary?.average_rating || 0;
    const ratingCount = ratingSummary?.total_reviews || 0;
    const showRating = ratingCount > 0;

    const isVeg = false;

    const handleOpenModal = (e: React.MouseEvent) => {
        const target = e.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        setCardPos({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
        });
        setShowModal(true);
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isAddingToCart || !firstVariant.id) return;

        setIsAddingToCart(true);
        try {
            await addToCart(firstVariant.id, 1);
            toast.success("Added to cart!");
        } catch (error) {
            toast.error("Failed to add to cart");
            console.error("Add to cart error:", error);
        } finally {
            setIsAddingToCart(false);
        }
    };

    return (
        <div className="flex flex-col bg-white rounded-lg">
            <Toaster position="top-right" reverseOrder={false} />
            <div
                className="relative w-full aspect-[4/5] bg-[#F3F5F7] rounded-xl overflow-visible mb-2 cursor-pointer"
                onClick={handleOpenModal}
            >
                {saveAmount > 0 && !isSoldOut && (
                    <div className="absolute top-0 left-0 bg-[#E91E63] text-white text-[10px] font-bold px-2 py-1 rounded-br-lg z-10">
                        Save {currency === 'NPR' ? 'Rs.' : (currency === 'INR' ? '₹' : currency)}{saveAmount}
                    </div>
                )}

                <button
                    className="absolute top-2 right-2 z-10 rounded-full p-1"
                    onClick={(e) => e.stopPropagation()}
                >
                    <HeartIcon />
                </button>

                <div className="w-full h-full relative p-3 overflow-hidden rounded-xl">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-contain"
                    />
                </div>

                <div className="absolute bottom-[-8px] right-[-8px] z-20">
                    {!isSoldOut ? (
                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(e);
                            }}
                            disabled={isAddingToCart}
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            className="bg-white border border-green-600 rounded-lg flex flex-col items-center justify-center w-[50px] h-[25px] lg:w-[75px] lg:h-[35px] shadow-sm">
                            <span className="text-green-700 font-bold text-[12px] leading-none">
                                {isAddingToCart ? "Adding" : "ADD"}
                            </span>
                        </motion.button>
                    ) : (
                        <button className="bg-white border border-green-600 rounded-lg flex items-center justify-center w-[70px] h-[30px] shadow-sm">
                            <span className="text-green-700 font-bold text-[12px]">Notify</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-1 px-1">
                {(weight || isVeg) && (
                    <div className="flex items-center">
                        {isVeg && <VegIcon />}
                        {weight && <span className="text-xs text-gray-600 font-medium">{weight}</span>}
                    </div>
                )}

                <h3
                    className="text-[13px] font-semibold text-gray-800 leading-tight line-clamp-2 min-h-[32px] cursor-pointer hover:text-blue-600"
                    onClick={handleOpenModal}
                >
                    {title}
                </h3>

                {showRating && (
                    <div className="flex items-center gap-1">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <StarIcon key={s} filled={s <= averageRating} />
                            ))}
                        </div>
                        <span className="text-[10px] text-gray-500">({ratingCount})</span>
                    </div>
                )}

                <div className="flex flex-col gap-0.5">
                    {lowStock && (
                        <span className="text-[9px] text-orange-600 font-medium">Only {1} left</span>
                    )}
                </div>

                <div className="mt-1">
                    {discountPercentage > 0 && (
                        <span className="text-[10px] font-bold text-blue-600 block">{discountPercentage}% OFF</span>
                    )}
                    <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-gray-900">
                            {currency === 'NPR' ? 'Rs.' : (currency === 'INR' ? '₹' : currency)}{price}
                        </span>
                        {mrp > price && (
                            <span className="text-[10px] text-gray-500 line-through">MRP {currency === 'NPR' ? 'Rs.' : (currency === 'INR' ? '₹' : currency)}{mrp}</span>
                        )}
                    </div>
                </div>
            </div>

            {showModal && (
                <AddVariantSheet
                    product={product as any}
                    ratingSummary={ratingSummary}
                    cardPos={cardPos}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};


export function SellerPage({ products = [], seller, ratingsMap = {} }: SellerPageProps) {
    return (
        <div className="min-h-screen bg-white w-full max-w-md md:max-w-7xl mx-auto border-x border-gray-100">
            <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
                <h1 className="text-lg font-semibold text-gray-800">{seller?.name || (products.length > 0 ? products[0].collection?.title : "") || "Store"}</h1>
            </div>

            <div className="sticky top-0 z-20 bg-white">
                <div className="flex items-center gap-2 p-3 overflow-x-auto no-scrollbar border-b border-gray-100">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[13px] font-medium text-gray-700 whitespace-nowrap shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                        Filters
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[13px] font-medium text-gray-700 whitespace-nowrap shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 18V4" /></svg>
                        Sort
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </button>
                </div>
            </div>

            <div className="p-3">
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                    {products.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            ratingSummary={ratingsMap[product.id]}
                        />
                    ))}
                </div>
                {products.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        No products found for this seller.
                    </div>
                )}
            </div>
        </div>
    );
}
