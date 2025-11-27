export interface OrderSummaryItem {
    lineId: string;
    productId: string;
    variantId: string;
    title: string;
    variantTitle: string;
    thumbnail: string | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface OrderSummaryData {
    cartId: string;
    currency: string;

    items: OrderSummaryItem[];

    subtotal: number;
    deliveryFee: number;
    serviceFee: number;
    totalPayable: number;
    taxTotal: number;
}



export function mapCartToOrderSummary(cart: any): OrderSummaryData {
    // console.log("inside mapper ", cart)
    // const items = cart.items?.map((item: any) => ({
    //     lineId: item.id,
    //     productId: item.product_id,
    //     variantId: item.variant_id,
    //     title: item.product?.title || item.title,
    //     variantTitle: item.variant?.title || item.variant_title || "",
    //     thumbnail: item.thumbnail ?? item.product?.thumbnail ?? "/images/not-available/not-available.png",
    //     quantity: item.quantity,
    //     unitPrice: item.unit_price || 0,
    //     totalPrice: item.quantity * item.unit_price,
    // })) || [];

    const items = cart.items?.map((item: any) => ({
        lineId: item.id,
        productId: item.productId,
        variantId: item.variantId,
        title: item.title,
        variantTitle: item.variantTitle,
        thumbnail: item.image ?? "/images/not-available/not-available.png",
        quantity: item.quantity,
        unitPrice: item.price || 0,
        totalPrice: item.totalPrice,
    })) || [];

    const subtotal = cart.subtotal ?? cart.item_total ?? 0;

    const deliveryFee = cart?.shipping_totla ?? 0;
    const taxTotal = cart?.taxt_total ?? 0;
    const serviceFee = 0;

    // console.log('map cart ', cart?.total)
    const totalPayable = cart?.totalPayable ?? 0;

    const currency = cart?.currency_code ?? "NPR"

    return {
        cartId: cart.id,
        currency: currency.toUpperCase(),

        items,

        subtotal,
        deliveryFee,
        serviceFee,
        taxTotal,
        totalPayable,
    };
}
