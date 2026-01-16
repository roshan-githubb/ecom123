"use client"

import { useRouter } from "next/navigation"
import { CheckCircle, Home, Package } from "lucide-react"

function OrderSuccessPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>

        <h1 className="mb-3 text-2xl font-bold text-gray-900">
          Order Placed!
        </h1>
        
        <p className="mb-2 text-lg font-semibold text-myBlue">
          #ORD-{Math.random().toString(36).substr(2, 9).toUpperCase()}
        </p>
        
        <p className="mb-8 text-sm text-gray-600 leading-relaxed">
          Thank you for your order! We'll send you a confirmation email shortly with tracking details.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/user/orders')}
            className="w-full flex items-center justify-center gap-2 bg-myBlue text-white py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-all"
          >
            <Package className="w-4 h-4" />
            View My Orders
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-all"
          >
            <Home className="w-4 h-4" />
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccessPage
