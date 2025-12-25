import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cart_id, email, shipping_address } = body;

    if (!cart_id) {
      return NextResponse.json({ error: "cart_id is required" }, { status: 400 });
    }

    if (!shipping_address) {
      return NextResponse.json({ error: "shipping_address is required" }, { status: 400 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

    if (!backendUrl || !publishableKey) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    
    const updatePayload: any = {
      shipping_address,
      billing_address: shipping_address, 
    };

  
    if (email) {
      updatePayload.email = email;
    }

    console.log("Updating cart address:", { cart_id, updatePayload });

    const res = await fetch(`${backendUrl}/store/carts/${cart_id}`, {
      method: "POST",
      headers: {
        "x-publishable-api-key": publishableKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatePayload),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "Unknown error");
      console.error("Backend error updating cart address:", res.status, errorText);
      return NextResponse.json(
        { error: "Failed to update cart address", details: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log("Cart address updated successfully");
    return NextResponse.json(data);

  } catch (error) {
    console.error("Error updating cart address:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
