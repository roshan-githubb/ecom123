'use client';

import React, { Suspense } from 'react';
import Head from 'next/head';
// import Link from 'next/link';/
// import { useSearchParams, useRouter } from 'next/navigation';


const ComingSoonContent = () => {
    return (
        <div className="max-w-md w-full mx-auto border rounded-xl p-10 text-center bg-white dark:bg-gray-900">
            <h1 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Coming Soon
            </h1>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                This feature is currently under development.<br />
                Please check back later.
            </p>

            <div className="text-sm text-gray-500 dark:text-gray-500">
                Thank you for your patience.
            </div>
        </div>
    );
};



const GeneralComingSoonPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
            <Head>
                <title>Coming Soon</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <Suspense fallback={
                <div className="p-10 bg-white rounded-xl shadow-xl animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>
            }>
                <ComingSoonContent />
            </Suspense>
        </div>
    );
};

export default GeneralComingSoonPage;
