import { Footer, Header, StickyCartBar, DesktopSidebar } from "@/components/organisms"
import { BottomNavbar, PullToRefresh } from "@/components/molecules"
import { checkRegion } from "@/lib/helpers/check-region"
import { redirect } from "next/navigation"
import { Toaster } from "@/components/ui/toaster"
import { HomePageWrapper } from "@/components/organisms/HomePageWrapper/HomePageWrapper"

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  const regionCheck = await checkRegion(locale)

  if (!regionCheck) {
    return redirect("/")
  }

  return (
    <>
      <HomePageWrapper>
        <Header />
        <div className="!pt-[68px]"></div>
        <PullToRefresh>
          {children}
        </PullToRefresh>
        <Footer />
      </HomePageWrapper>
      <StickyCartBar />
      <BottomNavbar />
      <DesktopSidebar />
      <Toaster />
    </>
  )
}
