'use client'
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function HorizontalScroller({
  children,
  className = "",
  showArrows = false,
  step = 300,
}: {
  children: React.ReactNode;
  className?: string;
  showArrows?: boolean;
  step?: number;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollBy({ left: dir === "right" ? step : -step, behavior: "smooth" });
  };

  return (
    <div className={`relative ${className}`}>
      {showArrows && (
        <button
          aria-label="scroll left"
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 dark:bg-black/60 p-1 rounded-full shadow-sm"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </button>
      )}

      <div
        ref={scrollerRef}
        className="check flex gap-2 overflow-x-auto pr-4  scroll-smooth no-scrollbar"
      >
        {children}
      </div>

      {showArrows && (
        <button
          aria-label="scroll right"
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 dark:bg-black/60 p-1 rounded-full shadow-sm"
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </button>
      )}
    </div>
  );
}
