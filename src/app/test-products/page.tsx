import { ProductListing } from "@/components/sections"

export default async function TestProductsPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Test Product Listing</h1>
      <ProductListing showSidebar={true} />
    </div>
  )
}
