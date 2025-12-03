
import Head from "next/head";
import React from "react";


const OffersComingSoonPage: React.FC = () => {
  const contactEmail = "hello@example.com"; 

  return (
    <>
      <Head>
        <title>Offers Coming Soon | [Your Company Name]</title>
        <meta name="description" content="Exciting new offers are launching soon! Check back later for amazing deals and discounts from [Your Company Name]." />
        <meta name="keywords" content="offers, deals, discounts, coming soon, sales, promotion" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-gray-800 rounded-xl shadow-2xl transform hover:shadow-3xl transition duration-500 ease-in-out">
          
          <div className="text-center">
        
            <svg 
              className="mx-auto h-12 w-12 text-indigo-600 dark:text-indigo-400" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            
            <h1 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
               Offers Coming Soon!
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              We are cooking up some incredible deals just for you.
            </p>
          </div>

          <div className="text-center space-y-4">
            <p className="text-lg text-gray-800 dark:text-gray-200 font-medium">
              **Stay Tuned!**
            </p>
            {/* <p className="text-gray-600 dark:text-gray-400 text-sm">
              Our new promotional offers page is launching in a few days. 
              Be the first to know about discounts and limited-time bundles.
            </p> */}

           
            {/* <form className="mt-6 flex flex-col sm:flex-row gap-2">
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Enter your email for updates"
              />
              <button
                type="submit"
                className="w-full sm:w-auto flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                Notify Me
              </button>
            </form> */}
          </div>
          {/* <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Have questions? Contact us at: 
              <a href={`mailto:${contactEmail}`} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 ml-1 font-semibold">
                {contactEmail}
              </a>
            </p>
          </div> */}

        </div>
      </main>
    </>
  );
};

export default OffersComingSoonPage;