'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { logPageView } from '@/lib/firebase/analytics'

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname) {
      console.log('Tracking page view:', pathname)
      logPageView(pathname, document.title)
    }
  }, [pathname])

  return <>{children}</>
}
