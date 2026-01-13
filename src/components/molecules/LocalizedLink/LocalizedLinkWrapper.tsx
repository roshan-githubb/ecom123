"use client"

import { Suspense } from "react"
import LocalizedClientLink from "./LocalizedLink"

interface LocalizedLinkWrapperProps {
  children?: React.ReactNode
  href: string
  className?: string
  onClick?: React.MouseEventHandler<HTMLAnchorElement> | undefined
  passHref?: true
  [x: string]: any
}

const LocalizedLinkFallback = ({ children, href, ...props }: LocalizedLinkWrapperProps) => (
  <a href={`/en${href}`} {...props}>
    {children}
  </a>
)

export default function LocalizedLinkWrapper(props: LocalizedLinkWrapperProps) {
  return (
    <Suspense fallback={<LocalizedLinkFallback {...props} />}>
      <LocalizedClientLink {...props} />
    </Suspense>
  )
}