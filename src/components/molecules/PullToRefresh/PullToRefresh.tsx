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
  threshold = 60, 
  disabled = false,
}: PullToRefreshProps) {
  const router = useRouter()
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isPulling, setIsPulling] = useState(false)
  const startY = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const fetchCart = useCartStore((state) => state.fetchCart)
  const forceRefresh = useInventoryStore((state) => state.forceRefresh)

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
      }, 500)
    }
  }

  useEffect(() => {
    if (disabled) return

    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY
        setIsPulling(true)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling || window.scrollY > 0) return

      const currentY = e.touches[0].clientY
      const distance = currentY - startY.current

      if (distance > 0) {
       
        const resistance = 0.5
        const elasticDistance = distance * resistance
        setPullDistance(Math.min(elasticDistance, threshold * 1.2))
      }
    }

    const handleTouchEnd = () => {
      if (pullDistance >= threshold && !isRefreshing) {
        handleRefresh()
      } else {
        setPullDistance(0)
      }
      setIsPulling(false)
    }

    container.addEventListener("touchstart", handleTouchStart, { passive: true })
    container.addEventListener("touchmove", handleTouchMove, { passive: true })
    container.addEventListener("touchend", handleTouchEnd)

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isPulling, pullDistance, threshold, isRefreshing, disabled])

  const progress = Math.min((pullDistance / threshold) * 100, 100)
  const shouldTrigger = pullDistance >= threshold

  
  const contentStyle = {
    marginTop: isRefreshing ? threshold : pullDistance,
    transition: isRefreshing || pullDistance === 0 ? 'margin-top 0.2s' : 'none',
  }

  return (
    <div ref={containerRef} className="relative">
     
      <div
        className="fixed left-0 right-0 flex items-center justify-center transition-all duration-200 z-40 pointer-events-none"
        style={{
          top: '90px', 
          opacity: pullDistance > 0 ? 1 : 0,
        }}
      >
        <div className="relative w-12 h-12 flex items-center justify-center">
        
          <div className="w-9 h-9 rounded-full overflow-hidden bg-white shadow-lg">
            <Image
              src="/AppIconW.PNG"
              alt="App Icon"
              width={36}
              height={36}
              className="object-cover"
            />
          </div>
          
          <svg
            className="absolute inset-0 w-12 h-12 -rotate-90"
            viewBox="0 0 48 48"
          >
            <circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="2"
            />
            
            <circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="#3949AB"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 22}`}
              strokeDashoffset={
                isRefreshing 
                  ? `${2 * Math.PI * 22 * 0.75}` 
                  : `${2 * Math.PI * 22 * (1 - progress / 100)}` 
              }
              className={`transition-all duration-200 ${
                isRefreshing ? "animate-spin origin-center" : ""
              }`}
              style={{
                transformOrigin: "center",
                animationDuration: isRefreshing ? "0.8s" : undefined,
              }}
            />
          </svg>
        </div>
      </div>

      <div style={contentStyle}>
        {children}
      </div>
    </div>
  )
}
