import { SectionHeader } from "@/components/atoms/SectionHeader/SectionHeader";
import { ItemCategoryCard } from "@/components/cells/CategoryCard/CategoryCard";
import CarouselBanner from "@/components/molecules/BannerCarousel/BannerCarousel";
import { HomeProductCard } from "@/components/molecules/HomeProductCard/HomeProductCard";
import { HorizontalScroller } from "@/components/molecules/HorizontalScroller/HorizontalScrollbar";
import { 
  TopCategoriesSkeleton, 
  BannerSkeleton, 
  CategoriesGridSkeleton, 
  ProductsSectionSkeleton, 
  FlashItemsSkeleton, 
  BrandsSkeleton, 
  VideoSkeleton 
} from "@/components/organisms/HomepageSkeleton/SectionSkeletons";
import FlashItems from "@/components/sections/FlashItems/FlashItems";
import TopProducts from "@/components/sections/TopProducts/TopProducts";
import HeroVideo from "@/components/molecules/VideoComponent/VideoComponent";
import { listProducts } from "@/lib/data/products";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getBanners } from "@/lib/get-banners";
import { sortProductsByInventory } from "@/lib/sortProducts/sortProducts";
import { getProductRatingSummaries } from "@/lib/helpers/rating-helpers";


interface CategoryItemMetadata {
  thumbnail_url: string;
}
interface CategoryItem {
  created_at: string;
  description: string;
  handle: string;
  id: string;
  name: string;
  parent_category_id: number;
  rank: number;
  updated_at: string;
  metadata: CategoryItemMetadata;
}


const brands = [
  { name: "Nike", image: "/images/brands/Nike.png" },
  { name: "Maybeline", image: "/images/brands/Maybeline.png" },
  { name: "Dell", image: "/images/brands/dell.png" },
  { name: "Adidas", image: "/images/brands/adidas.png" },
  { name: "Gucci", image: "/images/brands/gucci.png" },
  { name: "H&M", image: "/images/brands/H&M.png" },
  { name: "Prada", image: "/images/brands/Prada.png" },
  { name: "Philips", image: "/images/brands/Philips.png" },
];

const topSectionProducts = [
  { name: "Flash Sale", image: "/images/home-top-card/flash-sale.png", link: "/flash-sale" },
  { name: "Upto 20% OFF", image: "/images/home-top-card/20-percent-off.png" },
  { name: "New Arrivals", image: "/images/home-top-card/add-cart.png" },
  { name: "Best Sellers", image: "/images/home-top-card/buy-any-three.png" },
];






// Async components for each section
async function CategoriesSection() {
  const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/product-categories`;
  
  const headers = {
    "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
    "Content-Type": "application/json",
  };

  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
    headers,
  });

  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }

  const data = await res.json();
  
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
    </div>
  );
}

async function BannerSection() {
  const bannerCarousel = await getBanners();
  return <CarouselBanner bannerCarousel={bannerCarousel} />;
}

async function RecommendedSection({ locale }: { locale: string }) {
  const {
    response: { products: jsonLdProducts },
  } = await listProducts({
    countryCode: locale,
    queryParams: { limit: 8, order: "created_at" },
  });
  
  const sortedProducts = sortProductsByInventory(jsonLdProducts);
  const productIds = sortedProducts?.map((p: any) => p.id) || [];
  const ratingSummaryMap = await getProductRatingSummaries(productIds);

  return (
    <>
      <SectionHeader title="Recommended for you" actionLabel="See All" link="/recommended" />
      <div className="overflow-x-scroll gap-x-2 mt-2 flex no-scrollbar">
        {sortedProducts.map((r, index) => (
          <div key={r.id} className="w-[180px] flex-shrink-0">
            <HomeProductCard
              api_product={r}
              allProducts={sortedProducts}
              productIndex={index}
              ratingSummary={ratingSummaryMap[r.id]}
            />
          </div>
        ))}
      </div>
    </>
  );
}

async function BestDealsSection({ locale }: { locale: string }) {
  const {
    response: { products: jsonLdProducts },
  } = await listProducts({
    countryCode: locale,
    queryParams: { limit: 8, order: "created_at" },
  });
  
  const sortedProducts = sortProductsByInventory(jsonLdProducts);
  const productIds = sortedProducts?.map((p: any) => p.id) || [];
  const ratingSummaryMap = await getProductRatingSummaries(productIds);

  return (
    <>
      <SectionHeader title="Best Deals" actionLabel="See All" />
      <HorizontalScroller className="no-scrollbar !mt-1">
        {sortedProducts.map((r, index) => (
          <div key={r.id} className="w-[180px] flex-shrink-0">
            <HomeProductCard 
              api_product={r} 
              allProducts={sortedProducts}
              productIndex={index}
              ratingSummary={ratingSummaryMap[r.id]}
            />
          </div>
        ))}
      </HorizontalScroller>
    </>
  );
}


interface Params {
  locale: string;
}

export default async function HomePage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;

  try {
    return (
      <div className="space-y-6 px-4 lg:px-8 py-4">
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
        
        {/* Flash Sale Section */}
        <Suspense fallback={<FlashItemsSkeleton />}>
          <FlashItems locale={locale} />
        </Suspense>

        {/* Recommended for you */}
        <Suspense fallback={<ProductsSectionSkeleton title="Recommended for you" />}>
          <RecommendedSection locale={locale} />
        </Suspense>

        {/* Top brands */}
        <Suspense fallback={<BrandsSkeleton />}>
          <SectionHeader title="Top Brands" actionLabel="See All" />
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
        </Suspense>

        {/* Best deals */}
        <Suspense fallback={<ProductsSectionSkeleton title="Best Deals" />}>
          <BestDealsSection locale={locale} />
        </Suspense>

        {/* Advert video section */}
        <Suspense fallback={<VideoSkeleton />}>
          <HeroVideo videoSrc="/videos/watch-time.mp4" />
        </Suspense>

        {/* Most Popular */}
        <Suspense fallback={<ProductsSectionSkeleton title="Top Products" />}>
          <TopProducts />
        </Suspense>
      </div>
    );
  } catch (err) {
    return notFound();
  }
}
