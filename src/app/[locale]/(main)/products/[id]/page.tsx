import { notFound } from "next/navigation";
import ProductDetailClient from "../../ProductDetailClient/page";
import { Review, ReviewListResponse } from "@/types/reviews";

interface Params {
  id: string;
  locale: string;
}

export default async function ItemDetailPage({ params }: { params: Params }) {
  const { id, locale } = await params;


const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/products/${id}`;


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

    


    // Log the exact error body from Medusa (super useful!)
    if (!res.ok) {
      const errorText = await res.text();
      
      return notFound();
    }

    const data = await res.json();
    // console.log("Full response from Medusa:", data);

    const product = data.product;
    console.log("Product object:", product);

    if (!product) {
     
      return notFound();
    }


      const reviewUrl = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/products/${id}/reviews?limit=10&offset=0`;    const reviewRes = await fetch(reviewUrl, {
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
    return <ProductDetailClient product={product} reviews={reviews} />;
  } catch (err) {
    
    return notFound();
  }
}