import { useRouter, useSearchParams } from "next/navigation"

const useUpdateSearchParams = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  return (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (!value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    if (key !== "page") {
      params.delete("page")
    }

    const query = params.toString()
    router.push(
      query ? `?${query}` : window.location.pathname,
      { scroll: false }
    )
  }
}

export default useUpdateSearchParams
