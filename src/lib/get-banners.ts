"use server";

export async function getBanners() {
  const bannerRes = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/banners?placement=homepage_carousel`,
    {
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
      },
      cache: "no-store",
    }
  );

  const bannerJson = await bannerRes.json();

  return bannerJson.banners.map((b: { id: any; image_url: any; mobile_image_url: any; cta_link: any; }) => ({
    id: b.id,
    image: b.image_url,
    mobileImage: b.mobile_image_url,
    link: b.cta_link || "/",
  }));
}
