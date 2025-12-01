// import { retrieveCustomer } from "@/lib/data/customer"
// import { redirect } from "next/navigation"
// import { isEmpty } from "lodash"
// import { Wishlist as WishlistType } from "@/types/wishlist"
// import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
// import { Button } from "@/components/atoms"
// import { WishlistItem } from "@/components/cells"
// import { getUserWishlists } from "@/lib/data/wishlist"
// import { HttpTypes } from "@medusajs/types"
import { UserNavigation } from "@/components/molecules"
import { WishlistCard } from "@/components/cells/WishlistCard/WishlistCard"

const MOCK_WISHLIST = [
  {
    id: "prod_1",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones, 30 Hours Battery Life",
    thumbnail: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop",
    price: "NRs. 349.00",
    rating: 4.5,
    reviews: 1234,
    inStock: true,
    description: "Industry-leading noise cancellation optimized to you",
  },
  {
    id: "prod_2",
    title: "Apple Watch Series 9 [GPS 45mm] Smartwatch with Midnight Aluminum Case",
    thumbnail: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1000&auto=format&fit=crop",
    price: "NRs. 459.00",
    rating: 4.8,
    reviews: 856,
    inStock: true,
    description: "Smarter. Brighter. Mightier.",
  },
  {
    id: "prod_3",
    title: "Kindle Paperwhite (16 GB) – Now with a 6.8\" display and adjustable warm light",
    thumbnail: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop",
    price: "NRs. 169.99",
    rating: 4.7,
    reviews: 5432,
    inStock: false,
    description: "Purpose-built for reading – With a flush-front design and 300 ppi glare-free display.",
  },
  {
    id: "prod_4",
    title: "Casual sneaker similar to converse | Fancy street sneaker | Red",
    thumbnail: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=398&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "NRs. 64.99",
    rating: 4.6,
    reviews: 2341,
    inStock: true,
    description: "Our new sneaker for street.",
  },
]

export default async function Wishlist() {
  // const user = await retrieveCustomer()
  // if (!user) redirect("/user")

  return (
    <main className="container">
      <div className="grid grid-cols-1">
        {/* <UserNavigation /> */}
        <div className="mt-3 md:col-span-3 space-y-6">
          <div className="flex justify-between items-end border-b border-secondary pb-2">
            <h1 className="heading-md">Your Wish List</h1>
          </div>

          <div className="flex justify-end">
            <span className="text-sm text-secondary">Filter & Sort</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {MOCK_WISHLIST.map((product) => (
              <WishlistCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
