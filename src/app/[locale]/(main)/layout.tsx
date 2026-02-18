import { Footer, Header, StickyCartBar } from "@/components/organisms"
import { BottomNavbar, PullToRefresh } from "@/components/molecules"
import { checkRegion } from "@/lib/helpers/check-region"
import { redirect } from "next/navigation"
import { Toaster } from "@/components/ui/toaster"

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
      <Header />
      <div className="!pt-[68px]"></div>
      <PullToRefresh>
        {children}
      </PullToRefresh>
      <Footer />
      <StickyCartBar />
      <BottomNavbar />
      <Toaster />
    </>
  )
}
