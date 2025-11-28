"use client"

import { usePathname, useRouter } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { CategoryNavbar, NavbarSearch } from "@/components/molecules"
import Image from "next/image"
import { useCartStore } from "@/store/useCartStore"
import { CartIcon } from "@/icons"
import { MobileNavbar } from "../MobileNavbar/MobileNavbar"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { cn } from "@/lib/utils"


export default function Navbar({
  categories,
  parentCategories
}: {
  categories: HttpTypes.StoreProductCategory[],
  parentCategories: HttpTypes.StoreProductCategory[]

}) {
  const pathname = usePathname()
  const router = useRouter()
  const showCart = ["/recommended", "/products"].some(path => pathname?.includes(path));
  const showBackArrow = pathname !== "/np"
  const hiddenPaths = ["/check", "/in/payment", "/in/cardinfo", "/in/imepaynow", "/in/imebottombar",
    "/in/shippinginfo", "/in/pickupaddress", "/in/footer/faq", "/in/footer/track-order", "/in/footer/returns",
    "/in/footer/delivery", "/in/footer/payment", "/in/footer/about-us", "/in/footer/blog", "/in/footer/privacy-policy",
    "/in/footer/terms-and-conditions"];
  const showSearchbar = !hiddenPaths.includes(pathname);
  const showCheckoutLabel = pathname == "/in/check"
  const showPaymentMethodLabel = pathname == "/in/payment"
  const showCardLabel = pathname == "/in/cardinfo"
  const showImePayNowLabel = pathname == "/in/imepaynow"
  const showImePayWalletLink = pathname == "/in/imebottombar"
  const showSelectShippingAddressLabel = pathname == "/in/shippinginfo"
  const showPickupAddressLabel = pathname == "/in/pickupaddress"
  const showFAQLabel = pathname == "/in/footer/faq"
  const showTrackOrderLabel = pathname == "/in/footer/track-order"
  const showReturnsLabel = pathname == "/in/footer/returns"
  const showDeliveryLabel = pathname == "/in/footer/delivery"
  const showPaymentLabel = pathname == "/in/footer/payment"
  const showAboutUsLabel = pathname == "/in/footer/about-us"
  const showBlogLabel = pathname == "/in/footer/blog"
  const showPrivacyPolicyLabel = pathname == "/in/footer/privacy-policy"
  const showTermsAndConditionsLabel = pathname == "/in/footer/terms-and-conditions"


  // Get total items in cart from Zustand store
  const totalItems = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + (item.quantity ?? 0), 0)
  )


  const goToCheckoutPage = () => {
    router.push(`/check`);
  };

  return (
    <div className="flex items-center bg-myBlue px-4 md:px-12 py-4 border-b w-full relative">
      <MobileNavbar
        parentCategories={[]}
        childrenCategories={categories}
      />

      <div className="mr-2 lg:mr-0"></div>
      {/* {showBackArrow && (
        <button
          onClick={() => router.back()}
          className="mt-2 mr-2 flex items-center justify-center rounded"
        >
          <Image
            src="/images/icons/basil_arrow-up-solid.png"
            alt="Back"
            width={24}
            height={24}
          />
        </button>
      )} */}
      <div className="flex items-center w-full">
        {/* Left: nav links (desktop only) */}
        <div className="hidden lg:flex">
          <ul className="flex space-x-6">
      
              <LocalizedClientLink
        key="recommended"
              href="np/recommended"
              className={cn(
                "label-md min-w-[24px] capitalize",
                pathname === "/recommended"
                  ? "text-white font-semibold"
                  : "text-gray-300 hover:text-gray-300"
              )}
            >
              recommended
            </LocalizedClientLink>

            {categories.map((category) => {
              const categoryHref = `/categories/${category?.handle}`
              // console.log('pathname and categoryHref', pathname, `/np${categoryHref}`)

              return (
                <LocalizedClientLink
                  key={category.handle}
                  href={categoryHref}
                  className={cn(
                    "label-md min-w-[24px] capitalize",
                    pathname === `/np${categoryHref}`
                      ? "text-white  font-semibold"
                      : "text-gray-300 hover:text-gray-300"
                  )}
                >
                  {category?.name}
                </LocalizedClientLink>
              )
            })}
          </ul>
        </div>

        {/* Right: search + cart */}
        <div className="flex lg:ml-auto items-center space-x-4">
          {showSearchbar && <NavbarSearch />}
          <CartButton totalItems={totalItems} goToCheckoutPage={goToCheckoutPage} />
        </div>
      </div>




      <div className="mt-2 flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
        {showCheckoutLabel && (
          <span className="text-base font-poppins font-semibold text-white">
            Checkout
          </span>
        )}
      </div>

      <div className="mt-2 mt- flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
        {showPaymentMethodLabel && (
          <span className="text-base font-poppins font-semibold text-white">
            Select Payment Method
          </span>
        )}
      </div>

      <div className="mt-2 mt- flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
        {showCardLabel && (
          <span className="text-base font-poppins font-semibold text-white">
            Debit/Credit Card
          </span>
        )}
      </div>

      <div className="mt-2 mt- flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
        {showImePayNowLabel && (
          <span className="text-base font-poppins font-semibold text-white">
            Khalti by IME
          </span>
        )}
      </div>


      <div className="mt-2 mt- flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
        {showImePayWalletLink && (
          <span className="text-base font-poppins font-semibold text-white">
            IME Pay - Wallet Link
          </span>
        )}
      </div>

      <div className="mt-2 mt- flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
        {showSelectShippingAddressLabel && (
          <span className="text-base font-poppins font-semibold text-white">
            Select Shipping Address
          </span>
        )}
      </div>

      <div className="mt-2 mt- flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
        {showPickupAddressLabel && (
          <span className="text-base font-poppins font-semibold text-white">
            Pick up from
          </span>
        )}
      </div>

      <div className="mt-2 mt- flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
        {showFAQLabel && (
          <span className="text-base font-poppins font-semibold text-white">
            WeeTok Marketplace FAQ
          </span>
        )}
      </div>

      <div className="mt-2 mt- flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
        {showTrackOrderLabel && (
          <span className="text-base font-poppins font-semibold text-white">
            Track Order
          </span>
        )}
      </div>

      <div className="mt-2 mt- flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
        {showReturnsLabel && (
          <span className="text-base font-poppins font-semibold text-white">
            Return Policies
          </span>
        )}
      </div>

      <div className="mt-2 mt- flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
        {showDeliveryLabel && (
          <span className="text-base font-poppins font-semibold text-white">
            Delivery Info
          </span>
        )}
      </div>

      <div className="mt-2 mt- flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
        {showPaymentLabel && (
          <span className="text-base font-poppins font-semibold text-white">
            Payment Info
          </span>
        )}
      </div>

      <div className="mt-2 mt- flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
        {showAboutUsLabel && (
          <span className="text-base font-poppins font-semibold text-white">
            About WeeTok Marketplace
          </span>
        )}
      </div>
      <div className="mt-2 mt- flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
        {showBlogLabel && (
          <span className="text-base font-poppins font-semibold text-white">
            WeeTok Blog
          </span>
        )}
      </div>
      <div className="mt-2 mt- flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
        {showPrivacyPolicyLabel && (
          <span className="text-base font-poppins font-semibold text-white">
            Privacy Policy
          </span>
        )}
      </div>
      <div className="mt-2 mt- flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
        {showTermsAndConditionsLabel && (
          <span className="text-base font-poppins font-semibold text-white">
            WeeTok Marketplace T&C
          </span>
        )}
      </div>

      {/* {showCart && (
        <CartButton totalItems={totalItems} goToCheckoutPage={goToCheckoutPage} />
      )} */}
    </div>
  )
}

const CartButton = ({ totalItems, goToCheckoutPage }: { totalItems: number, goToCheckoutPage: () => void }) => {
  return (
    <button className="ml-5 mt-1 relative" onClick={goToCheckoutPage}>
      <CartIcon size={24} color="white" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </button>
  )
}
