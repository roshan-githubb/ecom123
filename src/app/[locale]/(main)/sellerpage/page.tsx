import { SellerPage, Seller } from "@/components/SellerPage";
import { getProductRatingSummaries } from "@/lib/helpers/rating-helpers";
import { SimpleRatingSummary } from "@/types/reviews";
import { getSellerByHandle, getProductsBySellerId } from "@/lib/data/seller";
import { SortOptions } from "@/types/product";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const sellerHandle = params.seller_handle as string;
    const sellerId = params.seller_id as string;
    const page = parseInt((params.page as string) || "1");
    const limit = parseInt((params.limit as string) || "12");
    const sortBy = (params.sort as SortOptions) || "created_at";
    const filter = params.filter as string;
    const countryCode = "np"; // Default country code

    const sellerIdentifier = sellerHandle || sellerId;

    console.log("Seller page params:", { sellerHandle, sellerId, sellerIdentifier, sortBy, filter });

    if (!sellerIdentifier) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-500">
                Seller handle or ID is required
            </div>
        );
    }

    let seller: Seller | undefined = undefined;
    let products: any[] = [];

    try {
        // If we have a handle, get seller info first
        if (sellerHandle) {
            console.log("Fetching seller by handle:", sellerHandle);
            const sellerData = await getSellerByHandle(sellerHandle);
            console.log("Seller data:", sellerData);
            
            if (!sellerData) {
                return (
                    <div className="flex items-center justify-center min-h-screen text-gray-500">
                        Seller not found
                    </div>
                );
            }
            
            seller = {
                id: sellerData.id,
                name: sellerData.name || sellerData.handle,
                handle: sellerData.handle,
            };
            
            console.log("Fetching products for seller ID:", sellerData.id);
            // Get products using seller ID
            const productsData = await getProductsBySellerId({
                sellerId: sellerData.id,
                page,
                limit,
                sortBy,
                countryCode,
            });
            console.log("Products data:", productsData);
            products = productsData?.response?.products || [];
        } else if (sellerId) {
            console.log("Fetching products for seller ID:", sellerId);
            // If we only have seller ID, get products directly
            const productsData = await getProductsBySellerId({
                sellerId,
                page,
                limit,
                sortBy,
                countryCode,
            });
            console.log("Products data:", productsData);
            products = productsData?.response?.products || [];
            
            // Extract seller info from first product if available
            if (products.length > 0 && products[0].seller) {
                seller = {
                    id: products[0].seller.id,
                    name: products[0].seller.name || products[0].seller.handle,
                    handle: products[0].seller.handle,
                };
            }
        }

        console.log("Final products count:", products.length);
        console.log("Final seller:", seller);

    } catch (error) {
        console.error("Error fetching seller data:", error);
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-500">
                Error loading seller data: {error instanceof Error ? error.message : 'Unknown error'}
            </div>
        );
    }

    const productIds = products.map((product: any) => product.id);
    const ratingsMap: Record<string, SimpleRatingSummary> = await getProductRatingSummaries(productIds);

    // Apply client-side filtering
    let filteredProducts = products;
    if (filter && filter !== 'all') {
        filteredProducts = products.filter((product: any) => {
            const firstVariant = product.variants?.[0];
            if (!firstVariant?.calculated_price) return false;

            const price = Number(firstVariant.calculated_price.calculated_amount);
            const mrp = Number(firstVariant.calculated_price.original_amount);
            const isOnSale = mrp > price;
            const isInStock = (firstVariant.inventory_quantity || 0) > 0;

            switch (filter) {
                case 'in_stock':
                    return isInStock;
                case 'on_sale':
                    return isOnSale;
                case 'low_price':
                    return price < 1000;
                case 'high_price':
                    return price > 5000;
                default:
                    return true;
            }
        });
    }

    // Apply client-side sorting
    if (sortBy && sortBy !== 'created_at') {
        filteredProducts = [...filteredProducts].sort((a: any, b: any) => {
            const aVariant = a.variants?.[0];
            const bVariant = b.variants?.[0];

            switch (sortBy) {
                case 'price_asc':
                    const aPrice = Number(aVariant?.calculated_price?.calculated_amount || 0);
                    const bPrice = Number(bVariant?.calculated_price?.calculated_amount || 0);
                    return aPrice - bPrice;
                case 'price_desc':
                    const aPriceDesc = Number(aVariant?.calculated_price?.calculated_amount || 0);
                    const bPriceDesc = Number(bVariant?.calculated_price?.calculated_amount || 0);
                    return bPriceDesc - aPriceDesc;
                case 'title_asc':
                    return a.title.localeCompare(b.title);
                case 'title_desc':
                    return b.title.localeCompare(a.title);
                default:
                    return 0;
            }
        });
    }

    return <SellerPage products={filteredProducts} seller={seller} ratingsMap={ratingsMap} />;
}
