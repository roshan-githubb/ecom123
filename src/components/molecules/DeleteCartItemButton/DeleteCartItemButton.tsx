"use client"

import { Button } from "@/components/atoms"
import { BinIcon } from "@/icons"
import { deleteLineItem } from "@/lib/data/cart"
import { useCartStore } from "@/store/useCartStore"
import { useState } from "react"

export const DeleteCartItemButton = ({ id }: { id: string }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const fetchCart = useCartStore(state => state.fetchCart)

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    try {
      await deleteLineItem(id)
      await fetchCart()
    } finally {
      setIsDeleting(false)
    }
  }
  
  return (
    <Button
      variant="text"
      className="w-10 h-10 flex items-center justify-center p-0"
      onClick={() => handleDelete(id)}
      loading={isDeleting}
      disabled={isDeleting}
    >
      <BinIcon size={20} />
    </Button>
  )
}
