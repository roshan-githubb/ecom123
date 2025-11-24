import { notFound } from "next/navigation";
import ProductDetailClient from "../../ProductDetailClient/page";

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

    


    // Log the exact error body from Medusa (super useful!)
    if (!res.ok) {
      const errorText = await res.text();
      
      return notFound();
    }

    const data = await res.json();
    console.log("Full response from Medusa:", data);

    const product = data.product;
    console.log("Product object:", product);

    if (!product) {
     
      return notFound();
    }

    return <ProductDetailClient product={product} />;
  } catch (err) {
    
    return notFound();
  }
}