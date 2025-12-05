"use client";

export const CheckoutSkeleton = () => {
    return (
        <div className="min-h-screen pb-8 animate-pulse">
            <main className="max-w-md mx-auto relative z-0">
                {/* User Details Skeleton */}
                <div className="bg-white p-4 rounded-2xl border mx-4 md:mx-0 mt-4">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-2 w-[178px]">
                            <div className="h-5 w-28 bg-gray-200 rounded"></div>
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            <div className="h-4 w-20 bg-gray-200 rounded"></div>
                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                            <div className="h-4 w-28 bg-gray-200 rounded"></div>
                        </div>

                        <div className="flex flex-col">
                            <div className="h-8 w-20 bg-gray-200 rounded-md"></div>
                        </div>
                    </div>
                </div>

                {/* Order Summary Skeleton */}
                <div className="bg-white p-4 rounded-2xl border mx-4 md:mx-0 mt-4 flex flex-col gap-4">
                    {/* Item rows */}
                    {[1, 2].map((i) => (
                        <div key={i} className="flex justify-between items-center">
                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                            <div className="h-4 w-16 bg-gray-200 rounded"></div>
                        </div>
                    ))}

                    <div className="border-t pt-4 mt-2 flex flex-col gap-3">
                        <div className="flex justify-between">
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            <div className="h-4 w-12 bg-gray-200 rounded"></div>
                        </div>
                        <div className="flex justify-between">
                            <div className="h-4 w-20 bg-gray-200 rounded"></div>
                            <div className="h-4 w-12 bg-gray-200 rounded"></div>
                        </div>
                        <div className="flex justify-between">
                            <div className="h-4 w-28 bg-gray-200 rounded"></div>
                            <div className="h-4 w-14 bg-gray-200 rounded"></div>
                        </div>
                    </div>

                    <div className="border-t pt-4 mt-2 flex justify-between">
                        <div className="h-5 w-24 bg-gray-200 rounded"></div>
                        <div className="h-5 w-16 bg-gray-200 rounded"></div>
                    </div>
                </div>

                {/* Payment Method  */}
                <div className="bg-white p-4 rounded-2xl border mx-4 md:mx-0 mt-4">
                    <div className="h-5 w-32 bg-gray-200 rounded mb-3"></div>
                    <div className="h-8 w-full bg-gray-200 rounded"></div>
                </div>
            </main>

            {/* Save info checkbox */}
            <div className="max-w-md mx-auto mt-4">
                <div className="bg-white p-4 rounded-2xl border mx-4 md:mx-0 flex items-center gap-3">
                    <div className="h-6 w-6 bg-gray-200 rounded"></div>
                    <div className="h-4 w-40 bg-gray-200 rounded"></div>
                </div>
            </div>

            {/* Footer button */}
            <div className="max-w-md mx-auto mt-4 px-4">
                <div className="h-10 w-full bg-gray-200 rounded-xl"></div>
            </div>
        </div>
    );
};
