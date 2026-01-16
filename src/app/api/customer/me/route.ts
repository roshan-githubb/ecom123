import { retrieveCustomer } from "@/lib/data/customer"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    // Get the JWT token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get('_medusa_jwt')?.value
    
    console.log("🔐 API /customer/me: Token exists?", !!token)
    
    if (!token) {
      console.log("❌ API /customer/me: No token found in cookies")
      return NextResponse.json({ customer: null }, { status: 200 })
    }
    
    const customer = await retrieveCustomer()
    
    console.log("👤 API /customer/me: Customer found?", !!customer, customer?.email)
    
    if (!customer) {
      return NextResponse.json({ customer: null }, { status: 200 })
    }

    return NextResponse.json({ customer }, { status: 200 })
  } catch (error) {
    console.error("❌ API /customer/me: Error fetching customer:", error)
    return NextResponse.json(
      { error: "Failed to fetch customer" },
      { status: 500 }
    )
  }
}
