import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pidx = searchParams.get("pidx");
    const status = searchParams.get("status");
    const purchase_order_id = searchParams.get("purchase_order_id");

    if (!pidx) {
      return NextResponse.json(
        { error: "Missing payment index (pidx)" },
        { status: 400 }
      );
    }

    if (!process.env.KHALTI_SECRET_KEY) {
      console.error("KHALTI_SECRET_KEY is not configured");
      return NextResponse.json(
        { error: "Payment verification not configured" },
        { status: 500 }
      );
    }

    const verifyResponse = await fetch(
      `https://a.khalti.com/api/v2/epayment/lookup/`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pidx }),
      }
    );

    if (!verifyResponse.ok) {
      const errorData = await verifyResponse.json().catch(() => ({}));
      console.error("Khalti verification failed:", errorData);
      return NextResponse.json(
        { error: "Payment verification failed", details: errorData },
        { status: 400 }
      );
    }

    const verificationData = await verifyResponse.json();

    if (verificationData.status !== "Completed") {
      return NextResponse.json(
        {
          error: "Payment not completed",
          status: verificationData.status,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      transactionId: verificationData.transaction_id,
      amount: verificationData.total_amount / 100, 
      status: verificationData.status,
      purchase_order_id: verificationData.purchase_order_id,
    });
  } catch (error) {
    console.error("Khalti verification error:", error);
    return NextResponse.json(
      {
        error: "Payment verification failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
