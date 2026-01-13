import { ComingSoon } from "@/components/molecules/ComingSoon/ComingSoon"
import { Package } from "lucide-react"

export default function ComingSoonOrdersPage() {
  return (
    <ComingSoon 
      title="Orders"
      description="We're working on bringing you a comprehensive order management system. Soon you'll be able to track your orders, view order history, and manage returns all in one place."
      icon={<Package className="h-10 w-10 text-blue-600" />}
    />
  )
}