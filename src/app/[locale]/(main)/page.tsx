import { SectionHeader } from "@/components/atoms/SectionHeader/SectionHeader"
import { ItemCategoryCard } from "@/components/cells/CategoryCard/CategoryCard"
import CarouselBanner from "@/components/molecules/BannerCarousel/BannerCarousel"
import { HomeProductCardWithRatings } from "@/components/molecules/HomeProductCard/HomeProductCardWithRatings"
import { HorizontalScroller } from "@/components/molecules/HorizontalScroller/HorizontalScrollbar"
import {
  TopCategoriesSkeleton,
  BannerSkeleton,
  CategoriesGridSkeleton,
  ProductsSectionSkeleton,
  FlashItemsSkeleton,
  // BrandsSkeleton,
  VideoSkeleton,
} from "@/components/organisms/HomepageSkeleton/SectionSkeletons"
import FlashItems from "@/components/sections/FlashItems/FlashItems"
import TopProducts from "@/components/sections/TopProducts/TopProducts"
import { listProducts } from "@/lib/data/products"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { getBanners } from "@/lib/get-banners"
import { sortProductsByInventory } from "@/lib/sortProducts/sortProducts"
import PopularProductsRows from "@/components/sections/PopularProductsRow/PopularProductsRow"
import Link from "next/link"

interface CategoryItemMetadata {
  thumbnail_url: string
}
export interface CategoryItem {
  created_at: string
  description: string
  handle: string
  id: string
  name: string
  parent_category_id: number
  rank: number
  updated_at: string
  metadata: CategoryItemMetadata
}


async function TopCollectionsSection({ locale }: { locale: string }) {
  const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/collections?fields=*metadata`

  const headers = {
    "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
    "Content-Type": "application/json",
  }

  try {
    const res = await fetch(url, {
      method: "GET",
      next: { revalidate: 300 }, // Cache for 5 minutes
      headers,
    })

    if (!res.ok) {
      console.error("Failed to fetch collections")
      return null
    }

    const data = await res.json()
    const collections = data.collections || []

    // 🔍 Console log to check collections data from API
    console.log('📚 COLLECTIONS API RESPONSE:', {
      totalCollections: collections.length,
      collections: collections.map((col: any) => ({
        id: col.id,
        title: col.title,
        handle: col.handle,
        metadata: col.metadata,
        thumbnail: col.metadata?.thumbnail,
        hasThumbnail: !!col.metadata?.thumbnail
      }))
    })

    if (collections.length === 0) {
      return null
    }

    const displayCollections = collections.slice(0, 8)
    const hasMore = collections.length > 8

    return (
      <div>
        {hasMore && (
          <SectionHeader
            title="Collections"
            actionLabel="See All"
            link="/collections"
            locale={locale}
          />
        )}
        <HorizontalScroller>
          {displayCollections.map((collection: any) => {
            const thumbnailUrl = 
              collection?.metadata?.thumbnail || 
              "/product-placeholder.png"

            // 🔍 Console log for each collection thumbnail
            console.log(`🎨 Collection "${collection.title}":`, {
              hasMetadata: !!collection.metadata,
              thumbnail: collection.metadata?.thumbnail,
              finalUrl: thumbnailUrl,
              usingPlaceholder: thumbnailUrl === "/product-placeholder.png"
            })

            return (
              <div key={collection.id} className="flex-shrink-0">
                <ItemCategoryCard
                  imageUrl={thumbnailUrl}
                  label={collection.title}
                  shape="rounded"
                  height={80}
                  width={80}
                  link={`/collections/${collection.handle}`}
                />
              </div>
            )
          })}
        </HorizontalScroller>
      </div>
    )
  } catch (error) {
    console.error("Error fetching collections:", error)
    return null
  }
}

// Async components for each section
async function CategoriesSection() {
  // Use the same function as hamburger menu to ensure consistency
  const { listHierarchicalCategories } = await import("@/lib/data/categories")
  const parentCategories = await listHierarchicalCategories()

  // 🔍 Console log to check category data from API
  console.log('📦 CATEGORIES API RESPONSE:', {
    totalCategories: parentCategories.length,
    categories: parentCategories.map(c => ({
      id: c.id,
      name: c.name,
      handle: c.handle,
      metadata: c.metadata,
      thumbnail_url: c.metadata?.thumbnail_url,
      thumbnail_url_type: typeof c.metadata?.thumbnail_url,
      hasThumbnail: !!c.metadata?.thumbnail_url
    }))
  })

  const displayCategories = parentCategories.slice(0, 7)
  const hasMore = parentCategories.length > 7

  return (
    <div className="grid grid-cols-4 gap-4">
      {displayCategories.map((c) => {
        const thumbnailUrl = typeof c?.metadata?.thumbnail_url === 'string' 
          ? c.metadata.thumbnail_url 
          : "/product-placeholder.png"
        
        // 🔍 Console log for each category thumbnail
        console.log(`🖼️  Category "${c.name}":`, {
          hasMetadata: !!c.metadata,
          thumbnail_url: c.metadata?.thumbnail_url,
          thumbnail_url_type: typeof c.metadata?.thumbnail_url,
          thumbnail_url_length: typeof c.metadata?.thumbnail_url === 'string' ? c.metadata.thumbnail_url.length : 0,
          metadata_keys: c.metadata ? Object.keys(c.metadata) : [],
          finalUrl: thumbnailUrl,
          usingPlaceholder: thumbnailUrl === "/product-placeholder.png"
        })
        
        return (
          <div key={c.id} className="flex-shrink-0">
            <ItemCategoryCard
              imageUrl={thumbnailUrl}
              label={c.name}
              shape="circle"
              height={70}
              width={70}
              link={`/categories/${c?.handle}`}
            />
          </div>
        )
      })}
      {hasMore && (
        <div className="flex-shrink-0">
          <ItemCategoryCard
            imageUrl="/product-placeholder.png"
            label="More"
            shape="circle"
            height={70}
            width={70}
            link="/categories"
          />
        </div>
      )}
    </div>
  )
}

async function BannerSection() {
  const bannerCarousel = await getBanners("homepage_carousel")
  return <CarouselBanner bannerCarousel={bannerCarousel} />
}

async function VideoSection() {
  const bannerCarousel = await getBanners("homepage_bottom")
  return <CarouselBanner bannerCarousel={bannerCarousel} />
}

async function RecommendedSection({ locale, regionId }: { locale: string; regionId?: string }) {
  const productsResult = await listProducts({
    countryCode: locale,
    regionId,
    queryParams: { 
      limit: 8, 
      order: "created_at",
      fields: "*variants.calculated_price,+variants.inventory_quantity,*categories,*seller"
    },
  });

  const { response: { products: jsonLdProducts } } = productsResult;
  const sortedProducts = sortProductsByInventory(jsonLdProducts);

  return (
    <>
      <SectionHeader
        title="Recommended for you"
        actionLabel="See All"
        link="/recommended"
        locale={locale}
      />
      <div className="overflow-x-scroll gap-x-2 mt-2 flex no-scrollbar">
        {sortedProducts.slice(0, 8).map((r, index) => (
          <div key={r.id} className="w-[140px] flex-shrink-0">
            <HomeProductCardWithRatings
              api_product={r}
              allProducts={sortedProducts}
              productIndex={index}
            />
          </div>
        ))}
        {sortedProducts.length > 8 && (
          <Link
            href="/recommended"
            className="w-[140px] flex-shrink-0 bg-white rounded-lg border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-myBlue hover:shadow-md transition-all active:scale-95"
            style={{ aspectRatio: '1/1.3' }}
          >
            <svg
              className="w-12 h-12 text-myBlue mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <p className="text-sm font-semibold text-gray-700">See More</p>
          </Link>
        )}
      </div>
    </>
  )
}

async function BestDealsSection({
  locale,
  regionId,
}: {
  locale: string
  regionId?: string
}) {
  const {
    response: { products: jsonLdProducts },
  } = await listProducts({
    countryCode: locale,
    regionId,
    queryParams: { limit: 8, order: "-updated_at" }, // Use different order for some variety
  })

  const sortedProducts = sortProductsByInventory(jsonLdProducts)

  return (
    <>
      <SectionHeader title="Best Deals" actionLabel="See All" locale={locale} />
      <HorizontalScroller className="no-scrollbar !mt-1">
        {sortedProducts.slice(0, 8).map((r, index) => (
          <div key={r.id} className="w-[140px] flex-shrink-0">
            <HomeProductCardWithRatings
              api_product={r}
              allProducts={sortedProducts}
              productIndex={index}
            />
          </div>
        ))}
        {sortedProducts.length > 8 && (
          <Link
            href="/products"
            className="w-[140px] flex-shrink-0 bg-white rounded-lg border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-myBlue hover:shadow-md transition-all active:scale-95"
            style={{ aspectRatio: '1/1.3' }}
          >
            <svg
              className="w-12 h-12 text-myBlue mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <p className="text-sm font-semibold text-gray-700">See More</p>
          </Link>
        )}
      </HorizontalScroller>
    </>
  )
}

interface Params {
  locale: string
}

export default async function HomePage({
  params,
}: {
  params: Promise<Params>
}) {
  const { locale } = await params

  // Pre-fetch region once to avoid multiple lookups in child sections
  const { getRegion } = await import("@/lib/data/regions")
  const region = await getRegion(locale)
  const regionId = region?.id

  try {
    return (
      <div className="space-y-6 md:space-y-8 lg:space-y-12 px-4 lg:px-8 py-4 pt-7">
        {/* Top horizontal collections scroller - Dynamic from admin panel */}
        <Suspense fallback={<TopCategoriesSkeleton />}>
          <div className="animate-slide-in-up">
            <TopCollectionsSection locale={locale} />
          </div>
        </Suspense>

        {/* Large banner carousel */}
        <Suspense fallback={<BannerSkeleton />}>
          <div className="pt-0 animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <BannerSection />
          </div>
        </Suspense>

        {/* Categories grid */}
        <Suspense fallback={<CategoriesGridSkeleton />}>
          <div className="animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <CategoriesSection />
          </div>
        </Suspense>

        {/* Popular products Section */}
        <Suspense fallback={<FlashItemsSkeleton />}>
          <div className="animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
            <PopularProductsRows
              link="popular-products"
              title="Popular Products"
              type="new-popular"
            />
          </div>
        </Suspense>

        {/* Trending products Section */}
        <Suspense fallback={<FlashItemsSkeleton />}>
          <div className="animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
            <PopularProductsRows
              link="trending-products"
              title="Trending Products"
              type="trending"
            />
          </div>
        </Suspense>

        {/* Recommended for you */}
        {/* <Suspense
          fallback={<ProductsSectionSkeleton title="Recommended for you" />}
        >
          <RecommendedSection locale={locale} regionId={regionId} />
        </Suspense> */}

        {/* Top brands
        <Suspense fallback={<BrandsSkeleton />}>
          <SectionHeader title="Top Brands" actionLabel="See All" locale={locale} />
          <div className="grid grid-cols-4 gap-4">
            {brands.map((brand: any) => (
              <ItemCategoryCard
                key={brand?.name}
                imageUrl={brand?.image || "/images/not-available/not-available.png"}
                label={brand?.name}
                shape="circle"
                height={70}
                width={70}
                link="/coming-soon"
              />
            ))}
          </div>
        </Suspense> */}

        {/* Best deals */}
        <Suspense
          fallback={<ProductsSectionSkeleton title="Best Selling Products" />}
        >
          <div className="animate-slide-in-up" style={{ animationDelay: '0.5s' }}>
            <TopProducts
              regionId={regionId}
              title="Best Selling Products"
              link="/bestselling-products"
              type="bestsellers"
            />
          </div>
        </Suspense>

        {/* Advert video section */}
        <Suspense fallback={<VideoSkeleton />}>
          <div className="pt-0 animate-scale-in" style={{ animationDelay: '0.6s' }}>
            <VideoSection />
          </div>
        </Suspense>

        {/* Most Popular */}
        <Suspense fallback={<ProductsSectionSkeleton title="Top Products" />}>
          <div className="animate-slide-in-up" style={{ animationDelay: '0.7s' }}>
            <TopProducts
              regionId={regionId}
              title="Top Products"
              link="/top-products"
            />
          </div>
        </Suspense>
      </div>
    )
  } catch (err) {
    return notFound()
  }
}
