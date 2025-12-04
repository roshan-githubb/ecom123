'use client'

import { useRouter } from "next/navigation";

export function SectionHeader({
  title,
  actionLabel,
  //   onClickAction,
  titleSize = "text-[20px]",
  actionSize = "text-[14px]",
  titleColor = "#32425A",
  actionColor = "#144293",
  link,
}: {
  title: string;
  actionLabel?: string;
  //   onClickAction?: () => void;
  titleSize?: string;
  actionSize?: string;
  titleColor?: string;
  actionColor?: string;
  link?: string;
}) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between mb-1">
      <h3 className={`${titleSize} font-medium`} style={{ color: titleColor }}>
        {title}
      </h3>
      {actionLabel && (
        <button
          onClick={() => router.push(link?? "/coming-soon")}
          className={`${actionSize} font-medium`}
          style={{ color: actionColor }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
