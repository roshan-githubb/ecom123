export default function CheckoutLoading() {
  return (
    <div className="max-w-4xl mx-auto p-4 animate-pulse">
      {/* Header */}
      <div className="mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-64 bg-gray-200 rounded" />
      </div>
      
      {/* Progress steps */}
      <div className="flex justify-between mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
            <div className="h-1 w-16 bg-gray-200 ml-2" />
          </div>
        ))}
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
        
        {/* Right column - Order summary */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="h-6 w-28 bg-gray-200 rounded mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}