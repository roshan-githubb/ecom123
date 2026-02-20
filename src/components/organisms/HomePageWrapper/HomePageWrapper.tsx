"use client"

import { useSwipeToExit } from "@/hooks/useSwipeToExit"
import { SwipeToExitIndicator } from "@/components/molecules/SwipeToExitIndicator/SwipeToExitIndicator"
import { PageTransitionWrapper } from "@/components/organisms/PageTransitionWrapper/PageTransitionWrapper"
import { useFlutterBridge } from "@/hooks/useFlutterBridge"
import { usePathname, useRouter } from "next/navigation"
import { ReactNode } from "react"

interface HomePageWrapperProps {
  children: ReactNode
}

export const HomePageWrapper = ({ children }: HomePageWrapperProps) => {
  const { exitWebView } = useFlutterBridge()
  const pathname = usePathname()
  const router = useRouter()
  
  // Check if we're on homepage
  const isHomePage = pathname === "/np"

  const handleBack = () => {
    router.back()
  }

  const { swipeProgress, isAnimating } = useSwipeToExit({
    onExit: exitWebView,
    onBack: handleBack,
    threshold: 150,
    enabled: true,
    isHomePage,
  })

  return (
    <>
      <SwipeToExitIndicator progress={swipeProgress} isHomePage={isHomePage} />
      <PageTransitionWrapper 
        swipeProgress={swipeProgress}
        isAnimating={isAnimating}
        isHomePage={isHomePage}
      >
        {children}
      </PageTransitionWrapper>
    </>
  )
}
