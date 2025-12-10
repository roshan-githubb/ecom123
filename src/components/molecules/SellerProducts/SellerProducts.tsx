"use client";

import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/atoms/SectionHeader/SectionHeader";
import { HomeProductCard } from "@/components/molecules/HomeProductCard/HomeProductCard";
import { getSellerItems } from "@/services/seller-products/seller-products";

export default function SellerProducts({ sellerId }: { sellerId: string }) {
  const [sellerItems, setSellerItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) return;

    getSellerItems(sellerId)
      .then((data) => {
        setSellerItems(data.items || data.products || []);
      })
      .finally(() => setLoading(false));
  }, [sellerId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="px-2">
      <SectionHeader title="Seller Products" actionLabel="See All" />
      <div className="my-2"></div>

      <div className="overflow-x-scroll gap-x-2 flex no-scrollbar">
        {sellerItems.map((item: any) => (
          <div key={item.id} className="w-[180px] flex-shrink-0">
            <HomeProductCard api_product={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
