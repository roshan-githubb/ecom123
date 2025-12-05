"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "")
  const [color, setColor] = useState(searchParams.get("color") || "")

  const updateURL = useCallback(
    (updates: Record<string, string | number | boolean | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          params.delete(key)
        } else {
          params.set(key, String(value))
        }
      })

      router.push(`?${params.toString()}`)
    },
    [router, searchParams] // dependencies
  )

  useEffect(() => {
    updateURL({ min_price: minPrice, max_price: maxPrice, color })
  }, [minPrice, maxPrice, color, updateURL])

  return (
    <div className="p-4 border rounded-xl space-y-4 w-full max-w-sm bg-white">
      <h2 className="text-lg font-bold">Filters</h2>

      {/*  min and max price*/}
      <div className="space-y-2">
        <label className="font-medium">Price Range</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            className="border p-2 rounded w-full"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max"
            className="border p-2 rounded w-full"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      {/* colors */}
      <div className="space-y-2">
        <label className="font-medium">Color</label>
        <select
          className="border p-2 rounded w-full"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        >
          <option value="">All</option>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="black">Black</option>
          <option value="white">White</option>
        </select>
      </div>
    </div>
  )
}
