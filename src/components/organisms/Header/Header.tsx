import { HttpTypes } from "@medusajs/types"

import { Navbar } from "@/components/cells"
import { listHierarchicalCategories } from "@/lib/data/categories"


export const Header = async () => {

  const hierarchicalCategories = await listHierarchicalCategories()

  return (
    <header className="fixed w-full z-50">
      
      <Navbar hierarchicalCategories={hierarchicalCategories} />
    </header>
  )
}
