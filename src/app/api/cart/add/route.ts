import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { cart_id, variant_id, quantity } = await req.json();

  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

  const res = await fetch(`${backendUrl}/store/carts/${cart_id}/line-items`, {
    method: "POST",
    headers: {
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      variant_id,
      quantity,
    }),
  });

  const data = await res.json();
  
  if (cart_id) {
    const cookieStore = await cookies();
    cookieStore.set('_medusa_cart_id', cart_id, {
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
  }
  
  return NextResponse.json(data);
}
