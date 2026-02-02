import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

  const res = await fetch(`${backendUrl}/store/carts`, {
    method: "POST",
    headers: {
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  
  if (data?.cart?.id) {
    const cookieStore = await cookies();
    cookieStore.set('_medusa_cart_id', data.cart.id, {
      maxAge: 60 * 60 * 24 * 7, 
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
  }
  
  return NextResponse.json(data);
}
