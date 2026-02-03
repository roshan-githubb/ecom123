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
    router.push(search ? `/products?query=${search}` : `/products`)
  }

  return (
    <form
      onSubmit={submitHandler}
      className="flex items-center w-full max-w-md bg-white border  rounded-full overflow-hidden shadow-sm"
      role="search"
    >
      <Input
        placeholder="Search products"
        value={search}
        changeValue={setSearch}
        className="flex-1 px-4 py-2 rounded-l-full bg-none border-none focus:outline-none focus:border-none"
      />
      <button
        type="submit"
        className="bg-myBlue hover:opacity-90 border border-white  text-white p-3 rounded-r-full transition-colors"
        aria-label="Search"
      >
        <SearchIcon className="w-5 h-5 text-white" color="white"/>
      </button>
    </form>
  )
}
