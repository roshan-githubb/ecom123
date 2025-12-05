"use client"

export default function StickyCartBarSkeleton() {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 animate-pulse" />

      <div className="fixed left-0 right-0 bottom-[70px] z-50">
        <div className="w-full bg-[#F4F6FB] rounded-t-3xl shadow-[0_-20px_40px_rgba(6,23,60,0.12)] pb-6 animate-pulse">
          
          <div className="flex items-center justify-between px-5 pt-6 pb-4">
            <div className="w-32 h-5 bg-gray-300 rounded" />
            <div className="w-7 h-7 bg-gray-300 rounded-full" />
          </div>

          <div className="mx-4 bg-white rounded-[20px] py-5 px-3 shadow-sm">
            <div className="flex items-start justify-between pb-4">
              <div className="space-y-2">
                <div className="w-20 h-3 bg-gray-200 rounded" />
                <div className="w-24 h-4 bg-gray-300 rounded" />
              </div>
              <div className="w-12 h-4 bg-gray-200 rounded" />
            </div>

            <div className="pb-4">
              <div className="border-t border-dotted border-gray-300 w-full" />
            </div>

            <div className="space-y-5 max-h-[40vh] overflow-y-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-[52px] h-[52px] bg-gray-200 rounded-lg" />

                    <div className="flex-1 space-y-2">
                      <div className="w-32 h-3 bg-gray-200 rounded" />
                      <div className="w-16 h-3 bg-gray-200 rounded" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center w-[84px] h-[36px] bg-gray-200 rounded-md" />
                    <div className="w-12 h-4 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-8px_24px_rgba(6,23,60,0.06)] animate-pulse">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-gray-200 rounded-lg" />
            <div className="space-y-1">
              <div className="w-20 h-4 bg-gray-200 rounded" />
              <div className="w-16 h-3 bg-gray-200 rounded" />
            </div>
          </div>

          <div className="w-24 h-8 bg-gray-300 rounded-lg" />
        </div>
      </div>
    </>
  )
}
