"use client"

import { CloseIcon } from "@/icons"
import { useEffect } from "react"

export const Modal = ({
  children,
  heading,
  onClose,
  showCloseButton = true,
}: {
  children: React.ReactNode
  heading: string
  onClose: () => void
  showCloseButton?: boolean
}) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    // Disable scrolling
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    // Cleanup function to restore scrolling when modal closes
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-30">
      <div
        className="bg-tertiary/60 w-full h-full absolute backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-primary z-20 py-5 rounded-sm max-w-[600px] w-[90%] max-h-[80vh] overflow-y-auto shadow-lg">
        <div className="uppercase flex justify-between items-center heading-md border-b px-4">
          {heading}
          {showCloseButton && (
            <div onClick={onClose} className="cursor-pointer">
              <CloseIcon size={20} />
            </div>
          )}
        </div>
        <div className="pt-5 px-5">{children}</div>
      </div>
    </div>
  )
}
