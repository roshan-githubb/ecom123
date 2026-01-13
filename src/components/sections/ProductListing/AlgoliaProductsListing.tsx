"use client"

import {
  AlgoliaProductSidebar,
  ProductListingActiveFilters,
  ProductsPagination,
} from "@/components/organisms"
import { client } from "@/lib/client"
import { HttpTypes } from "@medusajs/types"
import { SimpleRatingSummary } from "@/types/reviews"
import { Configure, useHits } from "react-instantsearch"
import { InstantSearchNext } from "react-instantsearch-nextjs"
import { useSearchParams } from "next/navigation"
import { getFacedFilters } from "@/lib/helpers/get-faced-filters"
import useUpdateSearchParams from "@/hooks/useUpdateSearchParams"
import { PRODUCT_LIMIT } from "@/const"
import { ProductListingSkeleton } from "@/components/organisms/ProductListingSkeleton/ProductListingSkeleton"
import { getProductRatingSummaries } from "@/lib/helpers/rating-helpers"
import { HomeProductCard } from "@/components/molecules/HomeProductCard/HomeProductCard"
import { useEffect, useState } from "react"
import { listProducts } from "@/lib/data/products"
import { SearchResultProductCard } from "@/components/organisms/ProductCard/SearchResultProductCard"

export const AlgoliaProductsListing = ({
  category_id,
  collection_id,
  seller_handle,
  locale = process.env.NEXT_PUBLIC_DEFAULT_REGION,
  currency_code,
}: {
  category_id?: string
  collection_id?: string
  locale?: string
  seller_handle?: string
  currency_code?: string
}) => {
  const searchParamas = useSearchParams()

  const indexName = `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX || ""}products`
  const facetFilters: string = getFacedFilters(searchParamas)
  const page: number = +(searchParamas.get("page") || 1)
  const query: string = searchParamas.get("query") || ""

  const filters = `${seller_handle
    ? `NOT seller:null AND seller.handle:${seller_handle}`
    : "NOT seller:null"
    }${currency_code ? ` AND variants.prices.currency_code:${currency_code}` : ""}${category_id
      ? ` AND categories.id:${category_id}${collection_id !== undefined
        ? ` AND collections.id:${collection_id}`
        : ""
      } ${facetFilters}`
      : ` ${facetFilters}`
    }`

  return (
    <InstantSearchNext searchClient={client} indexName={indexName}>
      <Configure
        query={query}
        hitsPerPage={PRODUCT_LIMIT}
        filters={filters}
        page={page - 1}
      />
      <ProductsListing currency_code={currency_code} />
    </InstantSearchNext>
  )
}

const ProductsListing = ({ currency_code }: { currency_code?: string }) => {
  const {
    items,
    results,
    // sendEvent,
  } = useHits()
  const [isOpen, setIsOpen] = useState(false)


  console.log("Algolia items and results:", items, results)


  const [ratingSummaryMap, setRatingSummaryMap] =
    useState<Record<string, SimpleRatingSummary>>({})




  const updateSearchParams = useUpdateSearchParams()

  const selectOptionHandler = (value: string) => {
    updateSearchParams("sortBy", value)
  }

  if (!results?.processingTimeMS) return <ProductListingSkeleton />



  return (
    <>
      <div className="flex justify-between w-full items-center">
        <div className="my-4 label-md">{`${results?.nbHits} listings`}</div>
        <button
          aria-label="Filter"
          className="p-2 rounded-md border border-gray-200 md:hidden"
          onClick={() => setIsOpen(true)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              d="M3 5h18l-7 8v6l-4-2v-4z"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </button>
        {/* <div className="hidden md:flex gap-2 items-center">
          Sort by:{" "}
          <SelectField
            className="min-w-[200px]"
            options={selectOptions}
            selectOption={selectOptionHandler}
          />
        </div> TODO: Fix sorting with Algolia */}
      </div>
      {/* <div className="hidden md:block">
        <ProductListingActiveFilters />
      </div> */}
      <div className="md:flex gap-4">
        <div>
          <AlgoliaProductSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
        <div className="w-full">
          {!items.length ? (
            <div className="text-center w-full my-10">
              <h2 className="uppercase text-primary heading-lg">no results</h2>
              <p className="mt-4 text-lg">
                Sorry, we can&apos;t find any results for your criteria
              </p>
            </div>
          ) : (
            <div className="w-full">
              <ul
                className="
    grid
    grid-cols-2
    sm:grid-cols-3
    md:grid-cols-3
    lg:grid-cols-4
    xl:grid-cols-5
    gap-3
  "
              >
                {items?.map((item: any) => (
                  <li key={item.objectID} className="w-full">
                    <SearchResultProductCard key={item.objectId} product={item} />
                  </li>

                ))}

              </ul>
            </div>
          )}
        </div>
      </div>
      <ProductsPagination pages={results?.nbPages || 1} />
    </>
  )
}
