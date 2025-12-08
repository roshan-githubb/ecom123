export async function getFlashSaleProducts({
    // min_discount = 5,
    min_discount,
    max_discount,
    region_id,
    currency_code = 'npr',
    category_id,
    limit = 20,
    offset = 0,
    fields = "*variants.calculated_price,+variants.inventory_quantity,*variants",
    // fields = "*variants.calculated_price,+variants.inventory_quantity,*seller,*variants,*seller.products,*seller.reviews,*seller.reviews.customer",
}: {
    min_discount?: number;
    max_discount?: number;
    region_id?: string;
    currency_code?: string;
    category_id?: string;
    limit?: number;
    offset?: number;
    fields?: string;
}) {
    const params = new URLSearchParams()
    region_id = region_id || process.env.NEXT_PUBLIC_REGION_ID;

    if (min_discount != null) params.append("min_discount", min_discount.toString())
    if (max_discount != null) params.append("max_discount", max_discount.toString())
    if (region_id) params.append("region_id", region_id)
    if (currency_code) params.append("currency_code", currency_code)
    if (category_id) params.append("category_id", category_id)

    params.append("limit", limit.toString())
    params.append("offset", offset.toString())
    params.append("fields", fields)
    // console.log("Fetching flash sale products with params: ", params.toString());

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/flash-sale-products?${params.toString()}`,
        {
            method: "GET",
            headers: {
                "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
                "Content-Type": "application/json",
            },
        },

    )

    if (!res.ok) throw new Error("Failed to fetch flash sale products ",)

    return res.json()
}
// ?${params.toString()}