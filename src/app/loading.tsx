export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      {/* Logo */}
      <div className="mb-6">
        <img 
          src="/appIcon.png" 
          alt="Loading..." 
          className="h-12 w-auto"
        />
      </div>
      
      {/* Spinner*/}
      <div className="relative">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
      
      {/* Loading text */}
      <p className="mt-4 text-gray-600 text-sm animate-pulse">
        Loading your shopping experience...
      </p>
      
      {/* Progress dots */}
      <div className="flex space-x-1 mt-3">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}