import Medusa from "@medusajs/js-sdk"

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

export async function fetchQuery(
  url: string,
  { method = "GET", query, headers, body }: any = {}
) {
  const params = query
    ? "?" +
      Object.entries(query)
        .filter(([_, v]) => v != null)
        .map(([k, v]) => `${k}=${v}`)
        .join("&")
    : ""

  const res = await fetch(`${MEDUSA_BACKEND_URL}${url}${params}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
      ...headers,
    },
    body: body ? JSON.stringify(body) : null,
    credentials: "include", 
  })

  let data
  try {
    data = await res.json()
  } catch {
    data = { message: res.statusText }
  }

  return { ok: res.ok, status: res.status, data, error: res.ok ? null : data }
}


export const publicProductClient = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
  // auth: false,
  // This is the magic: no cookies, no auth headers ever
  // requestConfig: {
  //   credentials: "omit",
  //   headers: {
  //     "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
  //   },
  // },
})