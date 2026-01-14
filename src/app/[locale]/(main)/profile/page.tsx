import { LoginForm } from "@/components/molecules"
import { retrieveCustomer } from "@/lib/data/customer"
import { ProfileOverview } from "@/components/organisms/ProfileOverview/ProfileOverview"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

export default async function ProfilePage() {
  const customer = await retrieveCustomer()

  if (!customer) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Profile Icon */}
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg 
              width="40" 
              height="40" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-400"
            >
              <path 
                d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" 
                fill="currentColor"
              />
              <path 
                d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" 
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            You&apos;re Not Logged In
          </h1>

          {/* Continue Shopping */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">
              Or continue browsing our products
            </p>
            <LocalizedClientLink
              href="/"
              className="text-myBlue font-medium hover:underline"
            >
              Continue Shopping →
            </LocalizedClientLink>
          </div>

        </div>
      </main>
    )
  }

  const orders: any[] = []

  return (
    <main className="container mx-auto px-4 py-6">
      <ProfileOverview customer={customer} recentOrders={orders} />
    </main>
  )
}