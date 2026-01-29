// usePreviousPath.ts
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

export const usePreviousPath = () => {
  const pathname = usePathname()
  const prev = useRef<string | null>(null)

  useEffect(() => {
    prev.current = pathname
  }, [pathname])

  return prev.current
}
