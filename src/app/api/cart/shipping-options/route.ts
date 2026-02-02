import { listCartShippingMethods } from "@/lib/data/fulfillment"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const cartId = searchParams.get('cart_id')
    
    if (!cartId) {
      return NextResponse.json(
        { error: "cart_id is required" },
        { status: 400 }
      )
    }
    
    const shippingMethods = await listCartShippingMethods(cartId)
    
    return NextResponse.json({ shipping_options: shippingMethods || [] })
  } catch (error: any) {
    console.error('Error fetching shipping methods:', error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch shipping methods" },
      { status: 500 }
    )
  }
}
