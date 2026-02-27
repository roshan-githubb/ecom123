"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface PageTransitionWrapperProps {
  children: ReactNode
  swipeProgress: number
  isAnimating: boolean
  isHomePage: boolean
}

export const PageTransitionWrapper = ({ 
  children, 
  swipeProgress, 
  isAnimating,
  isHomePage 
}: PageTransitionWrapperProps) => {
  // Don't apply slide animation on homepage
  if (isHomePage) {
    return <>{children}</>
  }

  // When swiping, use inline transform instead of framer motion animation
  const isSwiping = swipeProgress > 0
  const translateX = swipeProgress * 100 // Convert to percentage

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'white',
        position: 'relative',
        transform: isSwiping 
          ? `translateX(${translateX}%)` 
          : undefined,
        transition: isAnimating && isSwiping ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        willChange: isSwiping ? 'transform' : 'auto',
        boxShadow: swipeProgress > 0 
          ? `-10px 0 30px rgba(0, 0, 0, ${0.3 * swipeProgress})` 
          : 'none',
      }}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{
          type: 'tween',
          ease: [0.4, 0, 0.2, 1],
          duration: 0.3
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
