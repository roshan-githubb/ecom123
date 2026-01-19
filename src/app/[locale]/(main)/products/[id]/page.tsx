import { notFound } from "next/navigation";
import ProductDetailClient from "../../ProductDetailClient/page";
import { Review, ReviewListResponse } from "@/types/reviews";
import { listProducts } from "@/lib/data/products";
import { publicProductClient } from "@/lib/config";

export const revalidate = 0; // Disable caching for this page

interface Params {
  id: string;
  locale: string;
}

export default async function ItemDetailPage({ params }: { params: Params }) {
  const { id, locale } = await params;

  try {
    const response = await publicProductClient.store.product.retrieve(
      id,
      {
        region_id: process.env.NEXT_PUBLIC_REGION_ID!,
        fields: "*variants.calculated_price,+variants.inventory_quantity"
      }
    );

    const product = response.product;
    
    // ===== DETAILED FIELD LOGGING =====
    console.log("\n========== PRODUCT FIELD ANALYSIS ==========");
    console.log("Product ID:", id);
    
    // Helper function to check field status
    const logField = (fieldName: string, value: any, depth = 0) => {
      const indent = "  ".repeat(depth);
      if (value === null) {
        console.log(`${indent}❌ ${fieldName}: NULL`);
      } else if (value === undefined) {
        console.log(`${indent}⚠️  ${fieldName}: UNDEFINED`);
      } else if (Array.isArray(value)) {
        console.log(`${indent}✅ ${fieldName}: Array[${value.length}]`);
      } else if (typeof value === 'object') {
        console.log(`${indent}✅ ${fieldName}: Object`);
      } else {
        console.log(`${indent}✅ ${fieldName}: ${typeof value} = ${String(value).substring(0, 50)}`);
      }
    };
    
    // Log top-level fields
    if (product) {
      Object.keys(product).forEach(key => {
        logField(key, (product as any)[key]);
      });
      
      // Log variant details
      if (product.variants && Array.isArray(product.variants)) {
        console.log("\n--- VARIANTS DETAILS ---");
        product.variants.forEach((variant: any, idx: number) => {
          console.log(`\nVariant ${idx}:`);
          Object.keys(variant).forEach(key => {
            logField(key, variant[key], 1);
          });
        });
      }
      
      // Log seller details (if exists as custom field)
      if ((product as any).seller) {
        console.log("\n--- SELLER DETAILS ---");
        Object.keys((product as any).seller).forEach((key: string) => {
          logField(key, (product as any).seller[key], 1);
        });
      }
    }
    console.log("==========================================\n");
    // ===== END LOGGING =====

    if (!product) {
      console.error("Product missing or filtered out:", id);
      return notFound();
    }

    const headers = {
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
      "Content-Type": "application/json",
    };

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
    }

    // Fetch related products using listProducts
    const { response: { products: relatedProducts } } = await listProducts({
      pageParam: 1,
      queryParams: { limit: 8 },
      countryCode: "np",
    });

    return <ProductDetailClient product={product as any} reviews={reviews} />
  } catch (err) {
    console.error("Error fetching product detail data:", err);

    return notFound();
  }
}