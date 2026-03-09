import { ComingSoon } from "@/components/molecules/ComingSoon/ComingSoon"
import { Heart } from "lucide-react"
import { redirect } from "next/navigation"

export default function ComingSoonWishlistPage() {
  redirect("/user/wishlist")
}