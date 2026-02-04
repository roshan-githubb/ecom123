"use client"

import { Input } from "@/components/atoms"
import { SearchIcon } from "@/icons"
import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { InstantSearchNext } from 'react-instantsearch-nextjs'
import { client } from '@/lib/client'
import { useHits, useSearchBox } from "react-instantsearch"

function SearchWithSuggestions({ search, setSearch, onSubmit }: { search: string, setSearch: (s: string) => void, onSubmit: (query: string) => void }) {
  const { refine } = useSearchBox()
  const { hits } = useHits()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (value: string) => {
    setSearch(value)
    refine(value)
    setIsOpen(value.length > 0)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearch(suggestion)
    setIsOpen(false)
    onSubmit(suggestion)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsOpen(false)
    onSubmit(search)
  }

  return (
    <div ref={ref} className="relative w-full">
      <form onSubmit={handleSubmit} className="flex items-center w-full max-w-full bg-white border rounded-full overflow-hidden shadow-sm" role="search">
        <Input
          placeholder="Search products"
          value={search}
          changeValue={handleInputChange}
          className="flex-1 px-4 py-2 rounded-l-full bg-white border-none focus:outline-none focus:border-none"
        />
        <button
          type="submit"
          className="bg-myBlue hover:opacity-90 border border-white text-white p-3 rounded-r-full transition-colors"
          aria-label="Search"
        >
          <SearchIcon className="w-5 h-5 text-white" color="white"/>
        </button>
      </form>
      {isOpen && hits.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {hits.slice(0, 5).map((hit: any) => (
            <div key={hit.objectID} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSuggestionClick(hit.title)}>
              {hit.title}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function NavbarSearch() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [search, setSearch] = useState(searchParams.get("query") || "")

  const submitHandler = (query: string) => {
    router.push(query ? `/products?query=${query}` : `/products`)
  }

  const indexName = `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX || ""}products`

  return (
    <InstantSearchNext searchClient={client} indexName={indexName}>
      <SearchWithSuggestions search={search} setSearch={setSearch} onSubmit={submitHandler} />
    </InstantSearchNext>
  )
}
