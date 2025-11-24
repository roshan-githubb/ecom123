"use client"

import { Input } from "@/components/atoms"
import { SearchIcon } from "@/icons"
import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"

export function NavbarSearch() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [search, setSearch] = useState(searchParams.get("query") || "")

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (search) {
      router.push(`/categories?query=${search}`)
    } else {
      router.push(`/categories`)
    }
  }

  return (
    <form
      className="flex items-center flex-1 min-w-0 max-w-full"
      method="POST"
      onSubmit={submitHandler}
    >
      <Input
        icon={<SearchIcon className="w-5 h-5 text-gray-500 lg:hidden" />}
        placeholder="Search product"
        value={search}
        changeValue={setSearch}
      />
      <input type="submit" className="hidden" />
    </form>
  )
}
