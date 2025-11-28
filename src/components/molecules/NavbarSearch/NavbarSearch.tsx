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
    router.push(search ? `/categories?query=${search}` : `/categories`)
  }

  return (
    <form
      className="flex items-center flex-1 min-w-0 max-w-[420px]"
      method="POST"
      onSubmit={submitHandler}
    >
      <Input
        icon={<SearchIcon className="w-5 h-5 text-gray-500" />}
        placeholder="Search product"
        value={search}
        changeValue={setSearch}
        className="
          pl-10      
          md:pl-12  
          w-full
        "
      />
      <input type="submit" className="hidden" />
    </form>
  )
}
