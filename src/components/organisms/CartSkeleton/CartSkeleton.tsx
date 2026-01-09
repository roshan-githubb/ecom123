"use client";

export const CheckoutSkeleton = () => {
    return (
        <div className="min-h-screen pb-8 animate-pulse">
            <main className="max-w-md mx-auto relative">
                <DeliveryAddressSkeleton />
                <div className="my-4"></div>
                <ShippingMethodSkeleton />
                <OrderSummarySkeleton />
            </main>
            <PaymentMethodSkeleton />
            <RememberUserInfoSkeleton />
        </div>
    );
};

export const ShippingMethodSkeleton = () => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mx-4 md:mx-0 mt-4">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1">
                        <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                    </div>
                </div>
            </div>
            {/* Content */}
            <div className="p-4 sm:p-6">
                <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
                    <div className="h-4 w-40 bg-gray-200 rounded mx-auto mb-4"></div>
                    <div className="h-8 w-32 bg-gray-200 rounded mx-auto"></div>
                </div>
            </div>
        </div>
    );
};

export const PaymentMethodSkeleton = () => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mx-4 md:mx-0 mt-4">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1">
                        <div className="h-4 w-28 bg-gray-200 rounded mb-2"></div>
                    </div>
                </div>
            </div>
            {/* Content */}
            <div className="p-4 sm:p-6">
                <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
                    <div className="h-4 w-36 bg-gray-200 rounded mx-auto mb-4"></div>
                    <div className="h-8 w-36 bg-gray-200 rounded mx-auto"></div>
                </div>
            </div>
        </div>
    );
};

export const OrderSummarySkeleton = () => {
    return (
        <div className="bg-white p-4 rounded-2xl border mx-4 md:mx-0 mt-4">
            <div className="h-5 w-28 bg-gray-200 rounded mb-4"></div>
            
            {/* Item rows */}
            {[1, 2].map((i) => (
                <div key={i} className="flex justify-between items-center mb-3">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </div>
            ))}

            <div className="border-t pt-4 mt-4 space-y-3">
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

            <div className="border-t pt-4 mt-4 flex justify-between">
                <div className="h-5 w-24 bg-gray-200 rounded"></div>
                <div className="h-5 w-16 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
};

export const RememberUserInfoSkeleton = () => {
    return (
        <div className="max-w-md mx-auto mt-4">
            <div className="bg-white p-4 rounded-2xl border mx-4 md:mx-0 flex items-center gap-3">
                <div className="h-6 w-6 bg-gray-200 rounded"></div>
                <div className="h-4 w-40 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
};


export const DeliveryAddressSkeleton = () => {
    return (
        <>
        {/* // <div className="min-h-screen pb-8 animate-pulse">
        //     <main className="max-w-md mx-auto relative z-0"> */}
                    {/* User Details Skeleton */}
                    < div className="bg-white p-4 rounded-2xl border mx-4 md:mx-0 mt-4" >
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
                    </div >
        {/* //     </main>
        // </div> */}
        </>
    )
}