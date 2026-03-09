import { retrieveCustomer } from "@/lib/data/customer"
import { getUserWishlists, getWishlistProductsWithPrices } from "@/lib/data/wishlist"
import { Heart } from "lucide-react"
import { redirect } from "next/navigation"
import WishlistPageClient from "./WishlistPageClient"

export default async function WishlistPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const customer = await retrieveCustomer()

  if (!customer) {
    redirect("/login")
  }

  const wishlistData = await getUserWishlists()
  const wishlist = wishlistData?.wishlists || []
  const wishlistProducts = wishlist[0]?.products || []
  const wishlistId = wishlist[0]?.id || ""

  const productIds = wishlistProducts.map((p: any) => p.id)
  const productsWithPrices = await getWishlistProductsWithPrices(productIds, locale)

  if (process.env.NODE_ENV === 'development') {
    productsWithPrices.forEach((p: any) => {
      if (!p.seller && !p.store) {
        console.warn(`Product ${p.id} (${p.title}) is missing seller/store data`)
      }
    })
  }

  const mergedProducts = wishlistProducts.map((wishlistProduct: any) => {
    const productWithPrice = productsWithPrices.find((p: any) => p.id === wishlistProduct.id)
    
    if (!productWithPrice) {
      console.warn(`Product ${wishlistProduct.id} not found in price data`)
      return wishlistProduct
    }
    
    return {
      ...productWithPrice,
      thumbnail: productWithPrice.thumbnail || wishlistProduct.thumbnail,
    }
  })

  return (
    <main className="container pt-4 pb-6 sm:pt-6">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#32425A]">
          My Wishlist
        </h1>
      </div>

      <WishlistPageClient initialProducts={mergedProducts} wishlistId={wishlistId} />
    </main>
  )
}
