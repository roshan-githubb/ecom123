"use client";

import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/atoms/SectionHeader/SectionHeader";
import { HomeProductCard } from "@/components/molecules/HomeProductCard/HomeProductCard";
import { getSimilarProducts } from "@/services/category-products/category-products";
import { String } from "lodash";

export default function SimilarProducts({ categoryId, productId }: { categoryId: string, productId: String }) {
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;

    getSimilarProducts(categoryId)
      .then((data) => {
        setSimilarProducts(data.items || data.products || []);
      })
      .finally(() => setLoading(false));
  }, [categoryId]);

  if (loading) return <p>Loading...</p>;
  

  return (
    <div className="px-2">
      <SectionHeader title="Similar Products" actionLabel="" />
      <div className="my-2"></div>

      <div className="overflow-x-scroll gap-x-2 flex no-scrollbar">
        {similarProducts.filter((product: any)=> product?.id != productId).map((item: any) => (
          <div key={item.id} className="w-[180px] flex-shrink-0">
            <HomeProductCard api_product={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
