import { ComingSoon } from "@/components/molecules/ComingSoon/ComingSoon"
import { Heart } from "lucide-react"

export default function ComingSoonWishlistPage() {
  return (
    <ComingSoon 
      title="Wishlist"
      description="Your personal wishlist is coming soon! Save your favorite items, create multiple lists, and share them with friends and family."
      icon={<Heart className="h-10 w-10 text-blue-600" />}
    />
  )
}