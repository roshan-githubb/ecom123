import { NextResponse } from "next/server";


export async function POST(req: Request) {
    console.log("category items route ")

    const { categoryId } = await req.json();
    console.log("category items route ", categoryId)

  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

  const res = await fetch(`${backendUrl}/store/products/category_id=${categoryId}`, {
    method: "GET",
    headers: {
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  console.log("category items data ", data)
  return NextResponse.json(data);
}
