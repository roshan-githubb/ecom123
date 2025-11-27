"use client"

import { usePathname, useRouter } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { CategoryNavbar, NavbarSearch } from "@/components/molecules"
import Image from "next/image"
import { useCartStore } from "@/store/useCartStore"

export default function Navbar({
  categories,
}: {
  categories: HttpTypes.StoreProductCategory[]
}) {
  const pathname = usePathname()
  const router = useRouter()
  const showCart = ["/recommended", "/products"].some(path => pathname?.includes(path));
  const showBackArrow = pathname !== ""
  const showSearchbar = pathname !== "/check"
  const showCheckoutLabel = pathname == "/check"

  // Get total items in cart from Zustand store
  const totalItems = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + (item.quantity ?? 0), 0)
  )


  const goToCheckoutPage = () => {
  router.push(`/check`);
};

  return (
    <div className="flex items-center bg-myBlue px-4 md:px-12 py-4 border-b w-full relative">
      {showBackArrow && (
        <button
          onClick={() => router.back()}
          className="mt-2 mr-2 flex items-center justify-center rounded hover:bg-gray-200"
        >
          <Image
            src="/images/icons/basil_arrow-up-solid.png"
            alt="Back"
            width={24}
            height={24}
          />
        </button>
      )}

      <div className="lg:flex-1">{showSearchbar && <NavbarSearch />}</div>

      <div className="mt-2 flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
        {showCheckoutLabel && (
          <span className="text-base font-poppins font-semibold text-white">
            Checkout
          </span>
        )}
      </div>

      {showCart && (
        <button className="ml-5 mt-1 relative" onClick={goToCheckoutPage}>
          <Image
            src="/images/icons/cart.png"
            alt="Cart"
            width={24}
            height={24}
          />
          {/* Badge showing total items */}
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      )}
    </div>
  )
}
