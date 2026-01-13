import { LoginForm } from "@/components/molecules"
import { retrieveCustomer } from "@/lib/data/customer"
import { ProfileOverview } from "@/components/organisms/ProfileOverview/ProfileOverview"

export default async function ProfilePage() {
  const customer = await retrieveCustomer()

  if (!customer) {
    return <LoginForm />
  }

  const orders: any[] = []

  return (
    <main className="container mx-auto px-4 py-6">
      <ProfileOverview customer={customer} recentOrders={orders} />
    </main>
  )
}