"use client"

export default function ProductDetailSkeleton() {
  return (
    <main className="min-h-screen animate-pulse">
      <section className="w-full bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto py-4 px-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="w-40 h-4 bg-gray-200 rounded" />
            <div className="flex items-center gap-2">
              <div className="w-24 h-4 bg-gray-200 rounded" />
            </div>
          </div>

          <div className="w-2/3 h-5 bg-gray-200 rounded" />
          <div className="flex gap-2">
            <div className="w-20 h-6 bg-gray-300 rounded" />
            <div className="w-32 h-4 bg-gray-200 rounded" />
          </div>
          <div className="w-40 h-4 bg-gray-200 rounded" />
        </div>
      </section>

      <section className="max-w-4xl mx-auto pb-6 px-4">
        <div className="w-screen relative left-1/2 right-1/2 -translate-x-1/2 bg-gray-100 flex justify-center py-5">
          <div className="w-[296px] h-[320px] bg-gray-200 rounded-lg" />
        </div>

        <div className="flex justify-center gap-2 mt-4">
          <div className="w-2 h-2 bg-gray-300 rounded-full" />
          <div className="w-2 h-2 bg-gray-300 rounded-full" />
          <div className="w-2 h-2 bg-gray-300 rounded-full" />
        </div>

        <hr className="my-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <div className="w-28 h-4 bg-gray-200 rounded" />
            <div className="flex gap-3">
              <div className="w-[84px] h-[74px] bg-gray-200 rounded-md" />
              <div className="w-[84px] h-[74px] bg-gray-200 rounded-md" />
              <div className="w-[84px] h-[74px] bg-gray-200 rounded-md" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="w-16 h-4 bg-gray-200 rounded" />
            <div className="flex gap-2">
              <div className="w-[50px] h-[40px] bg-gray-200 rounded-md" />
              <div className="w-[50px] h-[40px] bg-gray-200 rounded-md" />
              <div className="w-[50px] h-[40px] bg-gray-200 rounded-md" />
            </div>
          </div>
        </div>

        <hr className="my-4" />

        <div className="space-y-3">
          <div className="w-40 h-6 bg-gray-200 rounded" />
          <div className="flex items-center gap-3">
            <div className="w-20 h-8 bg-gray-200 rounded" />
            <div className="w-24 h-8 bg-gray-200 rounded" />
          </div>
          <div className="w-32 h-4 bg-gray-200 rounded" />
        </div>

        <hr className="my-4" />

        <div className="space-y-3">
          <div className="w-48 h-5 bg-gray-200 rounded" />
          <div className="space-y-2">
            <div className="w-full h-4 bg-gray-200 rounded" />
            <div className="w-2/3 h-4 bg-gray-200 rounded" />
            <div className="w-1/2 h-4 bg-gray-200 rounded" />
          </div>
        </div>

        <hr className="my-4" />

        <div className="space-y-3">
          <div className="w-52 h-5 bg-gray-200 rounded" />
          <div className="space-y-2">
            <div className="w-full h-4 bg-gray-200 rounded" />
            <div className="w-3/4 h-4 bg-gray-200 rounded" />
          </div>
        </div>

        <hr className="my-4" />

        <div className="space-y-3">
          <div className="w-60 h-5 bg-gray-200 rounded" />
          <div className="space-y-2">
            <div className="w-full h-12 bg-gray-200 rounded" />
            <div className="w-full h-12 bg-gray-200 rounded" />
            <div className="w-full h-12 bg-gray-200 rounded" />
          </div>
        </div>
      </section>
    </main>
  )
}
