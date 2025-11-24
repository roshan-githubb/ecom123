'use client'
export function SectionHeader({
  title,
  actionLabel,
//   onClickAction,
  titleSize = "text-[20px]",
  actionSize = "text-[14px]",
  titleColor = "#32425A",
  actionColor = "#144293",
}: {
  title: string;
  actionLabel?: string;
//   onClickAction?: () => void;
  titleSize?: string;
  actionSize?: string;
  titleColor?: string;
  actionColor?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-1">
      <h3 className={`${titleSize} font-medium`} style={{ color: titleColor }}>
        {title}
      </h3>
      {actionLabel && (
        <button onClick={()=> {}} className={`${actionSize} font-medium`} style={{ color: actionColor }}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
