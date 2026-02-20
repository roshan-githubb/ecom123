import type { Metadata } from "next"
import { Funnel_Display, Poppins } from "next/font/google"
import './globals.css'
import { Toaster } from "@medusajs/ui"
import { Toaster as HotToaster } from "react-hot-toast"
import Head from "next/head"
import { retrieveCart } from "@/lib/data/cart"
import { Providers } from "./providers"
import Script from "next/script"
import ScrollToTop from "@/components/utils/ScrollToTop"
import { FirebaseProvider } from "@/components/providers"

// Existing Funnel_Display font (optional, still available)
const funnelDisplay = Funnel_Display({
  variable: "--font-funnel-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
})

// Poppins font for global use
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: {
    template: `%s | ${
      process.env.NEXT_PUBLIC_SITE_NAME ||
      "Saransa - Marketplace Storefront"
    }`,
    default:
      process.env.NEXT_PUBLIC_SITE_NAME ||
      "Saransa - Marketplace Storefront",
  },
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "Saransa - Marketplace Storefront",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  alternates: {
    languages: {
      "x-default": process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    },
  },
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  // REMOVED: Cart fetching moved to client-side CartProvider
  // This allows the layout to render instantly without waiting for cart API

  const ALGOLIA_APP = process.env.NEXT_PUBLIC_ALGOLIA_ID
  const htmlLang = locale || "en"

  return (
    <html lang={htmlLang} className={poppins.variable}>
      <Head>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://i.imgur.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://i.imgur.com" />
        {ALGOLIA_APP && (
          <>
            <link
              rel="preconnect"
              href="https://algolia.net"
              crossOrigin="anonymous"
            />
            <link
              rel="preconnect"
              href="https://algolianet.com"
              crossOrigin="anonymous"
            />
            <link rel="dns-prefetch" href="https://algolia.net" />
            <link rel="dns-prefetch" href="https://algolianet.com" />
          </>
        )}
        {/* Image origins for faster LCP */}
        <link
          rel="preconnect"
          href="https://medusa-public-images.s3.eu-west-1.amazonaws.com"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://medusa-public-images.s3.eu-west-1.amazonaws.com"
        />
        <link
          rel="preconnect"
          href="https://mercur-connect.s3.eu-central-1.amazonaws.com"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://mercur-connect.s3.eu-central-1.amazonaws.com"
        />
        <link
          rel="preconnect"
          href="https://s3.eu-central-1.amazonaws.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://s3.eu-central-1.amazonaws.com" />
        <link
          rel="preconnect"
          href="https://api.mercurjs.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://api.mercurjs.com" />
      </Head>
      <body
        className={`${poppins.variable} antialiased bg-primary text-secondary relative`}
      >
        <Script
          src="/flutter-listener.js"
          strategy="beforeInteractive"
        />
        <ScrollToTop />
        <FirebaseProvider>
          <Providers cart={null}>{children}</Providers>
        </FirebaseProvider>
        <Toaster position="top-right" />
        <HotToaster position="top-right" />
      </body>
    </html>
  )
}
