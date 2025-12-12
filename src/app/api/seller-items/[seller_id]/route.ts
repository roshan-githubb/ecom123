import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { seller_id: string } }
) {
  console.log("seller items route ")
  try {
    const sellerId = params?.seller_id;
    console.log("Fetching items for seller ID:", sellerId);

    if (!sellerId) {
      return NextResponse.json(
        { error: "seller_id is required" },
        { status: 400 }
      );
    }

    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/products?sales_channel_id=${sellerId}&region_id=${process.env.NEXT_PUBLIC_REGION_ID}&fields=*variants.calculated_price,+variants.inventory_quantity,*seller,*variants,*seller.products,*seller.reviews,*seller.reviews.customer`,
      {
        method: "GET",
        headers: {
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch seller items" },
      { status: 500 }
    );
  }
}