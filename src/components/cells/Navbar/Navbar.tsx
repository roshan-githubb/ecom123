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
  categories,
  parentCategories,
}: {
  categories: HttpTypes.StoreProductCategory[]
  parentCategories: HttpTypes.StoreProductCategory[]
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
    <div className="flex items-center bg-myBlue px-4 md:px-12 py-4 border-b w-full relative">
      <div className="relative mr-3 h-10 w-10 flex items-center">
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
            className="object-contain"
            priority
          />
        </LocalizedClientLink>
      </div>

      <div className="mr-2 lg:mr-0"></div>

      <div className="flex items-center w-full">
        {showSearchbar && !showBackArrow && (
          <div className="hidden lg:flex mt-2">
            <ul className="flex space-x-6">
              <LocalizedClientLink
                key="home"
                href="/"
                className={cn(
                  "label-md min-w-[24px] capitalize",
                  pathname === "/np"
                    ? "text-white font-semibold"
                    : "text-gray-300 hover:text-gray-300"
                )}
              >
                Home
              </LocalizedClientLink>
              <LocalizedClientLink
                key="products"
                href="/products"
                className={cn(
                  "label-md min-w-[24px] capitalize text-gray-300 hover:text-gray-300"
                )}
              >
                Products
              </LocalizedClientLink>

              {categories.slice(0,8).map((category) => {
                const categoryHref = `/categories/${category?.handle}`

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
        )}

        <>
          <div className="mt-2 flex  justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
            {showCheckoutLabel && (
              <span className="text-base min-w-[240px] font-poppins font-semibold text-white">
                Checkout
              </span>
            )}
          </div>

          <div className="mt-2 mt- flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
            {showPaymentMethodLabel && (
              <span className=" min-w-[240px] text-base font-poppins font-semibold text-white">
                Select Payment Method
              </span>
            )}
          </div>

          <div className="mt-2 mt- flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
            {showCardLabel && (
              <span className=" min-w-[240px] text-base font-poppins font-semibold text-white">
                Debit/Credit Card
              </span>
            )}
          </div>

          <div className="mt-2 mt- flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
            {showImePayNowLabel && (
              <span className=" min-w-[240px] text-base font-poppins font-semibold text-white">
                Khalti by IME
              </span>
            )}
          </div>

          <div className="mt-2 mt- flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
            {showImePayWalletLink && (
              <span className=" min-w-[240px] text-base font-poppins font-semibold text-white">
                IME Pay - Wallet Link
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-1  justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
            {showSelectShippingAddressLabel && (
              <span className=" min-w-[240px] flex-1 text-base font-poppins font-semibold text-white">
                Select Shipping Address
              </span>
            )}
          </div>

          <div className="mt-2 mt- flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
            {showPickupAddressLabel && (
              <span className=" min-w-[240px] text-base font-poppins font-semibold text-white">
                Pick up from
              </span>
            )}
          </div>

          <div className="mt-2 mt- flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
            {showFAQLabel && (
              <span className=" min-w-[240px] text-base font-poppins font-semibold text-white">
                WeeTok Marketplace FAQ
              </span>
            )}
          </div>

          <div className="mt-2 mt- flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
            {showTrackOrderLabel && (
              <span className=" min-w-[240px] text-base font-poppins font-semibold text-white">
                Track Order
              </span>
            )}
          </div>

          <div className="mt-2 mt- flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
            {showReturnsLabel && (
              <span className=" min-w-[240px] text-base font-poppins font-semibold text-white">
                Return Policies
              </span>
            )}
          </div>

          <div className="mt-2 mt- flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
            {showDeliveryLabel && (
              <span className=" min-w-[240px] text-base font-poppins font-semibold text-white">
                Delivery Info
              </span>
            )}
          </div>

          <div className="mt-2 mt- flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
            {showPaymentLabel && (
              <span className=" min-w-[240px] text-base font-poppins font-semibold text-white">
                Payment Info
              </span>
            )}
          </div>

          <div className="mt-2 mt- flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
            {showAboutUsLabel && (
              <span className=" min-w-[240px] text-base font-poppins font-semibold text-white">
                About WeeTok Marketplace
              </span>
            )}
          </div>
          <div className="mt-2 mt- flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
            {showBlogLabel && (
              <span className=" min-w-[240px] text-base font-poppins font-semibold text-white">
                WeeTok Blog
              </span>
            )}
          </div>
          <div className="mt-2 mt- flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
            {showPrivacyPolicyLabel && (
              <span className=" min-w-[240px] text-base font-poppins font-semibold text-white">
                Privacy Policy
              </span>
            )}
          </div>
          <div className="mt-2 mt- flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
            {showTermsAndConditionsLabel && (
              <span className=" min-w-[240px] text-base font-poppins font-semibold text-white">
                WeeTok Marketplace T&C
              </span>
            )}
          </div>
        </>
        {/* Right: search + menu */}
        <div className="flex w-full justify-end lg:ml-auto items-center space-x-2">
          {showSearchbar && <NavbarSearch />}

          <div className="ml-auto">
            <MobileNavbar
              parentCategories={parentCategories}
              childrenCategories={categories?.slice(0, 7)}
            />
          </div>

          {/* <CartButton totalItems={totalItems} goToCheckoutPage={goToCheckoutPage} /> */}
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
