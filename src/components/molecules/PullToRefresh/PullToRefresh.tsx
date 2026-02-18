"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useCartStore } from "@/store/useCartStore"
import { useInventoryStore } from "@/store/useInventoryStore"
import Image from "next/image"

interface PullToRefreshProps {
  children: React.ReactNode
  onRefresh?: () => Promise<void>
  threshold?: number
  disabled?: boolean
}

export function PullToRefresh({
  children,
  onRefresh,
  threshold = 80,
  disabled = false,
}: PullToRefreshProps) {
  const router = useRouter()
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  
  const startY = useRef(0)
  const isPulling = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const fetchCart = useCartStore((state) => state.fetchCart)
  const forceRefresh = useInventoryStore((state) => state.forceRefresh)

  const circumference = 2 * Math.PI * 18;

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      if (onRefresh) {
        await onRefresh()
      } else {
        await Promise.all([
          router.refresh(),        
          fetchCart(),             
          Promise.resolve(forceRefresh()),
        ])
      }
    } finally {

      setTimeout(() => {
        setIsRefreshing(false)
        setPullDistance(0)
      }, 600)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY
      setScrollY(currentScroll)

      if (currentScroll > 0 && isRefreshing) {
        setPullDistance(0)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    
    if (disabled) return
    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY
        isPulling.current = true
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling.current) return
      const currentY = e.touches[0].clientY
      const rawDistance = currentY - startY.current

      if (rawDistance > 0 && window.scrollY === 0) {
        if (e.cancelable) e.preventDefault()
        const dampedDistance = Math.pow(rawDistance, 0.75)
        setPullDistance(Math.min(dampedDistance, threshold * 1.8))
      } else {
        isPulling.current = false
      }
    }

    const handleTouchEnd = () => {
      if (!isPulling.current) return
      if (pullDistance >= threshold && !isRefreshing) {
        handleRefresh()
      } else {
        setPullDistance(0)
      }
      isPulling.current = false
    }

    container.addEventListener("touchstart", handleTouchStart, { passive: true })
    container.addEventListener("touchmove", handleTouchMove, { passive: false })
    container.addEventListener("touchend", handleTouchEnd)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [pullDistance, threshold, isRefreshing, disabled])

  const progress = Math.min((pullDistance / threshold) * 100, 100)
  const shouldTrigger = pullDistance >= threshold
  
  const showIndicator = (pullDistance > 5 || isRefreshing) && scrollY <= 5

  const strokeOffset = isRefreshing 
    ? circumference * 0.75 
    : circumference * (1 - progress / 100);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full"
      style={{ overscrollBehaviorY: 'contain' }} 
    >
     
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center pointer-events-none z-50"
        style={{
          height: `${threshold}px`,
          opacity: showIndicator ? 1 : 0,
          transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
          transform: `translateY(${scrollY > 0 ? -20 : 0}px)`
        }}
      >
        <div 
          className="relative w-11 h-11 flex items-center justify-center bg-white rounded-full shadow-lg border border-gray-100 transition-transform"
          style={{
            transform: isRefreshing 
              ? 'scale(1)' 
              : `scale(${shouldTrigger ? 1.15 : Math.min(progress/100, 1)})`
          }}
        >
          <div className="relative w-7 h-7 rounded-full overflow-hidden z-10 bg-white">
            <Image
              src="/AppIconW.png"
              alt="Weetok"
              fill
              className="object-cover"
            />
          </div>
          
          <svg
            className={`absolute inset-0 w-11 h-11 -rotate-90 ${isRefreshing ? "animate-native-spin" : ""}`}
            viewBox="0 0 40 40"
          >
            <circle cx="20" cy="20" r="18" fill="none" stroke="#F3F4F6" strokeWidth="2.5" />
            <circle
              cx="20"
              cy="20"
              r="18"
              fill="none"
              stroke={shouldTrigger || isRefreshing ? "#3949AB" : "#9CA3AF"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              style={{
                transition: isRefreshing ? 'none' : 'stroke-dashoffset 0.1s linear, stroke 0.2s'
              }}
            />
          </svg>
        </div>
      </div>

      <div
        className="transition-transform"
        style={{
          transform: `translate3d(0, ${scrollY > 0 ? 0 : (isRefreshing ? threshold : pullDistance)}px, 0)`,
          transitionDuration: (isPulling.current || scrollY > 0) ? '0ms' : '400ms',
          transitionTimingFunction: 'cubic-bezier(0.33, 1, 0.68, 1)',
          willChange: 'transform'
        }}
      >
        {children}
      </div>

      <style jsx global>{`
        @keyframes native-spin {
          from { transform: rotate(-90deg); }
          to { transform: rotate(270deg); }
        }
        .animate-native-spin {
          animation: native-spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  )
}