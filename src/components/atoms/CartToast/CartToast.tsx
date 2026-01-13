'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
// Using inline SVG icons instead of Heroicons

interface CartToastProps {
  message: string
  isVisible: boolean
  duration?: number
  onDismiss: () => void
  variant?: 'success' | 'error'
}

export const CartToast = ({ 
  message, 
  isVisible, 
  duration = 3000, 
  onDismiss,
  variant = 'success'
}: CartToastProps) => {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (!isVisible) {
      setProgress(100)
      return
    }

    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, duration - elapsed)
      const progressPercent = (remaining / duration) * 100
      
      setProgress(progressPercent)
      
      if (remaining <= 0) {
        clearInterval(interval)
        onDismiss()
      }
    }, 16) // ~60fps

    return () => clearInterval(interval)
  }, [isVisible, duration, onDismiss])

  const isError = variant === 'error'
  const bgColor = isError ? 'bg-red-500' : 'bg-myBlue'
  const progressBarColor = isError ? 'bg-red-600' : 'bg-green-600'

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 25,
            duration: 0.3 
          }}
          className={`fixed top-4 right-4 z-50 ${bgColor} text-white rounded-lg shadow-lg overflow-hidden min-w-[280px] max-w-[400px]`}
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              {/* Icon based on variant */}
              {isError ? (
                // X circle icon for error
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 00-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                </svg>
              ) : (
                // Check circle icon for success
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
              )}
              <motion.span 
                key={message}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="font-medium text-sm"
              >
                {message}
              </motion.span>
            </div>
            
            <button
              onClick={onDismiss}
              className="ml-4 text-white hover:text-gray-200 transition-colors"
            >
              {/* X mark icon */}
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Progress bar */}
          <div className={progressBarColor}>
            <motion.div
              className="h-1 bg-white"
              initial={{ width: "100%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}