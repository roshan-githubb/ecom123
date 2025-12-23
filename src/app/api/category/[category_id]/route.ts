import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { category_id: string } }
) {
    try {
        const categoryId = await params?.category_id;

        if (!categoryId) {
            return NextResponse.json(
                { error: "category_id is required" },
                { status: 400 }
            );
        }

        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
        const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

        if (!backendUrl || !publishableKey) {
            console.error("Missing environment variables:", { backendUrl: !!backendUrl, publishableKey: !!publishableKey });
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        const url = `${backendUrl}/store/products?category_id=${categoryId}&limit=5&fields=*variants.calculated_price,+variants.inventory_quantity,*seller,*variants,*seller.products,*seller.reviews,*seller.reviews.customer`;

        const backendRes = await fetch(url, {
            method: "GET",
            headers: {
                "x-publishable-api-key": publishableKey,
                "Content-Type": "application/json",
            },
        });

        if (!backendRes.ok) {
            console.error("Backend API error:", backendRes.status, backendRes.statusText);
            const errorText = await backendRes.text().catch(() => "No error body");
            console.error("Backend error body:", errorText);
            
            return NextResponse.json(
                { error: "Backend API error", status: backendRes.status },
                { status: 502 }
            );
        }

        const data = await backendRes.json();
        return NextResponse.json(data);
        
    } catch (error) {
        console.error("Category API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch category items", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}