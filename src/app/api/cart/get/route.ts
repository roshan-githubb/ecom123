import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { cart_id } = await req.json();

  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

  const res = await fetch(`${backendUrl}/store/carts/${cart_id}`, {
    method: "GET",
    headers: {
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  return NextResponse.json(data);
}
