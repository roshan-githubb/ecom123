"use client";

export default function HomePageSkeleton() {
    return (
        <div className="space-y-6 px-4 lg:px-8 py-4 animate-pulse">

            <div className="flex gap-4 overflow-x-auto">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gray-200 rounded-2xl" />
                        <div className="h-3 w-14 bg-gray-200 rounded mt-2 mx-auto" />
                    </div>
                ))}
            </div>

            <div className="w-full h-40 bg-gray-200 rounded-xl" />

            <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-gray-200" />
                        <div className="h-3 w-12 bg-gray-200 rounded mt-2" />
                    </div>
                ))}
            </div>

            <div>
                <div className="flex justify-between items-center">
                    <div className="h-5 w-24 bg-gray-200 rounded"></div>
                    <div className="h-4 w-12 bg-gray-200 rounded"></div>
                </div>

                <div className="flex overflow-x-auto gap-3 mt-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="w-[180px] flex-shrink-0">
                            <div className="w-full h-40 bg-gray-200 rounded-xl" />
                            <div className="h-4 w-28 bg-gray-200 rounded mt-2" />
                            <div className="h-3 w-20 bg-gray-200 rounded mt-1" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
