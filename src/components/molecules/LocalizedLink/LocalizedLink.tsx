"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import React, { MouseEventHandler, useEffect, useState } from "react"

/**
 * Use this component to create a Next.js `<LocalizedClientLink />` that persists the current country code in the url,
 * without having to explicitly pass it as a prop.
 */
const LocalizedClientLink = ({
  children,
  href,
  ...props
}: {
  children?: React.ReactNode
  href: string
  className?: string
  onClick?: MouseEventHandler<HTMLAnchorElement> | undefined
  passHref?: true
  [x: string]: any
}) => {
  const [mounted, setMounted] = useState(false)
  const params = useParams()
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // During SSR or before mount, use fallback
  if (!mounted) {
    return (
      <Link href={`/en${href}`} {...props}>
        {children}
      </Link>
    )
  }

  const locale = params?.locale || 'en' 

  return (
    <Link href={`/${locale}${href}`} {...props}>
      {children}
    </Link>
  )
}

export default LocalizedClientLink
