import { SellerPage } from "@/components/SellerPage";
import { fetchProductRatingSummary } from "@/lib/api/reviews";
import { RatingSummary } from "@/types/reviews";

async function getSellerProducts(sellerId: string) {
    const regionId = process.env.NEXT_PUBLIC_REGION_ID;
    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

    try {
        const url = `${backendUrl}/store/products?sales_channel_id=${sellerId}&region_id=${regionId}&fields=*variants.calculated_price,+variants.inventory_quantity,*seller,*variants,*seller.products,*seller.reviews,*seller.reviews.customer`;

        const res = await fetch(url, {
            headers: {
                "x-publishable-api-key":
                    publishableKey!,
            },
            next: { revalidate: 0 },
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch products, status: ${res.status}`);
        }

        const json = await res.json();
        return json;
    } catch (error) {
        console.error("Error fetching seller products:", error);
        return { products: [] };
    }
}

export default async function Page({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const sellerHandle = searchParams.seller_handle as string;
    const sellerId = searchParams.seller_id as string;

    const sellerIdentifier = sellerHandle || sellerId;

    if (!sellerIdentifier) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-500">
                Seller handle or ID is required
            </div>
        );
    }

    const data = await getSellerProducts(sellerIdentifier);
    const products = data.products || [];


    const seller = products.length > 0 && products[0].seller
        ? {
              id: products[0].seller.id,
              name: products[0].seller.name || products[0].seller.handle,
              handle: products[0].seller.handle,
          }
        : undefined;


    const ratingsMap: Record<string, RatingSummary> = await Promise.all(
        products.map(async (product: any) => {
            const summary = await fetchProductRatingSummary(product.id)
            return [product.id, summary] as const
        })
    ).then(Object.fromEntries)


    return <SellerPage products={products} seller={seller} ratingsMap={ratingsMap} />;
}
