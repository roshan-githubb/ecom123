import { useEffect } from 'react'

export function useBodyScrollLock(isLocked: boolean = true) {
  useEffect(() => {
    if (!isLocked) return

    const scrollY = window.scrollY
    const scrollX = window.scrollX
    
    const originalBodyStyle = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    }
    
    // Use overflow hidden instead of position fixed to preserve navbar
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'relative'
    
    // For iOS Safari, also prevent bounce scrolling
    document.documentElement.style.overflow = 'hidden'
    
    return () => {
      document.body.style.position = originalBodyStyle.position
      document.body.style.top = originalBodyStyle.top
      document.body.style.left = originalBodyStyle.left
      document.body.style.width = originalBodyStyle.width
      document.body.style.overflow = originalBodyStyle.overflow
      
      // Restore document overflow
      document.documentElement.style.overflow = ''
      
      // Restore scroll position (should be maintained with overflow approach)
      window.scrollTo(scrollX, scrollY)
    }
  }, [isLocked])
}

export function useBodyScrollLockClass(isLocked: boolean = true) {
  useEffect(() => {
    if (!isLocked) return

    const scrollY = window.scrollY
    const scrollX = window.scrollX
    
    document.body.classList.add('scroll-locked')
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = `-${scrollX}px`
    
    return () => {
      document.body.classList.remove('scroll-locked')
      document.body.style.top = ''
      document.body.style.left = ''
      
      // Restore scroll position
      window.scrollTo(scrollX, scrollY)
    }
  }, [isLocked])
}
/**
 * Alt
ernative implementation using position fixed (may hide navbar)
 * Only use this if the overflow approach doesn't work on all devices
 */
export function useBodyScrollLockFixed(isLocked: boolean = true) {
  useEffect(() => {
    if (!isLocked) return

    const scrollY = window.scrollY
    const scrollX = window.scrollX
    
    const originalBodyStyle = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    }
    
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = `-${scrollX}px`
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.body.style.position = originalBodyStyle.position
      document.body.style.top = originalBodyStyle.top
      document.body.style.left = originalBodyStyle.left
      document.body.style.width = originalBodyStyle.width
      document.body.style.overflow = originalBodyStyle.overflow
      
      // Restore scroll position
      window.scrollTo(scrollX, scrollY)
    }
  }, [isLocked])
}