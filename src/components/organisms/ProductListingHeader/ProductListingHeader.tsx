"use client"
import { SelectField } from "@/components/molecules"
import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

const selectOptions = [
  { label: "Newest", value: "-created_at" },
  { label: "Date: Newest first", value: "-created_at" },
  { label: "Date: Oldest first", value: "created_at" },
]

export const ProductListingHeader = ({ total }: { total: number }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const selectOptionHandler = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    // set or update 'order'
    params.set("order", value)

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex justify-between w-full items-center">
      <div>{total} listings</div>
      <div className='hidden md:flex gap-2 items-center'>
        Sort by:{' '}
        <SelectField
          className='min-w-[200px]'
          options={selectOptions}
          selectOption={selectOptionHandler}
        />
      </div>
    </div>
  )
}

