/**
 * ProductImageFallback Component
 * Renders a nice placeholder when product image is not available
 */

import React from 'react'
import { Camera, Package } from 'lucide-react'

interface ProductImageFallbackProps {
  className?: string
  productName?: string
}

export const ProductImageFallback: React.FC<ProductImageFallbackProps> = ({
  className = '',
  productName = 'Product',
}) => {
  return (
    <div
      className={`
        w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 
        flex flex-col items-center justify-center rounded-lg 
        border border-slate-200 p-4 text-center
        ${className}
      `}
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/50 mb-4">
        <Package className="w-8 h-8 text-slate-400" />
      </div>
      
      <p className="text-sm font-medium text-slate-600 mb-1">
        No Image Available
      </p>
      
      <p className="text-xs text-slate-500 max-w-xs line-clamp-2">
        Image for {productName} coming soon
      </p>
    </div>
  )
}

export default ProductImageFallback
