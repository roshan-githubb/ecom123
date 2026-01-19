import { addCustomerAddress } from "@/lib/data/customer"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Convert JSON to FormData
    const formData = new FormData()
    Object.keys(body).forEach(key => {
      formData.set(key, body[key])
    })
    
    
    const result = await addCustomerAddress(formData)
    
    if (result.success) {
      return NextResponse.json(result, { status: 200 })
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to add address" },
      { status: 500 }
    )
  }
}
