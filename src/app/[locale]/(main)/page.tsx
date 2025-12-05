import { SectionHeader } from "@/components/atoms/SectionHeader/SectionHeader";
import { ItemCategoryCard } from "@/components/cells/CategoryCard/CategoryCard";
import CarouselBanner from "@/components/molecules/BannerCarousel/BannerCarousel";
import { HomeProductCard } from "@/components/molecules/HomeProductCard/HomeProductCard";
import { HorizontalScroller } from "@/components/molecules/HorizontalScroller/HorizontalScrollbar";
import HeroVideo from "@/components/molecules/VideoComponent/VideoComponent";
import HomePageSkeleton from "@/components/organisms/HomepageSkeleton/HomepageSkeleton";
import { listProducts } from "@/lib/data/products";
import { notFound } from "next/navigation";
import { Suspense } from "react";


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


const flashProducts = [
  { id: "p1", image: "/images/product/white-vase.png", title: "White Vase", currentPrice: 3000, oldPrice: 3500, discount: "45% OFF", description: "Stunning white T shirt" },
  { id: "p2", image: "/images/product/white-vase.png", title: "Indoor Plant", currentPrice: 4200, oldPrice: 5200, discount: "20% OFF", description: "Stylish denim jacket" },
];

const brands = [
  { name: "Nike", image: "/images/brands/Nike.png" },
  { name: "Maybeline", image: "/images/brands/Maybeline.png" },
  { name: "Dell", image: "/images/brands/Dell.png" },
  { name: "Adidas", image: "/images/brands/Adidas.png" },
  { name: "Gucci", image: "/images/brands/Gucci.png" },
  { name: "H&M", image: "/images/brands/H&M.png" },
  { name: "Prada", image: "/images/brands/Prada.png" },
  { name: "Philips", image: "/images/brands/Philips.png" },
];

const topSectionProducts = [
  { name: "Flash Sale", image: "/images/home-top-card/flash-sale.png" },
  { name: "Upto 20% OFF", image: "/images/home-top-card/20-percent-off.png" },
  { name: "New Arrivals", image: "/images/home-top-card/add-cart.png" },
  { name: "Best Sellers", image: "/images/home-top-card/buy-any-three.png" },
]

const categories = [
  { category: "Kitchen Essentials", image: "/images/categories/kitchen-essentials.png" },
  { category: "Decor", image: "/images/categories/decor.png" },
  { category: "Lighting Lamps", image: "/images/categories/lighting-lamps.png" },
  { category: "Bags & Wallets", image: "/images/categories/bags-&-wallets.png" },
  { category: "Makeup", image: "/images/categories/makeup.png" },
  { category: "Clothing", image: "/images/categories/clothing.png" },
  { category: "Skincare", image: "/images/categories/skincare.png" },
  { category: "Electronics", image: "/images/categories/electronics.png" },
];



const recommended = new Array(8).fill(0).map((_, i) => ({
  id: String(i),
  image: "/images/product/cotton-Tshirt.jpg",
  title: `Product ${i + 1}`,
  currentPrice: 2000 + i * 100,
  oldPrice: 2400 + i * 120,
  discount: i % 2 === 0 ? "10% OFF" : "25% OFF",
  description: "Short description",
}));


interface Params {
  locale: string;
}


export default async function HomePage({ params }: { params: Params }) {
  const { locale } = await params;
  const {
    response: { products: jsonLdProducts },
  } = await listProducts({
    countryCode: locale,
    queryParams: { limit: 8, order: "created_at" },
  })

  const itemList = jsonLdProducts.slice(0, 8).map((p, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    url: `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/${locale}/products/${p.handle}`,
    name: p.title,
  }))

  // console.log("item list and origianl list ", itemList, jsonLdProducts)
  const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/product-categories`;

  try {
    const headers = {
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
      "Content-Type": "application/json",
    };

    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers,
    });



    // Log the exact error body from Medusa (super useful!)
    if (!res.ok) {
      const errorText = await res.text();

      return notFound();
    }

    const data = await res.json();
    // console.log("Full categories response from Medusa:", data.product_categories);

    return (
      <Suspense fallback={<HomePageSkeleton />}>
        <div className="space-y-6 px-4 lg:px-8 py-4 ">
          {/* Top horizontal category scroller (item category cards) with visible arrows */}
          <HorizontalScroller >
            {topSectionProducts.map((c: any) => (
              <div key={c.name} className=" flex-shrink-0">
                <ItemCategoryCard imageUrl={c?.image || "/product-placeholder.png"} label={c.name} shape="rounded" height={80} width={80} link="/coming-soon" />
              </div>
            ))}
          </HorizontalScroller>



          {/* Large banner carousel */}
          <div className="pt-0">
            {/* <CarouselBanner slides={bannerSlides} /> */}
            <CarouselBanner
              bannerCarousel={[
                { image: "/images/banner-section/banner.png", link: "/coming-soon" },
                { image: "/images/banner-section/sale-banner-1.avif", link: "/coming-soon" },
                { image: "/images/banner-section/sale-banner.webp", link: "/coming-soon" },
              ]}
            />
          </div>

          {/* Circular categories (grid) */}
          {/* <SectionHeader title="Categories" actionLabel="See All"  /> */}
          {/* <div className="grid grid-cols-4 gap-4">
          {categories.map((item: any) => (
            <ItemCategoryCard key={item?.category} imageUrl={item.image || "/images/not-available/not-available.png"} label={item?.category} shape="circle" height={70} width={70} />
          ))}
        </div> */}
          {/* <HorizontalScroller > */}
          <div className="grid grid-cols-4 gap-4">
            {data.product_categories.slice(0, 8).map((c: CategoryItem) => (
              <div key={c.id} className=" flex-shrink-0">
                <ItemCategoryCard imageUrl={c?.metadata?.thumbnail_url || "/product-placeholder.png"} label={c.name} shape="circle" height={70} width={70} link={`/categories/${c?.handle}`} />
              </div>
            ))}
          </div>
          {/* </HorizontalScroller> */}
          {/* Flash Sale section (dark blue header) */}
          <div>
            {/* <div className="flex items-center justify-between ">
            <h2 className="text-[20px] font-medium" style={{ color: "#32425A" }}>Flash Sale</h2>
            <button
              onClick={() => router.push("/coming-soon")}
              className="text-[14px] font-medium"
              style={{ color: "#144293" }}
            >
              See All
            </button>
          </div> */}
            <SectionHeader title="Flash sale" actionLabel="See All" />


            <div className="my-2"></div>
            {/* two cards side-by-side */}
            {/* <div className="grid grid-cols-2 gap-4 gap-x-2 mt-3"> */}
            <div className="overflow-x-scroll gap-x-2 flex no-scrollbar">
              {jsonLdProducts.map((r) => (
                <div key={r.id} className="w-[180px] flex-shrink-0 ">
                  <HomeProductCard
                    api_product={r}
                    hasOfferSticker={true}
                  />

                  {/* <HomeProductCard id={r?.id} imageUrl={r?.thumbnail ?? "/images/product-placeholder.png"} title={r?.title ?? ""} currentPrice={r?.variants?.[0]?.calculated_price?.calculated_amount ?? 0} description={r?.description ?? ""} /> */}
                </div>
              ))}
            </div>
          </div>

          {/* Recommended for you — horizontal, hidden scrollbar */}
          <SectionHeader title="Recommended for you" actionLabel="See All" link="/recommended" />
          <div className="overflow-x-scroll gap-x-2 mt-2 flex no-scrollbar">
            {jsonLdProducts.map((r) => (
              <div key={r.id} className="w-[180px] flex-shrink-0 ">
                <HomeProductCard
                  api_product={r}
                // hasOfferSticker={true}
                />

                {/* <HomeProductCard id={r?.id} imageUrl={r?.thumbnail ?? "/images/product-placeholder.png"} title={r?.title ?? ""} currentPrice={r?.variants?.[0]?.calculated_price?.calculated_amount ?? 0} description={r?.description ?? ""} /> */}
              </div>
            ))}
          </div>

          {/* Top brands (use item category card circular) */}
          <SectionHeader title="Top Brands" actionLabel="See All" />
          <div className="grid grid-cols-4 gap-4">
            <>
              {brands.map((brand: any) => (
                // <div>
                <ItemCategoryCard key={brand?.name} imageUrl={brand?.image || "/images/not-available/not-available.png"} label={brand?.name} shape="circle" height={70} width={70} link="/coming-soon" />
                // </div>
              ))}</>
          </div>

          {/* Best deals */}
          <SectionHeader title="Best Deals" actionLabel="See All" />
          <HorizontalScroller className="no-scrollbar !mt-1">
            {jsonLdProducts.map((r) => (
              <div key={r.id} className="w-[180px] flex-shrink-0">
                <HomeProductCard api_product={r} />

                {/* <HomeProductCard id={r?.id} imageUrl={r?.thumbnail ?? "/images/product-placeholder.png"} title={r?.title ?? ""} currentPrice={r?.variants?.[0]?.calculated_price?.calculated_amount ?? 0} description={r?.description ?? ""} /> */}
              </div>
            ))}
          </HorizontalScroller>

          {/* Advert video section */}
          <HeroVideo videoSrc="/videos/watch-time.mp4" />

          {/* Most Popular */}
          <SectionHeader title="Most Popular" actionLabel="See All" />
          <HorizontalScroller className="no-scrollbar !mt-1">
            {jsonLdProducts.map((r) => (
              <div key={r.id} className="w-[180px] flex-shrink-0">
                <HomeProductCard api_product={r} />

                {/* <HomeProductCard id={r?.id} imageUrl={r?.thumbnail ?? "/images/product-placeholder.png"} title={r?.title ?? ""} currentPrice={r?.variants?.[0]?.calculated_price?.calculated_amount ?? 0} description={r?.description ?? ""} /> */}
              </div>
            ))}
          </HorizontalScroller>
        </div >
      </Suspense>

    );

    // return <ProductDetailClient product={product} />;
  } catch (err) {

    return notFound();
  }

}
