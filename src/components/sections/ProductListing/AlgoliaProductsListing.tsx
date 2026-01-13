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
import { SearchProductCard } from "@/components/organisms/ProductCard/SearchResultProductCard"
import { getProductRatingSummaries } from "@/lib/helpers/rating-helpers"
import { HomeProductCard } from "@/components/molecules/HomeProductCard/HomeProductCard"
import { useEffect, useState } from "react"
import { listProducts } from "@/lib/data/products"

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
  const [apiProducts, setApiProducts] =
    useState<HttpTypes.StoreProduct[]>([])

  useEffect(() => {
    if (!items.length) return

    const fetchProducts = async () => {
      const productHandles = items.map((p: any) => p.handle)

      const { response } = await listProducts({
        queryParams: {
          handle: productHandles,
          fields: "*variants.calculated_price,*images,*variants.inventory_quantity",
          limit: items.length,
        },
      })

      setApiProducts(response.products)
    }

    fetchProducts()
  }, [items])

  const [ratingSummaryMap, setRatingSummaryMap] =
    useState<Record<string, SimpleRatingSummary>>({})

  useEffect(() => {
    if (!apiProducts.length) return

    const fetchRatings = async () => {
      const productIds = apiProducts.map((p) => p.id)
      const ratings = await getProductRatingSummaries(productIds)
      setRatingSummaryMap(ratings)
    }

    fetchRatings()
  }, [apiProducts])


  const updateSearchParams = useUpdateSearchParams()

  const selectOptionHandler = (value: string) => {
    updateSearchParams("sortBy", value)
  }

  if (!results?.processingTimeMS) return <ProductListingSkeleton />



  return (
    <>
      <div className="flex justify-between w-full items-center">
        <div className="my-4 label-md">{`${results?.nbHits} listings`}</div>
        {/* <div className="hidden md:flex gap-2 items-center">
          Sort by:{" "}
          <SelectField
            className="min-w-[200px]"
            options={selectOptions}
            selectOption={selectOptionHandler}
          />
        </div> TODO: Fix sorting with Algolia */}
      </div>
      <div className="hidden md:block">
        <ProductListingActiveFilters />
      </div>
      <div className="md:flex gap-4">
        <div>
          <AlgoliaProductSidebar />
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
              <ul className="flex flex-wrap gap-4">
                {/* {items.map((hit, index) => (
                  // <SearchProductCard
                  //   key={hit.objectID}
                  //   product={hit}
                  //   currency_code={currency_code}
                  // />
                  <HomeProductCard
                    api_product={hit}
                    allProducts={items}
                    productIndex={index}
                    ratingSummary={ratingSummaryMap[hit.id]}
                  />
                ))} */}
                {items.map((hit, index) => {
                  const apiProduct = apiProducts.find(
                    (p) => p.handle === hit.handle
                  )

                  if (!apiProduct) return null

                  return (
                    <HomeProductCard
                      key={apiProduct.id}
                      api_product={apiProduct}
                      allProducts={apiProducts}
                      productIndex={index}
                      ratingSummary={ratingSummaryMap[apiProduct.id]}
                    />
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
      <ProductsPagination pages={results?.nbPages || 1} />
    </>
  )
}
