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
import { useFlutterBridge } from "@/hooks/useFlutterBridge"
// import { isFlutterWebView } from "@/lib/env/isFlutterWebView"
import { usePreviousPath } from "@/hooks/usePreviousPaths"
import { useCallback, useState } from "react"

export default function Navbar({
  hierarchicalCategories,
}: {
  hierarchicalCategories: HttpTypes.StoreProductCategory[]
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { exitWebView } = useFlutterBridge()
  const [isExiting, setIsExiting] = useState(false)
  const isHomePage = pathname === "/np"
  const showCart = ["/recommended", "/products"].some((path) =>
    pathname?.includes(path)
  )
  const showBackArrow = !isHomePage
  const hiddenPaths = [
    "/np/check",
    "/np/payment",
    "/np/cardinfo",
    "/np/imepaynow",
    "/np/imebottombar",
    "/np/shippinginfo",
    "/np/pickupaddress",
    "/np/footer/faq",
    "/np/footer/track-order",
    "/np/footer/returns",
    "/np/footer/delivery",
    "/np/footer/payment",
    "/np/footer/about-us",
    "/np/footer/blog",
    "/np/footer/privacy-policy",
    "/np/footer/terms-and-conditions",
  ]
  const showSearchbar = !hiddenPaths.includes(pathname)
  const showCheckoutLabel = pathname == "/np/check"
  const showPaymentMethodLabel = pathname == "/np/payment"
  const showCardLabel = pathname == "/np/cardinfo"
  const showImePayNowLabel = pathname == "/np/imepaynow"
  const showImePayWalletLink = pathname == "/np/imebottombar"
  const showSelectShippingAddressLabel = pathname == "/np/shippinginfo"
  const showPickupAddressLabel = pathname == "/np/pickupaddress"
  const showFAQLabel = pathname == "/np/footer/faq"
  const showTrackOrderLabel = pathname == "/np/footer/track-order"
  const showReturnsLabel = pathname == "/np/footer/returns"
  const showDeliveryLabel = pathname == "/np/footer/delivery"
  const showPaymentLabel = pathname == "/np/footer/payment"
  const showAboutUsLabel = pathname == "/np/footer/about-us"
  const showBlogLabel = pathname == "/np/footer/blog"
  const showPrivacyPolicyLabel = pathname == "/np/footer/privacy-policy"
  const showTermsAndConditionsLabel =
    pathname == "/np/footer/terms-and-conditions"

  const prevPath = usePreviousPath()

  const handleBack = () => {
    // if (prevPath) router.push(prevPath)
    // else router.push("/np")
    router.back()
  }

  const handleLogoClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      if (isExiting) return

      setIsExiting(true)
      exitWebView()

      setTimeout(() => {
        setIsExiting(false)
      }, 500)
    },
    [exitWebView, isExiting]
  )

  const totalItems = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + (item.quantity ?? 0), 0)
  )

  const goToCheckoutPage = () => {
    router.push(`/check`)
  }

  return (
    <div className="flex items-center bg-myBlue px-4 md:px-6 lg:px-12 py-3 md:py-4 lg:py-5 border-b w-full relative shadow-md">
      {/* Logo and Back Button - Left Section */}
      <div className="relative mr-3 h-10 w-10 lg:h-12 lg:w-12 flex items-center flex-shrink-0">
        <button
          onClick={handleBack}
          className={cn(
            "absolute inset-0 flex items-center justify-center rounded p-1 active:scale-95 active:bg-white/10 transition-all duration-300",
            showBackArrow
              ? "opacity-100 translate-x-0 pointer-events-auto"
              : "opacity-0 -translate-x-2 pointer-events-none"
          )}
          aria-label="Go back"
        >
          <Image
            src="/images/icons/basil_arrow-up-solid.png"
            alt="Back"
            width={24}
            height={24}
          />
        </button>

        <LocalizedClientLink
          href="/"
          onClick={handleLogoClick}
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-300",
            isHomePage
              ? "opacity-100 translate-x-0 pointer-events-auto"
              : "opacity-0 translate-x-2 pointer-events-none"
          )}
          aria-label="WeeTok home"
        >
          <Image
            src="/images/icons/weetok-logo.png"
            alt="WeeTok"
            width={40}
            height={40}
            className="object-contain lg:w-12 lg:h-12"
            priority
          />
        </LocalizedClientLink>
      </div>

      {/* Center Navigation - Desktop Only */}
      <div className="flex items-center flex-1 ml-4 lg:ml-8">
        {showSearchbar && !showBackArrow && (
          <div className="hidden lg:block">
            <ul className="flex space-x-1 xl:space-x-2">
              <LocalizedClientLink
                key="home"
                href="/"
                className={cn(
                  "px-3 py-2 text-sm font-medium capitalize transition-colors rounded-md",
                  pathname === "/np"
                    ? "text-white bg-white/10"
                    : "text-gray-100 hover:text-white hover:bg-white/5"
                )}
              >
                Home
              </LocalizedClientLink>
              <LocalizedClientLink
                key="products"
                href="/products"
                className={cn(
                  "px-3 py-2 text-sm font-medium capitalize transition-colors rounded-md text-gray-100 hover:text-white hover:bg-white/5"
                )}
              >
                Products
              </LocalizedClientLink>

              {hierarchicalCategories.slice(0, 6).map((category) => {
                const categoryHref = `/categories/${category?.handle}`

                return (
                  <LocalizedClientLink
                    key={category.handle}
                    href={categoryHref}
                    className={cn(
                      "px-3 py-2 text-sm font-medium capitalize transition-colors rounded-md",
                      pathname === `/np${categoryHref}`
                        ? "text-white bg-white/10"
                        : "text-gray-100 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {category?.name}
                  </LocalizedClientLink>
                )
              })}
            </ul>
          </div>
        )}

      </div>

      {/* Center Page Labels */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex text-white font-semibold text-lg">
        {showCheckoutLabel && <span>Checkout</span>}
        {showPaymentMethodLabel && <span>Select Payment Method</span>}
        {showCardLabel && <span>Debit/Credit Card</span>}
        {showImePayNowLabel && <span>Khalti by IME</span>}
        {showImePayWalletLink && <span>IME Pay - Wallet Link</span>}
        {showSelectShippingAddressLabel && <span>Select Shipping Address</span>}
        {showPickupAddressLabel && <span>Pick up from</span>}
        {showFAQLabel && <span>WeeTok Marketplace FAQ</span>}
        {showTrackOrderLabel && <span>Track Order</span>}
        {showReturnsLabel && <span>Return Policies</span>}
        {showDeliveryLabel && <span>Delivery Info</span>}
        {showPaymentLabel && <span>Payment Info</span>}
        {showAboutUsLabel && <span>About WeeTok Marketplace</span>}
        {showBlogLabel && <span>WeeTok Blog</span>}
        {showPrivacyPolicyLabel && <span>Privacy Policy</span>}
        {showTermsAndConditionsLabel && <span>WeeTok Marketplace T&C</span>}
      </div>

      {/* Right Section - Search and Menu */}
      <div className="ml-auto flex items-center gap-3 lg:gap-4">
        {showSearchbar && (
          <div className="hidden md:block">
            <NavbarSearch />
          </div>
        )}
        <div className="md:hidden">
          <MobileNavbar hierarchicalCategories={hierarchicalCategories} />
        </div>
      </div>
    </div>
  )
}

// const CartButton = ({
//   totalItems,
//   goToCheckoutPage,
// }: {
//   totalItems: number
//   goToCheckoutPage: () => void
// }) => {
//   const { goCheck } = useFlutterBridge()
//   return (
//     <button
//       className="ml-5 mt-1 relative"
//       // onClick={goToCheckoutPage}
//       onClick={(e) => {
//         e.preventDefault()
//         if (isFlutterWebView()) {
//           goCheck()
//         } else {
//           goToCheckoutPage()
//         }
//       }}
//     >
//       <CartIcon size={24} color="white" />
//       {totalItems > 0 && (
//         <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
//           {totalItems}
//         </span>
//       )}
//     </button>
//   )
// }
