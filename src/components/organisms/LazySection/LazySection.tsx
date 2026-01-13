'use client'

import { useState, useEffect, useRef } from 'react'

interface LazySectionProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  rootMargin?: string
  threshold?: number
}

export const LazySection: React.FC<LazySectionProps> = ({
  children,
  fallback = <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />,
  rootMargin = '100px',
  threshold = 0.1
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [rootMargin, threshold])

  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  )
}