"use client"

import { ProductsList, ProductsPagination, ProductListingHeader } from "@/components/organisms"
import { PRODUCT_LIMIT } from "@/const"
import { listProducts } from "@/lib/data/products"
import { getRegion } from "@/lib/data/regions"
import { sortProductsByInventory } from "@/lib/sortProducts/sortProducts"
import { useEffect, useState } from "react"

interface CollectionProductListingProps {
  collection: any
  locale: string
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function CollectionProductListing({
  collection,
  locale,
  searchParams,
}: CollectionProductListingProps) {
  const [products, setProducts] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const currentPage = parseInt((searchParams?.page as string) || "1", 10)

  useEffect(() => {
    loadProducts()
  }, [collection.id, currentPage])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const region = await getRegion(locale)
      if (!region) throw new Error("Region not found")

      // Fetch products for this collection
      const { response } = await listProducts({
        pageParam: currentPage,
        queryParams: {
          q: '',
          limit: PRODUCT_LIMIT,
          collection_id: [collection.id],
        },
        regionId: region.id,
      })

      const sortedProducts = sortProductsByInventory(response?.products || [])
      setProducts(sortedProducts)
      setTotalCount(response?.count || 0)
    } catch (error) {
      console.error("Error loading products:", error)
      setProducts([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }

  const pages = Math.ceil(totalCount / PRODUCT_LIMIT) || 1

  return (
    <div className="flex-1">
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-myBlue"></div>
        </div>
      ) : (
        <>
          <ProductListingHeader total={totalCount} />
          <div className="mt-4">
            <ProductsList products={products} locale={locale} />
            {pages > 1 && <ProductsPagination pages={pages} />}
          </div>
        </>
      )}
    </div>
  )
}
