

import isBot from "@/lib/helpers/isBot"
import { headers } from "next/headers"
import Script from "next/script"
import { listCategories } from "@/lib/data/categories"
import { PARENT_CATEGORIES } from "@/const"
import { HttpTypes } from "@medusajs/types"
import { CategoriesSection } from "@/components/cells/CategoriesSection/CategoriesSection"



async function AllCategories({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const ua = (await headers()).get("user-agent") || ""
  const bot = isBot(ua)

  const { categories, parentCategories } = (await listCategories({
    headingCategories: PARENT_CATEGORIES,
  })) as {
    categories: HttpTypes.StoreProductCategory[]
    parentCategories: HttpTypes.StoreProductCategory[]
  }

  console.log("categoires list page categories and parentcategories ", categories, parentCategories)


  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "https"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`


  return (
    <main className="container">
      <Script
        id="ld-breadcrumbs-categories"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "All Products",
                item: `${baseUrl}/${locale}/categories`,
              },
            ],
          }),
        }}
      />
<div className="my-3"></div>
      <h1 className="heading-md uppercase">Browse Categories</h1>
      <div className="my-6"></div>
      <CategoriesSection categories={categories}  />
    </main>
  )
}

export default AllCategories
