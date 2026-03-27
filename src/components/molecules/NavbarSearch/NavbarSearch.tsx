"use client"

import { Input } from "@/components/atoms"
import { SearchIcon } from "@/icons"
import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { InstantSearchNext } from 'react-instantsearch-nextjs'
import { client } from '@/lib/client'
import { useHits, useSearchBox } from "react-instantsearch"
import { logSearch } from "@/lib/firebase/analytics"

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
    <div ref={ref} className="relative w-full lg:max-w-md xl:max-w-lg">
      <form onSubmit={handleSubmit} className="flex items-center w-full bg-white border border-gray-300 rounded-sm overflow-hidden hover:border-gray-400 transition-all duration-200" role="search">
        <Input
          placeholder="Search products"
          value={search}
          changeValue={handleInputChange}
          className="flex-1 !h-7 lg:!h-8 px-2 lg:px-3 !py-0 bg-white border-none focus:outline-none focus:border-none text-xs lg:text-sm placeholder:text-gray-400"
        />
        <button
          type="submit"
          className="bg-myBlue hover:bg-[#2e2e7a] active:bg-[#252566] text-white px-2.5 lg:px-3 h-7 lg:h-8 transition-all duration-200 flex items-center justify-center"
          aria-label="Search"
        >
          <SearchIcon className="w-3.5 h-3.5 text-white" color="white"/>
        </button>
      </form>
      {isOpen && hits.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-xl z-50 max-h-80 overflow-y-auto animate-fade-in">
          {hits.slice(0, 8).map((hit: any) => (
            <div 
              key={hit.objectID} 
              className="px-2 lg:px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0 text-xs lg:text-sm" 
              onClick={() => handleSuggestionClick(hit.title)}
            >
              <div className="flex items-center gap-2">
                <SearchIcon className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-gray-400 flex-shrink-0" color="#9ca3af"/>
                <span className="text-gray-800 truncate">{hit.title}</span>
              </div>
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
   
    if (query) {
      logSearch(query)
    }
    router.push(query ? `/products?query=${query}` : `/products`)
  }

  const indexName = `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX || ""}products`

  return (
    <InstantSearchNext searchClient={client} indexName={indexName}>
      <SearchWithSuggestions search={search} setSearch={setSearch} onSubmit={submitHandler} />
    </InstantSearchNext>
  )
}
