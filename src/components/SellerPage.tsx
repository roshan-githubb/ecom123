'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCartStore } from "@/store/useCartStore"
import { cartToast } from "@/lib/cart-toast"
import { getStockDisplayInfo } from "@/lib/helpers/stock-display"
import { useInventoryStore } from "@/store/useInventoryStore"
import { useInventorySync } from "@/hooks/useInventorySync"
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


const ProductCard = ({ product, ratingSummary, allProducts, productIndex }: { product: MedusaProduct, ratingSummary?: RatingSummary, allProducts: MedusaProduct[], productIndex: number }) => {
    const addToCart = useCartStore((state) => state.add);
    const { getAdjustedInventory } = useInventoryStore();
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    
    // Sync inventory with cart state on component mount and navigation
    useInventorySync();
    const [showModal, setShowModal] = useState(false);
    const [cardPos, setCardPos] = useState({ top: 0, left: 0, width: 0, height: 0 });
    const [currentModalProductIndex, setCurrentModalProductIndex] = useState(productIndex);

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

    // Calculate original total inventory across all variants
    const originalTotalInventory = product.variants?.reduce(
        (sum, variant) => sum + (variant.inventory_quantity || 0),
        0
    ) || 0;

    // Get adjusted inventory for each variant and calculate total
    const adjustedTotalInventory = product.variants?.reduce(
        (sum, variant) => {
            const originalInventory = variant.inventory_quantity || 0;
            const adjustedInventory = getAdjustedInventory(variant.id, originalInventory);
            return sum + adjustedInventory;
        },
        0
    ) || 0;

    const totalInventory = adjustedTotalInventory;

    // Get dynamic stock display information
    const stockInfo = getStockDisplayInfo(totalInventory);

    const isSoldOut = totalInventory <= 0;

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
        setCurrentModalProductIndex(productIndex);
        setShowModal(true);
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isAddingToCart || !firstVariant.id || totalInventory <= 0) return;

        setIsAddingToCart(true);
        try {
            await addToCart(firstVariant.id, 1);
            
            // Inventory is now handled in the cart store
            
            cartToast.showCartToast();
        } catch (error) {
            cartToast.showErrorToast();
            console.error("Add to cart error:", error);
        } finally {
            setIsAddingToCart(false);
        }
    };

    return (
        <div className="flex flex-col bg-white rounded-lg">
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
                    {stockInfo.showWarning && (
                        <span className="text-[9px] font-medium" style={{ color: stockInfo.textColor }}>
                            {stockInfo.message}
                        </span>
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
                    product={allProducts[currentModalProductIndex] as any}
                    ratingSummary={ratingSummary}
                    cardPos={cardPos}
                    onClose={() => setShowModal(false)}
                    products={allProducts}
                    currentProductIndex={currentModalProductIndex}
                    onProductChange={(newIndex) => setCurrentModalProductIndex(newIndex)}
                />
            )}
        </div>
    );
};


export function SellerPage({ products = [], seller, ratingsMap = {} }: SellerPageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);
    const [showSort, setShowSort] = useState(false);

    const currentSort = searchParams.get('sort') || 'created_at';
    const currentFilter = searchParams.get('filter') || 'all';

    React.useEffect(() => {
        const handleClickOutside = () => {
            setShowFilters(false);
            setShowSort(false);
        };

        if (showFilters || showSort) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [showFilters, showSort]);

    const sortOptions = [
        { value: 'created_at', label: 'Newest First' },
        { value: 'price_asc', label: 'Price: Low to High' },
        { value: 'price_desc', label: 'Price: High to Low' },
        { value: 'title_asc', label: 'Name: A to Z' },
        { value: 'title_desc', label: 'Name: Z to A' },
    ];

    const filterOptions = [
        { value: 'all', label: 'All Products' },
        { value: 'in_stock', label: 'In Stock Only' },
        { value: 'on_sale', label: 'On Sale' },
        { value: 'low_price', label: 'Under Rs. 1000' },
        { value: 'high_price', label: 'Above Rs. 5000' },
    ];

    const updateURL = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== 'all' && value !== 'created_at') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`?${params.toString()}`);
    };

    const handleSortChange = (sortValue: string) => {
        updateURL('sort', sortValue);
        setShowSort(false);
    };

    const handleFilterChange = (filterValue: string) => {
        updateURL('filter', filterValue);
        setShowFilters(false);
    };

    const clearFilter = () => {
        updateURL('filter', 'all');
    };

    const clearSort = () => {
        updateURL('sort', 'created_at');
    };

    const clearAllFilters = () => {
        const params = new URLSearchParams();
        router.push(`?${params.toString()}`);
    };

    const activeFilters = [];
    if (currentFilter !== 'all') {
        const filterLabel = filterOptions.find(opt => opt.value === currentFilter)?.label || currentFilter;
        activeFilters.push({ type: 'filter', value: currentFilter, label: filterLabel });
    }
    if (currentSort !== 'created_at') {
        const sortLabel = sortOptions.find(opt => opt.value === currentSort)?.label || currentSort;
        activeFilters.push({ type: 'sort', value: currentSort, label: sortLabel });
    }

    return (
        <div className="min-h-screen bg-white w-full max-w-md md:max-w-7xl mx-auto border-x border-gray-100">
            <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
                <h1 className="text-lg font-semibold text-gray-800">{seller?.name || (products.length > 0 ? products[0].collection?.title : "") || "Store"}</h1>
            </div>

            <div className="sticky top-0 z-40 bg-white">
                <div className="flex items-center gap-2 p-3 overflow-x-auto no-scrollbar border-b border-gray-100">
                    {/* Filters Button */}
                    <div className="relative">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowFilters(!showFilters);
                                setShowSort(false);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[13px] font-medium text-gray-700 whitespace-nowrap shadow-sm hover:bg-gray-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                            Filters
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </button>
                        
                        {showFilters && (
                            <div 
                                className="fixed top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] min-w-[180px]"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    position: 'fixed',
                                    top: '120px', 
                                    left: '16px', 
                                }}
                            >
                                {filterOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleFilterChange(option.value)}
                                        className="w-full text-left px-3 py-2 text-[13px] hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sort Button */}
                    <div className="relative">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowSort(!showSort);
                                setShowFilters(false);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[13px] font-medium text-gray-700 whitespace-nowrap shadow-sm hover:bg-gray-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 18V4" /></svg>
                            {sortOptions.find(opt => opt.value === currentSort)?.label || 'Sort'}
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </button>
                        
                        {showSort && (
                            <div 
                                className="fixed top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] min-w-[180px]"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    position: 'fixed',
                                    top: '120px', 
                                    left: '120px',
                                }}
                            >
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleSortChange(option.value)}
                                        className={`w-full text-left px-3 py-2 text-[13px] hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                                            currentSort === option.value ? 'bg-blue-50 text-blue-600 font-medium' : ''
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Active Filters Display */}
                {activeFilters.length > 0 && (
                    <div className="px-3 py-2 border-b border-gray-100">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-gray-500 font-medium">Active:</span>
                            {activeFilters.map((filter, index) => (
                                <div
                                    key={`${filter.type}-${filter.value}`}
                                    className="flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-full px-2 py-1"
                                >
                                    <span className="text-xs text-blue-700 font-medium">
                                        {filter.label}
                                    </span>
                                    <button
                                        onClick={() => {
                                            if (filter.type === 'filter') {
                                                clearFilter();
                                            } else if (filter.type === 'sort') {
                                                clearSort();
                                            }
                                        }}
                                        className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </div>
                            ))}
                            {activeFilters.length > 1 && (
                                <button
                                    onClick={clearAllFilters}
                                    className="text-xs text-gray-500 hover:text-gray-700 underline ml-2"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="p-3">
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                    {products.map((product, index) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            ratingSummary={ratingsMap[product.id]}
                            allProducts={products}
                            productIndex={index}
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
