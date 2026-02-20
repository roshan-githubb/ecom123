"use client"

import { useEffect, useRef, useState } from 'react'

interface UseSwipeToExitOptions {
  onExit: () => void
  onBack?: () => void
  threshold?: number
  enabled?: boolean
  isHomePage?: boolean
}

export const useSwipeToExit = ({
  onExit,
  onBack,
  threshold = 100,
  enabled = true,
  isHomePage = false,
}: UseSwipeToExitOptions) => {
  const [swipeProgress, setSwipeProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const startX = useRef(0)
  const startY = useRef(0)
  const currentX = useRef(0)
  const isSwipingRef = useRef(false)
  const hasTriggeredAction = useRef(false)

  useEffect(() => {
    if (!enabled) return

    const handleTouchStart = (e: TouchEvent) => {
      // Only trigger if touch starts from the left edge (within 80px, matching iOS Safari)
      if (e.touches[0].clientX > 80) return

      startX.current = e.touches[0].clientX
      startY.current = e.touches[0].clientY
      isSwipingRef.current = false
      hasTriggeredAction.current = false
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (startX.current === 0) return

      currentX.current = e.touches[0].clientX
      const deltaX = currentX.current - startX.current
      const deltaY = Math.abs(e.touches[0].clientY - startY.current)

      // Only consider horizontal swipes (deltaX > deltaY)
      if (deltaX > 10 && deltaX > deltaY) {
        isSwipingRef.current = true
        
        // Prevent default scrolling when swiping
        e.preventDefault()

        // Calculate progress (0 to 1)
        const progress = Math.min(deltaX / threshold, 1)
        setSwipeProgress(progress)
      }
    }

    const handleTouchEnd = () => {
      if (!isSwipingRef.current) {
        startX.current = 0
        startY.current = 0
        setSwipeProgress(0)
        return
      }

      const deltaX = currentX.current - startX.current

      // If swipe exceeds threshold, trigger action
      if (deltaX >= threshold && !hasTriggeredAction.current) {
        hasTriggeredAction.current = true
        setIsAnimating(true)
        
        // Animate to full width (100%)
        setSwipeProgress(1)
        
        // Wait for animation to complete before triggering navigation
        setTimeout(() => {
          if (isHomePage) {
            onExit()
          } else if (onBack) {
            onBack()
          }
          // Reset state after navigation is triggered
          setTimeout(() => {
            setIsAnimating(false)
            setSwipeProgress(0)
          }, 50)
        }, 300) // Match the CSS transition duration
      } else {
        // Animate back to 0 if threshold not met
        setIsAnimating(true)
        setSwipeProgress(0)
        setTimeout(() => {
          setIsAnimating(false)
        }, 300)
      }

      // Reset
      startX.current = 0
      startY.current = 0
      currentX.current = 0
      isSwipingRef.current = false
    }

    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [enabled, threshold, onExit, onBack, isHomePage])

  return { swipeProgress, isAnimating }
}
