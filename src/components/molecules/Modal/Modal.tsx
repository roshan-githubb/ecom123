"use client"

import { CloseIcon } from "@/icons"
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock"

interface ModalProps {
  children: React.ReactNode
  heading: string
  onClose: () => void
  showCloseButton?: boolean
  centerHeading?: boolean
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
}

export const Modal = ({
  children,
  heading,
  onClose,
  showCloseButton = true,
  centerHeading = true,
  maxWidth = 'md',
  className = '',
}: ModalProps) => {
  // Prevent background scrolling when modal is open
  useBodyScrollLock(true)

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-30">
      <div
        className="bg-tertiary/60 w-full h-full absolute backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative bg-primary z-20 py-5 rounded-sm w-[90%] max-h-[80vh] overflow-y-auto shadow-lg ${
        maxWidth === 'sm' ? 'max-w-[400px]' :
        maxWidth === 'md' ? 'max-w-[600px]' :
        maxWidth === 'lg' ? 'max-w-[800px]' :
        maxWidth === 'xl' ? 'max-w-[1000px]' :
        maxWidth === '2xl' ? 'max-w-[1200px]' :
        'max-w-[600px]'
      } ${className}`}>
        <div className={`uppercase flex items-center heading-md border-b px-4 ${
          centerHeading ? 'justify-center relative' : 'justify-between'
        }`}>
          {centerHeading ? (
            <>
              <span className="text-center flex-1">{heading}</span>
              {showCloseButton && (
                <div onClick={onClose} className="cursor-pointer absolute right-4">
                  <CloseIcon size={20} />
                </div>
              )}
            </>
          ) : (
            <>
              {heading}
              {showCloseButton && (
                <div onClick={onClose} className="cursor-pointer">
                  <CloseIcon size={20} />
                </div>
              )}
            </>
          )}
        </div>
        <div className="pt-5 px-5">{children}</div>
      </div>
    </div>
  )
}
