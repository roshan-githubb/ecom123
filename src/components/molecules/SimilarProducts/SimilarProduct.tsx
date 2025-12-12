"use client";

import { useEffect, useState, useRef } from "react";
import { SectionHeader } from "@/components/atoms/SectionHeader/SectionHeader";
import { HomeProductCard } from "@/components/molecules/HomeProductCard/HomeProductCard";
import { getSimilarProducts } from "@/services/category-products/category-products";
import { String } from "lodash";

export default function SimilarProducts({ categoryId, productId }: { categoryId: string, productId: String }) {
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!categoryId || hasLoaded) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasLoaded) {
          setHasLoaded(true);
          setLoading(true);
          setError(null);

          getSimilarProducts(categoryId)
            .then((data) => {
              const products = data.items || data.products || [];
              setSimilarProducts(products);
            })
            .catch((err) => {
              console.error("Failed to load similar products:", err);
              setError("Failed to load similar products");
            })
            .finally(() => setLoading(false));
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
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [categoryId, hasLoaded]);

  const filteredProducts = similarProducts.filter((product: any) => product?.id != productId);

  return (
    <div ref={containerRef} className="px-2">
      <SectionHeader title="Similar Products" actionLabel="" />
      <div className="my-2"></div>

      {loading && (
        <div className="overflow-x-auto overflow-y-hidden gap-x-2 flex no-scrollbar scroll-smooth touch-pan-x">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-[180px] h-[280px] flex-shrink-0 bg-gray-200 rounded-lg animate-pulse" />
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
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {filteredProducts.map((item: any, index: number) => (
            <div key={item.id} className="w-[180px] flex-shrink-0">
              <HomeProductCard 
                api_product={item} 
                allProducts={filteredProducts}
                productIndex={index}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
