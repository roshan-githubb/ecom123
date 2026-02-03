"use client"

import {  Chip, StarRating } from "@/components/atoms"
import * as Slider from "@radix-ui/react-slider"
import { Accordion, FilterCheckboxOption, Modal } from "@/components/molecules"
import useFilters from "@/hooks/useFilters"
import useUpdateSearchParams from "@/hooks/useUpdateSearchParams"
import { cn } from "@/lib/utils"
import { useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import { useRefinementList } from "react-instantsearch"
import { ProductListingActiveFilters } from "../ProductListingActiveFilters/ProductListingActiveFilters"
import useGetAllSearchParams from "@/hooks/useGetAllSearchParams"
import { useDebounce } from "@/hooks/useDebounce"

const filters = [
  { label: "5", amount: 40 },
  { label: "4", amount: 78 },
  { label: "3", amount: 0 },
  { label: "2", amount: 0 },
  { label: "1", amount: 0 },
]

export const AlgoliaProductSidebar = ({isOpen, setIsOpen}: {isOpen: boolean, setIsOpen: (isOpen: boolean) => void}) => {
  const [isMobile, setIsMobile] = useState(true)
  const { allSearchParams } = useGetAllSearchParams()


  useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768)
  }

  handleResize() 

  window.addEventListener("resize", handleResize)
  return () => window.removeEventListener("resize", handleResize)
}, [])


  return isMobile ? (
    <>
      
      {isOpen && (
        <Modal heading="Filters" onClose={() => setIsOpen(false)} className="pb-2 min-h-[50vh]" >
          <div className="pt-4"></div>
          <div className="px-4">
            <ProductListingActiveFilters />
            <PriceFilter
              defaultOpen={Boolean(
                allSearchParams.min_price || allSearchParams.max_price
              )}
            />
            <div className="mt-4"></div>
            <SizeFilter defaultOpen={Boolean(allSearchParams.size)} />
            <ColorFilter defaultOpen={Boolean(allSearchParams.color)} />
            {/* <ConditionFilter defaultOpen={Boolean(allSearchParams.condition)} /> */}
          </div>
        </Modal>
      )}
    </>
  ) : (
    <div>
      <PriceFilter />
      <SizeFilter />
      <ColorFilter />
      {/* <ConditionFilter /> */}
      {/* <RatingFilter /> */}
    </div>
  )
}

function ConditionFilter({ defaultOpen = true }: { defaultOpen?: boolean }) {
  const { items } = useRefinementList({
    attribute: "variants.condition",
    limit: 100,
    operator: "or",
  })
  const { updateFilters, isFilterActive } = useFilters("condition")

  const selectHandler = (option: string) => {
    updateFilters(option)
  }
  return (
    <Accordion heading="Condition" defaultOpen={defaultOpen}>
      <ul className="px-4">
        {items.map(({ label, count }) => (
          <li key={label} className="mb-4">
            <FilterCheckboxOption
              checked={isFilterActive(label)}
              disabled={Boolean(!count)}
              onCheck={selectHandler}
              label={label}
            />
          </li>
        ))}
      </ul>
    </Accordion>
  )
}

function ColorFilter({ defaultOpen = true }: { defaultOpen?: boolean }) {
  const { items } = useRefinementList({
    attribute: "variants.color",
    limit: 100,
    operator: "and",
    escapeFacetValues: false,
    sortBy: ["isRefined", "count", "name"],
  })
  const { updateFilters, isFilterActive } = useFilters("color")

  const selectHandler = (option: string) => {
    updateFilters(option)
  }
  return (
    <Accordion heading="Color" defaultOpen={defaultOpen}>
      <ul className="px-4">
        {items.map(({ label, count }) => (
          <li key={label} className="mb-4 flex items-center justify-between">
            <FilterCheckboxOption
              checked={isFilterActive(label)}
              disabled={Boolean(!count)}
              onCheck={selectHandler}
              label={label}
            />
            <div
              style={{ backgroundColor: label.toLowerCase() }}
              className={cn(
                "w-5 h-5 border border-primary rounded-xs",
                Boolean(!label) && "opacity-30"
              )}
            />
          </li>
        ))}
      </ul>
    </Accordion>
  )
}

function SizeFilter({ defaultOpen = true }: { defaultOpen?: boolean }) {
  const { items } = useRefinementList({
    attribute: "variants.size",
    limit: 100,
    operator: "or",
  })
  const { updateFilters, isFilterActive } = useFilters("size")

  const selectSizeHandler = (size: string) => {
    updateFilters(size)
  }

  return (
    <Accordion heading="Size" defaultOpen={defaultOpen}>
      <ul className="grid grid-cols-4 mt-2 gap-2">
        {items.map(({ label }) => (
          <li key={label} className="mb-4">
            <Chip
              selected={isFilterActive(label)}
              onSelect={() => selectSizeHandler(label)}
              value={label}
              className="w-full !justify-center !py-2 !font-normal"
            />
          </li>
        ))}
      </ul>
    </Accordion>
  )
}

function PriceFilter({ defaultOpen = true }: { defaultOpen?: boolean }) {
  const MIN_PRICE = 0
  const MAX_PRICE = 50000
  const STEP = 100

  const searchParams = useSearchParams()
  const updateSearchParams = useUpdateSearchParams()

  const [range, setRange] = useState<[number, number]>([
    MIN_PRICE,
    MAX_PRICE,
  ])

  // Sync from URL → slider
  useEffect(() => {
    const min = Number(searchParams.get("min_price") ?? MIN_PRICE)
    const max = Number(searchParams.get("max_price") ?? MAX_PRICE)
    setRange([min, max])
  }, [searchParams])

  // Debounce API updates
  const debouncedRange = useDebounce(range, 500)

  useEffect(() => {
    const [min, max] = debouncedRange

    updateSearchParams({
      min_price: min > MIN_PRICE ? String(min) : undefined,
      max_price: max < MAX_PRICE ? String(max) : undefined,
    })
  }, [debouncedRange])

  return (
    <Accordion heading="Price" defaultOpen={defaultOpen}>
      <div className="px-3 py-4">
        {/* Labels */}
        <div className="flex justify-between text-sm text-muted mb-3">
          <span>Min: {range[0]}</span>
          <span>Max: {range[1]}</span>
        </div>

        {/* SINGLE dual-thumb slider */}
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-5"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={STEP}
          value={range}
          onValueChange={(value) =>
            setRange(value as [number, number])
          }
        >
          <Slider.Track className="bg-gray-400 border relative grow rounded-full h-2">
            <Slider.Range className="absolute bg-gray-400 rounded-full h-full" />
          </Slider.Track>

          <Slider.Thumb
            className="block w-4 h-4 bg-myBlue rounded-full shadow focus:outline-none"
          />
          <Slider.Thumb
            className="block w-4 h-4 bg-myBlue rounded-full shadow focus:outline-none"
          />
        </Slider.Root>
      </div>
    </Accordion>
  )
}



function RatingFilter() {
  const { updateFilters, isFilterActive } = useFilters("rating")

  const selectHandler = (option: string) => {
    updateFilters(option)
  }

  return (
    <Accordion heading="Rating">
      <ul className="px-4">
        {filters.map(({ label }) => (
          <li
            key={label}
            className={cn("mb-4 flex items-center gap-2 cursor-pointer")}
            onClick={() => selectHandler(label)}
          >
            <FilterCheckboxOption
              checked={isFilterActive(label)}
              label={label}
            />
            <StarRating rate={+label} />
          </li>
        ))}
      </ul>
    </Accordion>
  )
}
