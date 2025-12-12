"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { CAROUSEL_AUTO_SLIDE_INTERVAL } from "@/lib/constants"

interface BannerItem {
  image: string
  link: string
}

interface CarouselBannerProps {
  bannerCarousel?: BannerItem[]
}

export default function CarouselBanner({ bannerCarousel = [] }: CarouselBannerProps) {
  const [current, setCurrent] = useState(0)

  const slideInterval = useRef<NodeJS.Timeout | null>(null)

  const stopAutoSlide = useCallback(() => {
    if (slideInterval.current) clearTimeout(slideInterval.current)
  }, [])

  const nextSlide = useCallback(() => {
    if (bannerCarousel.length === 0) return
    setCurrent((prev) => (prev + 1) % bannerCarousel.length)
  }, [bannerCarousel.length])

  const prevSlide = useCallback(() => {
    if (bannerCarousel.length === 0) return
    setCurrent((prev) => (prev === 0 ? bannerCarousel.length - 1 : prev - 1))
  }, [bannerCarousel.length])

  const startAutoSlide = useCallback(() => {
    stopAutoSlide()
    slideInterval.current = setTimeout(() => {
      nextSlide()
    }, CAROUSEL_AUTO_SLIDE_INTERVAL)
  }, [nextSlide, stopAutoSlide])

  useEffect(() => {
    startAutoSlide()
    return () => stopAutoSlide()
  }, [current, startAutoSlide, stopAutoSlide])

  const startX = useRef(0)
  const endX = useRef(0)
  const isDragging = useRef(false)
  const minDistance = 40

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }

  const onTouchMove = (e: React.TouchEvent) => {
    endX.current = e.touches[0].clientX
  }

  const onTouchEnd = () => {
    handleSwipe()
  }

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    startX.current = e.clientX
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    endX.current = e.clientX
  }

  const onMouseUp = () => {
    if (!isDragging.current) return
    isDragging.current = false
    handleSwipe()
  }

  const handleSwipe = () => {
    const distance = startX.current - endX.current

    if (Math.abs(distance) >= minDistance) {
      if (distance > 0) nextSlide()
      else prevSlide()
    }
  }

  return (
    <div className="w-full flex flex-col items-center select-none">
      {bannerCarousel.length > 0 && (
        <>
          <div
            className="
          relative 
          w-full 
          h-52 sm:h-64 
          rounded-2xl 
          bg-gray-100 
          overflow-hidden
          shadow-[0_8px_20px_rgba(0,0,0,0.15)]
        "
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            <Link href={bannerCarousel[current]?.link || "#"}>
              <Image
                src={bannerCarousel[current]?.image || "/images/not-available/not-available.png"}
                alt="banner"
                fill
                className="object-cover"
              />
            </Link>
          </div>

          {/* dots */}
          <div className="flex gap-2 mt-3">
            {bannerCarousel.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-3 w-3 rounded-full transition-all ${current === index ? "bg-blue-600 w-5" : "bg-gray-300"
                  }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
