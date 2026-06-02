"use client"

import { ArrowLeft, Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function ComingSoonWishlist() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Go Back Button */}
      <button
        onClick={() => router.back()}
        className="fixed top-24 left-6 lg:left-8 z-10 p-2 hover:bg-white/80 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        aria-label="Go back"
      >
        <ArrowLeft className="w-6 h-6 text-myBlue" />
      </button>

      <div className="max-w-md w-full text-center animate-scale-in">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-bounce-in">
            <Heart className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="heading-lg text-gray-900 mb-4">
          Wishlist
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-2">
          Save your favorite items for later
        </p>
        <p className="text-base text-gray-500 mb-8">
          This feature will be available very soon. Get ready to create your perfect collection!
        </p>

        {/* Illustration */}
        <div className="mb-8 relative">
          <div className="w-full h-48 bg-gradient-to-b from-white to-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
            <div className="text-center">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Coming Soon</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => router.back()}
          className="w-full bg-myBlue hover:bg-blue-900 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95"
        >
          Go Back & Continue Shopping
        </button>

        {/* Footer */}
        <p className="text-sm text-gray-500 mt-6">
          Be among the first to use this feature. Stay tuned!
        </p>
      </div>
    </div>
  )
}
