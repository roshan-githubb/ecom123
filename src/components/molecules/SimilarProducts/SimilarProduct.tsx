"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { SectionHeader } from "@/components/atoms/SectionHeader/SectionHeader";
import { HomeProductCard } from "@/components/molecules/HomeProductCard/HomeProductCard";
import { getSimilarProducts } from "@/services/category-products/category-products";
import { filter, String } from "lodash";
import { sortProductsByInventory } from "@/lib/sortProducts/sortProducts";
import LocalizedLink from "@/components/molecules/LocalizedLink/LocalizedLink";
import { IoArrowForward } from "react-icons/io5";

export default function SimilarProducts({ categoryId, categoryHandle, productId }: { categoryId: string, categoryHandle?: string, productId: String }) {
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [detectedCategoryHandle, setDetectedCategoryHandle] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const finalCategoryHandle = categoryHandle || detectedCategoryHandle;

  useEffect(() => {
    if (!categoryId || hasLoaded || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasLoaded && !loading) {
          if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
          }

          loadingTimeoutRef.current = setTimeout(() => {
            setHasLoaded(true);
            setLoading(true);
            setError(null);

            getSimilarProducts(categoryId)
              .then((data) => {
                const products = data?.products || data?.items || [];
                setSimilarProducts(products);
                
                if (!categoryHandle && products.length > 0 && products[0]?.categories?.[0]?.handle) {
                  setDetectedCategoryHandle(products[0].categories[0].handle);
                }
                
                setError(null);
              })
              .catch((err) => {
                console.error("Failed to load similar products:", err);
                setError("Failed to load similar products");
                setSimilarProducts([]);
              })
              .finally(() => setLoading(false));
          }, 100);
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [categoryId, hasLoaded, loading]);

  const filteredProducts = similarProducts.filter((product: any) => product?.id != productId);

  const sortedProducts = useMemo(() => { return sortProductsByInventory(filteredProducts) }, [filteredProducts])
  
  const limitedProducts = sortedProducts.slice(0, 5);

  return (
    <div ref={containerRef} className="px-2">
      <SectionHeader title="Similar Products" actionLabel="" />
      <div className="my-2"></div>

      {loading && (
        <div className="overflow-x-auto overflow-y-hidden gap-x-2 flex no-scrollbar scroll-smooth touch-pan-x">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-[180px] h-[200px] flex-shrink-0 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {error && !loading && (
        <p className="text-sm text-gray-500">{error}</p>
      )}

      {!loading && !error && filteredProducts.length === 0 && hasLoaded && (
        <p className="text-sm text-gray-500">No similar products found</p>
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <div
          className="overflow-x-auto overflow-y-hidden gap-x-2 flex no-scrollbar scroll-smooth touch-pan-x"
          style={{
            WebkitOverflowScrolling: 'touch' as const,
            scrollbarWidth: 'none' as const,
            msOverflowStyle: 'none' as const
          }}
        >
          {limitedProducts.map((item: any, index: number) => {
             const price = item?.variants?.[0]?.calculated_price?.calculated_amount ?? 0
            if(price == 0) return null;
            return (
            <div key={item.id} className="w-[180px] flex-shrink-0">
              <HomeProductCard
                api_product={item}
                allProducts={limitedProducts}
                productIndex={index}
              />
            </div>
          )
          })}
        
          {finalCategoryHandle && (
            <LocalizedLink href={`/categories/${finalCategoryHandle}`} scroll={true}>
              <div className="w-[180px] h-[280px] flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:from-gray-100 hover:to-gray-200 transition-all duration-200 border-2 border-gray-200 hover:border-gray-300">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-md">
                  <IoArrowForward className="text-gray-700 text-2xl" />
                </div>
                <p className="text-gray-800 font-semibold text-base mb-1">See All</p>
                <p className="text-gray-600 text-xs px-4 text-center">
                  View all products
                </p>
              </div>
            </LocalizedLink>
          )}
        </div>
      )}
    </div>
  );
}
