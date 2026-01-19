'use client'

import Link from "next/link";
import { useParams } from "next/navigation";

export function SectionHeader({
  title,
  actionLabel,
  titleSize = "text-[20px]",
  actionSize = "text-[14px]",
  titleColor = "#32425A",
  actionColor = "#144293",
  link,
  locale: providedLocale,
}: {
  title: string;
  actionLabel?: string;
  titleSize?: string;
  actionSize?: string;
  titleColor?: string;
  actionColor?: string;
  link?: string;
  locale?: string;
}) {
  const params = useParams();

  const locale = providedLocale || params?.locale || 'en';
  const href = link ? `/${locale}${link}` : `/${locale}/coming-soon`;

  return (
    <div className="flex items-center justify-between mb-1">
      <h3 className={`${titleSize} font-medium`} style={{ color: titleColor }}>
        {title}
      </h3>
      {actionLabel && (
        <Link
          href={href}
          className={`${actionSize} font-medium transition-opacity hover:opacity-70 active:opacity-50`}
          style={{ color: actionColor }}
          prefetch={true}
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
