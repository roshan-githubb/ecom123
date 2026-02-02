"use client"

import Link from "next/link"

export function SectionHeader({
  title,
  actionLabel,
  titleSize = "text-[20px]",
  actionSize = "text-[14px]",
  link,
  locale = "np",
}: {
  title: string
  actionLabel?: string
  titleSize?: string
  actionSize?: string
  link?: string
  locale?: string
}) {
  const href = link ? `/${locale}/${link}` : `/${locale}/coming-soon`

  return (
    <div className="flex items-center justify-between mb-1">
      <h3 className={`${titleSize} font-medium text-myBlue`}>
        {title}
      </h3>

      {actionLabel && (
        <Link
          href={href}
          className={`${actionSize} font-medium text-myBlue hover:opacity-70`}
          prefetch
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
