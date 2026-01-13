"use client"

import { useMemo, useState, useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useCartStore } from "@/store/useCartStore"
import { convertToLocale } from "@/lib/helpers/money"
import Image from "next/image"
import StickyCartBarSkeleton from "../StickyCartBarSkeleton/StickyCartBarSkeleton"
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock"

const shouldHideStickyBar = (pathname: string) => {
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "")
  console.log("pathname, pathnamewithoutlocale, includes? ", pathWithoutLocale, pathname,  ["/cart", "/check", "/checkout", "/payment", "/order"].includes(
    pathWithoutLocale
  ))
  return ["/cart", "/check", "/checkout", "/payment", "/order"].includes(
    pathWithoutLocale
  )
}

interface StickyCartBarProps {
  className?: string
}

export default function StickyCartBar({ className }: StickyCartBarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const [isNavigating, setIsNavigating] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartY = useRef(0)
  const expandedPanelRef = useRef<HTMLDivElement>(null)

  const items = useCartStore((s) => s.items)
  const increase = useCartStore((s) => s.increase)
  const decrease = useCartStore((s) => s.decrease)
  const totalPayable = useCartStore((s) => s.totalPayable)
  const currency = useCartStore((s) => s.currency)

  const isLoading = items === undefined;

const itemCount = useMemo(() => {
  if (!items) return 0
  return items.reduce((sum, i) => sum + (i.quantity || 0), 0)
}, [items])

  const isVisible = useMemo(() => {
    if (itemCount === 0) return false
    if (shouldHideStickyBar(pathname)) return false
    return true
  }, [itemCount, pathname])

  useBodyScrollLock(isExpanded && isVisible)

  const smallStack = itemCount < 5
  const backGap = smallStack
    ? "-translate-x-[6px] -translate-y-[6px]"
    : "-translate-x-1 -translate-y-1"
  const midGap = smallStack
    ? "-translate-x-[3px] -translate-y-[3px]"
    : "-translate-x-0.5 -translate-y-0.5"

  useEffect(() => setIsNavigating(false), [pathname])

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true)
      setIsAnimatingOut(false)
    } else if (shouldRender) {
      setIsAnimatingOut(true)
      const t = setTimeout(() => {
        setShouldRender(false)
        setIsAnimatingOut(false)
      }, 220)
      return () => clearTimeout(t)
    }
  }, [isVisible, shouldRender])

  const handleCheckoutClick = () => {
    try {
      setIsNavigating(true)
      const localeMatch = pathname.match(/^\/([^\/]+)/)
      const locale = localeMatch ? localeMatch[1] : "en"
      router.push(`/${locale}/check`)
    } catch (error) {
      console.error("Navigation to cart failed:", error)
      setIsNavigating(false)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isExpanded) return
    dragStartY.current = e.touches[0].clientY
    setIsDragging(true)
    setDragY(0)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !isExpanded) return
    
    const currentY = e.touches[0].clientY
    const deltaY = currentY - dragStartY.current
    
    if (deltaY > 0) {
      setDragY(deltaY)
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging || !isExpanded) return
    
    setIsDragging(false)
    
    if (dragY > 100) {
      setIsExpanded(false)
    }
    
    setDragY(0)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isExpanded) return
    dragStartY.current = e.clientY
    setIsDragging(true)
    setDragY(0)
  }

  useEffect(() => {
    const handleMouseMoveWrapper = (e: MouseEvent) => {
      if (!isDragging || !isExpanded) return
      
      const deltaY = e.clientY - dragStartY.current
      
      if (deltaY > 0) {
        setDragY(deltaY)
      }
    }

    const handleMouseUpWrapper = () => {
      if (!isDragging || !isExpanded) return
      
      setIsDragging(false)
      
      if (dragY > 100) {
        setIsExpanded(false)
      }
      
      setDragY(0)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMoveWrapper)
      document.addEventListener('mouseup', handleMouseUpWrapper)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMoveWrapper)
        document.removeEventListener('mouseup', handleMouseUpWrapper)
      }
    }
  }, [isDragging, isExpanded, dragY])

  const firstItemImage = items[0]?.image || "/product-placeholder.png"
  const totalSavings = 3266

  if (isLoading) {
    return <StickyCartBarSkeleton />;
  }

  return (
    <>
      {shouldRender && (
        <>
      {isExpanded && (
        <div
          className="fixed inset-0 z-40 bg-black/55 transition-opacity duration-300"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <div
        ref={expandedPanelRef}
        className={`fixed left-0 right-0 bottom-[70px] z-50 pointer-events-auto transition-transform duration-300 ${isExpanded ? "translate-y-0" : "translate-y-[calc(100%+88px)]"
          }`}
        style={{
          transform: `translateY(${isExpanded ? dragY : 'calc(100% + 88px)'})`,
          transition: isDragging ? 'none' : 'transform 300ms ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        <div className="w-full bg-[#F4F6FB] rounded-t-[24px] shadow-[0_-20px_40px_rgba(6,23,60,0.12)] pb-6 relative overflow-hidden">
          {/* Drag handle indicator */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-gray-300 rounded-full cursor-grab active:cursor-grabbing" />
          </div>
          
          <div className="flex items-center justify-between px-5 pt-3 pb-4">
            <h3 className="text-[18px] font-semibold text-black">
              Review Items
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-sm"
            >
              ✕
            </button>
          </div>

          <div className="mx-4 bg-white rounded-[20px] py-5 px-3 shadow-sm">
            <div className="flex items-start justify-between pb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Delivery in</p>
                <p className="text-base font-semibold text-black leading-none">
                  2 days
                </p>
              </div>
              <p className="text-sm text-gray-500">{itemCount} items</p>
            </div>

            <div className="pb-4">
              <div className="border-t-[1.5px] border-dotted border-gray-400 w-full" />
            </div>

            <div className="space-y-5 overflow-y-auto max-h-[40vh]">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative w-[52px] h-[52px] rounded-lg overflow-hidden bg-white border border-gray-100">
                      <Image
                        src={item.image || "/product-placeholder.png"}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
        <button 
        onClick={() => {
          router.push(`/products/${item.productId}`);
          setIsExpanded(false)}}
        >
                      <h4 className="text-[13px] font-medium line-clamp-1 leading-tight mb-0.5">
                        {item.title}
                      </h4>
                      </button>
                      <p className="text-xs text-gray-500">
                        {item.quantity} {item.quantity === 1 ? "Item" : "Items"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center rounded-[0.5rem] border h-[2.25rem]"
                      style={{
                        background: "linear-gradient(to bottom, white 66%, #DCEEFB 100%)",
                        borderColor: "#8e88f5ff",
                      }}
                    >
                      <button
                        onClick={() => decrease(item.id, item.quantity)}
                        className="w-8 h-full flex items-center justify-center text-lg text-[#4F46E5] font-semibold"
                      >
                        −
                      </button>

                      <span className="text-[0.875rem] font-semibold text-[#4F46E5] min-w-[1.25rem] text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increase(item.id, item.quantity)}
                        className="w-8 h-full flex items-center justify-center text-lg text-[#4F46E5] font-semibold"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right min-w-[60px]">
                      <p className="text-[14px] font-semibold">
                        {convertToLocale({
                          amount: item.price * item.quantity,
                          currency_code: currency || "NPR",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-8px_24px_rgba(6,23,60,0.06)] transition-transform duration-300 pb-safe ${isAnimatingOut ? "translate-y-full ease-in" : "translate-y-0 ease-out"
          } ${className || ""}`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-3"
          >
            <div className="flex items-center gap-3 p-1 pr-3 bg-white">
              <div className="relative w-10 h-10 flex-shrink-0">
                {itemCount > 2 && (
                  <div
                    className={`absolute top-0 left-0 w-full h-full bg-white rounded-lg border border-gray-300 shadow-sm z-0 ${backGap}`}
                  ></div>
                )}

                {itemCount > 1 && (
                  <div
                    className={`absolute top-0 left-0 w-full h-full bg-white rounded-lg border border-gray-300 shadow-sm z-10 ${midGap}`}
                  ></div>
                )}

                <div className="absolute top-0 left-0 w-full h-full rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm z-20">
                  <Image
                    src={firstItemImage}
                    alt="Cart item"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col items-start pl-1">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-gray-900">
                    {itemCount} Items
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className={`w-3.5 h-3.5 text-myBlue ${isExpanded ? "" : "rotate-180"
                      }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </div>
                <span className="text-xs text-gray-500 font-semibold">
                  Add more to save more
                </span>

              </div>
            </div>
          </button>

          <button
            onClick={handleCheckoutClick}
            disabled={isNavigating}
            className="bg-myBlue text-white px-4 py-3 rounded-xl font-normal text-sm"
          >
            View Cart
          </button>
        </div>
      </div>
        </>
      )}
      
      {isLoading && <StickyCartBarSkeleton />}
    </>
  )
}
