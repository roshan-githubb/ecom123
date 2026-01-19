import { NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { getCacheTag, setAuthToken } from "@/lib/data/cookies"


export async function POST(req: Request) {
  try {
    const { token } = await req.json()
    

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 400 }
      )
    }

    await setAuthToken(token)
    await setAuthToken(token)

    // Optional but recommended (matches your login behavior)
    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    )
  }
}
