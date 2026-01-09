"use client";

export const TopCategoriesSkeleton = () => (
  <div className="flex gap-4 overflow-x-auto animate-pulse">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex-shrink-0">
        <div className="w-20 h-20 bg-gray-200 rounded-2xl" />
        <div className="h-3 w-14 bg-gray-200 rounded mt-2 mx-auto" />
      </div>
    ))}
  </div>
);

export const BannerSkeleton = () => (
  <div className="w-full h-40 bg-gray-200 rounded-xl animate-pulse" />
);

export const CategoriesGridSkeleton = () => (
  <div className="grid grid-cols-4 gap-4 animate-pulse">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-gray-200" />
        <div className="h-3 w-12 bg-gray-200 rounded mt-2" />
      </div>
    ))}
  </div>
);

export const ProductsSectionSkeleton = ({ title = "Products" }: { title?: string }) => (
  <div className="animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="h-5 w-32 bg-gray-200 rounded"></div>
      <div className="h-4 w-16 bg-gray-200 rounded"></div>
    </div>
    <div className="flex overflow-x-auto gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="w-[180px] flex-shrink-0">
          <div className="w-full h-32 bg-gray-200 rounded-t-xl" />
          <div className="p-3 bg-gray-50 rounded-b-xl">
            <div className="h-4 w-28 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-16 bg-gray-200 rounded mb-3" />
            <div className="h-8 w-full bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const FlashItemsSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="h-6 bg-gray-200 rounded w-24"></div>
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </div>
    <div className="flex gap-2 overflow-hidden">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="w-[180px] flex-shrink-0">
          <div className="w-full h-32 bg-gray-200 rounded-t-xl" />
          <div className="p-3 bg-gray-50 rounded-b-xl">
            <div className="h-4 w-28 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
            <div className="h-8 w-full bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const BrandsSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="h-5 w-24 bg-gray-200 rounded"></div>
      <div className="h-4 w-16 bg-gray-200 rounded"></div>
    </div>
    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gray-200" />
          <div className="h-3 w-12 bg-gray-200 rounded mt-2" />
        </div>
      ))}
    </div>
  </div>
);

export const VideoSkeleton = () => (
  <div className="w-full h-48 bg-gray-200 rounded-xl animate-pulse flex items-center justify-center">
    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
      <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
    </div>
  </div>
);

export const AddAddressSkeleton = () => (
  <div className="bg-white p-4 rounded-[16px] border border-[#F5F5F6] shadow-[0_4px_4px_rgba(0,0,0,0.25)] mx-4 md:mx-0 mt-4 animate-pulse">
    <div className="flex flex-col items-center gap-3 py-6">
      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
      <div className="text-center">
        <div className="h-4 w-32 bg-gray-200 rounded mb-1 mx-auto"></div>
        <div className="h-3 w-48 bg-gray-200 rounded mx-auto"></div>
      </div>
      <div className="h-9 w-24 bg-gray-200 rounded-2xl"></div>
    </div>
  </div>
);