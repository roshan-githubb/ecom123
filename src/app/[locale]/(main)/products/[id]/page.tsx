import { notFound } from "next/navigation";
import ProductDetailClient from "../../ProductDetailClient/page";
import { Review, ReviewListResponse } from "@/types/reviews";
import { Suspense } from "react";
import ProductDetailSkeleton from "@/components/organisms/ProductDetailPageSkeleton/ProductDetailPageSkeleton";

interface Params {
  id: string;
  locale: string;
}

export default async function ItemDetailPage({ params }: { params: Params }) {
  const { id, locale } = await params;


  const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/products/${id}?region_id=${process.env.NEXT_PUBLIC_REGION_ID}`;


  try {
    const headers = {
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
      "Content-Type": "application/json",
    };

    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers,
    });
    // console.log("Fetch product detail response status:", res);




    // Log the exact error body from Medusa (super useful!)
    if (!res.ok) {
      const errorText = await res.text();

      return notFound();
    }

    const data = await res.json();
    // console.log("Full response from Medusa:", data);

    const product = data.product;
    // console.log("Product object:", product);

    if (!product) {

      return notFound();
    }


    const reviewUrl = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/products/${id}/reviews?limit=10&offset=0`; 
    const reviewRes = await fetch(reviewUrl, {
      method: "GET",
      cache: "no-store",
      headers,
    });

    let reviews: Review[] = [];

    if (reviewRes.ok) {
      const reviewData: ReviewListResponse = await reviewRes.json();
      reviews = reviewData.reviews || [];
    } else {
    }
    return <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailClient product={product} reviews={reviews} />
    </Suspense>
  } catch (err) {
    console.error("Error fetching product detail data:", err);

    return notFound();
  }
}