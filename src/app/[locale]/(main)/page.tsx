
import { SectionHeader } from "@/components/atoms/SectionHeader/SectionHeader";
import { ItemCategoryCard } from "@/components/cells/CategoryCard/CategoryCard";
import CarouselBanner from "@/components/molecules/BannerCarousel/BannerCarousel";
import { HomeProductCard } from "@/components/molecules/HomeProductCard/HomeProductCard";
import { HorizontalScroller } from "@/components/molecules/HorizontalScroller/HorizontalScrollbar";
import { listProducts } from "@/lib/data/products";
import { notFound } from "next/navigation";
import { number, string } from "zod";


interface CategoryItem {
  created_at: string;
  description: string;
  handle: string;
  id: string;
  name: string;
  parent_category_id: number;
  rank: number;
  updated_at: string;
}

const bannerSlides = [
  { id: "b1", image: "/images/banner-section/sale-banner.webp" },
  { id: "b2", image: "/images/banner-section/sale-banner-1.avif" },
  { id: "b3", image: "/images/banner-section/sale-banner.webp" },
];

const flashProducts = [
  { id: "p1", image: "/images/product/cotton-Tshirt.jpg", title: "Classic T shirt", currentPrice: 3000, oldPrice: 3500, discount: "45% OFF", description: "Stunning white T shirt" },
  { id: "p2", image: "/images/product/cotton-Tshirt.jpg", title: "Denim Jacket", currentPrice: 4200, oldPrice: 5200, discount: "20% OFF", description: "Stylish denim jacket" },
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

  console.log("item list and origianl list ", itemList, jsonLdProducts)
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
      <div className="space-y-6 px-4 lg:px-8 py-4">
        {/* Top horizontal category scroller (item category cards) with visible arrows */}
        <HorizontalScroller >
          {data.product_categories.map((c: CategoryItem) => (
            <div key={c.id} className=" flex-shrink-0">
              <ItemCategoryCard imageUrl={"/images/product/cotton-Tshirt.jpg"} label={c.name} shape="rounded" height={100} width={100} />
            </div>
          ))}
        </HorizontalScroller>

        {/* Large banner carousel */}
        <div className="pt-2">
          {/* <CarouselBanner slides={bannerSlides} /> */}
          <CarouselBanner
            images={[
              "/images/banner-section/sale-banner.webp",
              "/images/banner-section/sale-banner-1.avif",
              "/images/banner-section/sale-banner.webp",
            ]}
          />

        </div>

        {/* Circular categories (grid) */}
        {/* <SectionHeader title="Categories" actionLabel="See all"  /> */}
        <div className="grid grid-cols-4 gap-4">
          {data.product_categories.map((c: CategoryItem) => (
            <ItemCategoryCard key={c.id} imageUrl={"/images/product/cotton-Tshirt.jpg"} label={c.name} shape="circle" />
          ))}
        </div>
        {/* Flash Sale section (dark blue header) */}
        <div>
          <div className="flex items-center justify-between ">
            <h2 className="text-[20px] font-medium" style={{ color: "#32425A" }}>Flash Sale</h2>
            <button className="text-[14px] font-medium" style={{ color: "#144293" }}>See all</button>
          </div>

          <div className="my-5"></div>
          {/* two cards side-by-side */}
          {/* <div className="grid grid-cols-2 gap-4 gap-x-2 mt-3"> */}
          <div className="overflow-x-scroll gap-x-2 flex no-scrollbar">
            {flashProducts.map((p) => (
              <HomeProductCard
                id={p?.id}
                key={p.id}
                imageUrl={p.image}
                title={p.title}
                currentPrice={p.currentPrice}
                oldPrice={p.oldPrice}
                discount={p.discount}
                description={p.description}
              />
            ))}
          </div>
        </div>

        {/* Recommended for you — horizontal, hidden scrollbar */}
        <SectionHeader title="Recommended for you" actionLabel="See all" />
        <div className="overflow-x-scroll gap-x-2 flex no-scrollbar">
          {jsonLdProducts.map((r) => (
            <div key={r.id} className="w-[180px] flex-shrink-0">

              <HomeProductCard id={r?.id} imageUrl={r?.thumbnail ?? "/images/product-placeholder.png"} title={r?.title ?? ""} currentPrice={r?.variants?.[0]?.calculated_price?.calculated_amount ?? 0} description={r?.description ?? ""} />
            </div>
          ))}
        </div>

        {/* Top brands (use item category card circular) */}
        <SectionHeader title="Top Brands" actionLabel="See all" />
        <HorizontalScroller className="no-scrollbar">
          {data.product_categories.map((c: CategoryItem) => (
            <div key={c.id} className="w-[100px] flex-shrink-0">
              <ItemCategoryCard imageUrl={"/images/product/cotton-Tshirt.jpg"} label={c.name} shape="circle" />
            </div>
          ))}
        </HorizontalScroller>

        {/* Best deals */}
        <SectionHeader title="Best Deals" actionLabel="See all" />
        <HorizontalScroller className="no-scrollbar">
          {jsonLdProducts.map((r) => (
            <div key={r.id} className="w-[180px] flex-shrink-0">

              <HomeProductCard id={r?.id} imageUrl={r?.thumbnail ?? "/images/product-placeholder.png"} title={r?.title ?? ""} currentPrice={r?.variants?.[0]?.calculated_price?.calculated_amount ?? 0} description={r?.description ?? ""} />
            </div>
          ))}
        </HorizontalScroller>

        {/* Most Popular */}
        <SectionHeader title="Most Popular" actionLabel="See all" />
        <HorizontalScroller className="no-scrollbar">
          {jsonLdProducts.map((r) => (
            <div key={r.id} className="w-[180px] flex-shrink-0">

              <HomeProductCard id={r?.id} imageUrl={r?.thumbnail ?? "/images/product-placeholder.png"} title={r?.title ?? ""} currentPrice={r?.variants?.[0]?.calculated_price?.calculated_amount ?? 0} description={r?.description ?? ""} />
            </div>
          ))}
        </HorizontalScroller>
      </div>
    );

    // return <ProductDetailClient product={product} />;
  } catch (err) {

    return notFound();
  }








}
