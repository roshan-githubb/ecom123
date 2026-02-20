"use client"

interface SwipeToExitIndicatorProps {
  progress: number
  isHomePage?: boolean
}

export const SwipeToExitIndicator = ({ progress, isHomePage = false }: SwipeToExitIndicatorProps) => {
  if (progress === 0) return null

  return (
    <div
      className="fixed top-0 left-0 h-full w-1 bg-gradient-to-r from-white/50 to-transparent pointer-events-none z-50 transition-opacity"
      style={{
        opacity: progress,
        width: `${Math.min(progress * 100, 20)}px`,
      }}
    >
      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-2xl">
        {isHomePage ? "✕" : "←"}
      </div>
    </div>
  )
}
