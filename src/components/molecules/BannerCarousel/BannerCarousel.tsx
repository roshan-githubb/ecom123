  "use client"

  import { useState, useRef, useEffect, useCallback } from "react"
  import Image from "next/image"
  import Link from "next/link"
  import { CAROUSEL_AUTO_SLIDE_INTERVAL } from "@/lib/constants"
  import { trackBannerEvent } from "@/lib/track-banner-event"

  interface BannerItem {
    id: string
    image: string
    mobileImage?: string
    link: string
  }

  interface CarouselBannerProps {
    bannerCarousel?: BannerItem[]
  }

  export default function CarouselBanner({ bannerCarousel = [] }: CarouselBannerProps) {
    const [current, setCurrent] = useState(0)
    const [isMobile, setIsMobile] = useState(false)
    const [sessionId] = useState(() => `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
    const trackedImpressions = useRef<Set<string>>(new Set())

    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768)
      }
      checkMobile()
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const getBrowserInfo = useCallback(() => {
      const ua = navigator.userAgent
      let browser = "Unknown"
      let os = "Unknown"

      if (ua.includes("Chrome")) browser = "Chrome"
      else if (ua.includes("Firefox")) browser = "Firefox"
      else if (ua.includes("Safari")) browser = "Safari"
      else if (ua.includes("Edge")) browser = "Edge"
      else if (ua.includes("Opera")) browser = "Opera"

      if (ua.includes("Windows")) os = "Windows"
      else if (ua.includes("Mac")) os = "macOS"
      else if (ua.includes("Linux")) os = "Linux"
      else if (ua.includes("Android")) os = "Android"
      else if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) os = "iOS"

      return { browser, os }
    }, [])

    const trackImpression = useCallback(async (bannerId: string) => {
      if (trackedImpressions.current.has(bannerId)) return
      
      trackedImpressions.current.add(bannerId)
      
      const deviceType = isMobile ? "mobile" : "desktop"
      const userAgent = navigator.userAgent
      const { browser, os } = getBrowserInfo()
      
      await trackBannerEvent(bannerId, {
        event_type: "impression",
        session_id: sessionId,
        page_url: window.location.href,
        page_type: "home",
        user_agent: userAgent,
        referrer: document.referrer || undefined,
        device_type: deviceType,
        browser,
        os,
      })
    }, [sessionId, isMobile, getBrowserInfo])

    const trackClick = useCallback(async (bannerId: string) => {
      const deviceType = isMobile ? "mobile" : "desktop"
      const userAgent = navigator.userAgent
      const { browser, os } = getBrowserInfo()
      
      await trackBannerEvent(bannerId, {
        event_type: "click",
        session_id: sessionId,
        page_url: window.location.href,
        page_type: "home",
        user_agent: userAgent,
        referrer: document.referrer || undefined,
        device_type: deviceType,
        browser,
        os,
      })
    }, [sessionId, isMobile, getBrowserInfo])

    useEffect(() => {
      if (bannerCarousel[current]?.id) {
        trackImpression(bannerCarousel[current].id)
      }
    }, [current, bannerCarousel, trackImpression])

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
              <Link 
                href={bannerCarousel[current]?.link || "#"}
                onClick={() => {
                  if (bannerCarousel[current]?.id) {
                    trackClick(bannerCarousel[current].id)
                  }
                }}
              >
                <Image
                  src={
                    (isMobile && bannerCarousel[current]?.mobileImage) 
                      ? bannerCarousel[current].mobileImage 
                      : bannerCarousel[current]?.image || "/images/not-available/not-available.png"
                  }
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
