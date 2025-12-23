import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: { category_id: string } }
) {
  console.log("category items route ");

  try {
    const { category_id: categoryId } = await context.params;

    console.log("Fetching items for category ID:", categoryId);

    if (!categoryId) {
      return NextResponse.json(
        { error: "category_id is required" },
        { status: 400 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

    const backendRes = await fetch(
      `${backendUrl}/store/products?category_id=${categoryId}&limit=4&fields=*variants.calculated_price,+variants.inventory_quantity,*seller,*variants,*seller.products,*seller.reviews,*seller.reviews.customer`,
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
      { error: "Failed to fetch category items" },
      { status: 500 }
    );
  }
}
