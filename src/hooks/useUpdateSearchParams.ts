import { useRouter, useSearchParams } from "next/navigation"

type Params = Record<string, string | undefined>

const useUpdateSearchParams = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  /**
   * Update one or multiple query parameters at once.
   * - keyOrObj: either a single key string or an object of key-value pairs
   */
  const update = (keyOrObj: string | Params, value?: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (typeof keyOrObj === "string") {
      // single key
      if (!value) {
        params.delete(keyOrObj)
      } else {
        params.set(keyOrObj, value)
      }
    } else {
      // multiple keys
      Object.entries(keyOrObj).forEach(([k, v]) => {
        if (!v) {
          params.delete(k)
        } else {
          params.set(k, v)
        }
      })
    }

    // Reset page unless updating page itself
    if (
      typeof keyOrObj === "string"
        ? keyOrObj !== "page"
        : !Object.keys(keyOrObj).includes("page")
    ) {
      params.delete("page")
    }

    const query = params.toString()
    router.push(query ? `?${query}` : window.location.pathname, {
      scroll: false,
    })
  }

  return update
}

export default useUpdateSearchParams
