import { HttpTypes } from "@medusajs/types"

import { Navbar } from "@/components/cells"
import { listCategories } from "@/lib/data/categories"
import { PARENT_CATEGORIES } from "@/const"


export const Header = async () => {

  const { categories, parentCategories } = (await listCategories({
    headingCategories: PARENT_CATEGORIES,
  })) as {
    categories: HttpTypes.StoreProductCategory[]
    parentCategories: HttpTypes.StoreProductCategory[]
  }

  // console.log("categories and parentcategories ", categories, parentCategories)

  return (
    <header className="fixed w-full z-50">
      
      <Navbar categories={categories} parentCategories={parentCategories} />
    </header>
  )
}
