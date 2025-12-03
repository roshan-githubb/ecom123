
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

const ProfileComingSoon: React.FC = () => {
  return (
    <>
      <Head>
        <title>Profile Dashboard - Coming Soon | [Your App Name]</title>
        <meta name="robots" content="noindex, nofollow" /> 
      </Head>

      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6">
        
        <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          
          <div className="pt-10 pb-6 text-center px-8">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30 mb-6">
               
               <svg 
                className="h-10 w-10 text-blue-600 dark:text-blue-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="1.5"
               >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
             Profile Page Coming Soon!
            </h1>
            {/* <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
              We are currently constructing the new user pro. Soon you will have full control over your account settings and preferences.
            </p> */}
          </div>

         
          {/* <div className="bg-gray-50 dark:bg-gray-700/50 px-8 py-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Coming Features
            </h3>
            <ul className="space-y-3">
              {[
                'Edit Profile & Bio', 
                'Order History & Tracking', 
                'Security & Password Management',
                'Notification Preferences'
              ].map((item, index) => (
                <li key={index} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <svg className="h-4 w-4 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div> */}

          <div className="px-8 py-6 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-3 justify-center">
             <Link href="/" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                  Return Home
                </button>
             </Link>
             
            
          </div>

        </div>
      </main>
    </>
  );
};

export default ProfileComingSoon;