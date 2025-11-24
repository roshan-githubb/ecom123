
import { SectionHeader } from "@/components/atoms/SectionHeader/SectionHeader";
import { ItemCategoryCard } from "@/components/cells/CategoryCard/CategoryCard";
import CarouselBanner from "@/components/molecules/BannerCarousel/BannerCarousel";
import { HomeProductCard } from "@/components/molecules/HomeProductCard/HomeProductCard";
import { HorizontalScroller } from "@/components/molecules/HorizontalScroller/HorizontalScrollbar";


export default function HomePage() {
  const categoryItems = new Array(8).fill(0).map((_, i) => ({
    id: String(i),
    image: "/images/product/cotton-Tshirt.jpg",
    label: ["Flash sale", "Home", "Kitchen", "Lighting", "Lamps", "Decor", "Essentials", "Gadgets"][i % 8],
  }));

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

  return (
    <div className="space-y-6 px-4 lg:px-8 py-4">
      {/* Top horizontal category scroller (item category cards) with visible arrows */}
      <HorizontalScroller >
        {categoryItems.map((c) => (
          <div key={c.id} className=" flex-shrink-0">
            <ItemCategoryCard imageUrl={c.image} label={c.label} shape="rounded" height={100} width={100} />
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
        {categoryItems.map((c) => (
          <ItemCategoryCard key={c.id} imageUrl={c.image} label={c.label} shape="circle" />
        ))}
      </div>

      {/* Flash Sale section (dark blue header) */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-medium" style={{ color: "#32425A" }}>Flash Sale</h2>
          <button className="text-[14px] font-medium" style={{ color: "#144293" }}>See all</button>
        </div>

        {/* two cards side-by-side */}
        <div className="grid grid-cols-2 gap-4 gap-x-2 mt-3">
          {flashProducts.map((p) => (
            <HomeProductCard
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
        {recommended.map((r) => (
          <div key={r.id} className="flex-shrink-0">
            {/* <HomeProductCard {...r} /> */}
            <HomeProductCard imageUrl="/images/product/cotton-Tshirt.jpg" title="Classic T shirt" currentPrice={3000} oldPrice={3500} description="Stunning white T shirt with modern flair" discount="45% OFF" />
          </div>
        ))}
      </div>

      {/* Top brands (use item category card circular) */}
      <SectionHeader title="Top Brands" actionLabel="See all" />
      <HorizontalScroller className="no-scrollbar">
        {categoryItems.map((c) => (
          <div key={c.id} className="w-[100px] flex-shrink-0">
            <ItemCategoryCard imageUrl={c.image} label={c.label} shape="circle" />
          </div>
        ))}
      </HorizontalScroller>

      {/* Best deals */}
      <SectionHeader title="Best Deals" actionLabel="See all" />
      <HorizontalScroller className="no-scrollbar">
        {recommended.map((r) => (
          <div key={r.id} className="w-[180px] flex-shrink-0">
            {/* <HomeProductCard {...r} /> */}
            <HomeProductCard imageUrl="/images/product/cotton-Tshirt.jpg" title="Classic T shirt" currentPrice={3000} oldPrice={3500} description="Stunning white T shirt with modern flair" discount="45% OFF" />
          </div>
        ))}
      </HorizontalScroller>

      {/* Most Popular */}
      <SectionHeader title="Most Popular" actionLabel="See all" />
      <HorizontalScroller className="no-scrollbar">
        {recommended.map((r) => (
          <div key={r.id} className="w-[180px] flex-shrink-0">
            {/* <HomeProductCard {...r} /> */}
            <HomeProductCard imageUrl="/images/product/cotton-Tshirt.jpg" title="Classic T shirt" currentPrice={3000} oldPrice={3500} description="Stunning white T shirt with modern flair" discount="45% OFF" />
          </div>
        ))}
      </HorizontalScroller>
    </div>
  );
}
