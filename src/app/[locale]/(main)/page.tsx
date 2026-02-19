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

const topSectionProducts = [
  {
    name: "Products",
    image: "/images/home-top-card/shopping-aisle.webp",
    link: "/products",
  },
  {
    name: "Trending",
    image: "/images/home-top-card/20-percent-off.png",
    link: "/trending-products",
  },
  {
    name: "Popular",
    image: "/images/home-top-card/add-cart.png",
    link: "/popular-products",
  },
  {
    name: "BestSelling",
    image: "/images/home-top-card/buy-any-three.png",
    link: "/bestselling-products",
  },
]

// Async components for each section
async function CategoriesSection() {
  const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/product-categories`

  const headers = {
    "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
    "Content-Type": "application/json",
  }

  const res = await fetch(url, {
    method: "GET",
    next: { revalidate: 3600 }, // Cache for 1 hour
    headers,
  })

  if (!res.ok) {
    throw new Error("Failed to fetch categories")
  }

  const data = await res.json()

  return (
    <div className="grid grid-cols-4 gap-4">
      {data.product_categories.slice(0, 8).map((c: CategoryItem) => (
        <div key={c.id} className="flex-shrink-0">
          <ItemCategoryCard
            imageUrl={c?.metadata?.thumbnail_url || "/product-placeholder.png"}
            label={c.name}
            shape="circle"
            height={70}
            width={70}
            link={`/categories/${c?.handle}`}
          />
        </div>
      ))}
      {/* <div className="flex-shrink-0">
        <ItemCategoryCard
          imageUrl={"/shopping-aisle.webp"}
          label={"Other"}
          shape="circle"
          height={70}
          width={70}
          link={`/categories`}
        />
      </div> */}
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
        {sortedProducts.map((r, index) => (
          <div key={r.id} className="w-[180px] flex-shrink-0">
            <HomeProductCardWithRatings
              api_product={r}
              allProducts={sortedProducts}
              productIndex={index}
            />
          </div>
        ))}
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
        {sortedProducts.map((r, index) => (
          <div key={r.id} className="w-[180px] flex-shrink-0">
            <HomeProductCardWithRatings
              api_product={r}
              allProducts={sortedProducts}
              productIndex={index}
            />
          </div>
        ))}
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
      <div className="space-y-6 px-4 lg:px-8 py-4 pt-7">
        {/* Top horizontal category scroller */}
        <Suspense fallback={<TopCategoriesSkeleton />}>
          <HorizontalScroller>
            {topSectionProducts.map((c: any) => (
              <div key={c.name} className="flex-shrink-0">
                <ItemCategoryCard
                  imageUrl={c?.image || "/product-placeholder.png"}
                  label={c.name}
                  shape="rounded"
                  height={80}
                  width={80}
                  link={c?.link ?? "/coming-soon"}
                />
              </div>
            ))}
          </HorizontalScroller>
        </Suspense>

        {/* Large banner carousel */}
        <Suspense fallback={<BannerSkeleton />}>
          <div className="pt-0">
            <BannerSection />
          </div>
        </Suspense>

        {/* Categories grid */}
        <Suspense fallback={<CategoriesGridSkeleton />}>
          <CategoriesSection />
        </Suspense>

        {/* Popular products Section */}
        <Suspense fallback={<FlashItemsSkeleton />}>
          <PopularProductsRows
            link="popular-products"
            title="Popular Products"
            type="new-popular"
          />
        </Suspense>

        {/* Trending products Section */}
        <Suspense fallback={<FlashItemsSkeleton />}>
          <PopularProductsRows
            link="trending-products"
            title="Trending Products"
            type="trending"
          />
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
          <TopProducts
            regionId={regionId}
            title="Best Selling Products"
            link="/bestselling-products"
            type="bestsellers"
          />
        </Suspense>

        {/* Advert video section */}
        <Suspense fallback={<VideoSkeleton />}>
          <div className="pt-0">
            <VideoSection />
          </div>
        </Suspense>

        {/* Most Popular */}
        <Suspense fallback={<ProductsSectionSkeleton title="Top Products" />}>
          <TopProducts
            regionId={regionId}
            title="Top Products"
            link="/top-products"
          />
        </Suspense>
      </div>
    )
  } catch (err) {
    return notFound()
  }
}
