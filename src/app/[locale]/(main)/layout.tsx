import { Footer, Header, StickyCartBar } from "@/components/organisms"
import { BottomNavbar } from "@/components/molecules"
import { retrieveCustomer } from "@/lib/data/customer"
import { Session } from "@talkjs/react"
import { Toaster } from "@/components/ui/toaster"

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const APP_ID = process.env.NEXT_PUBLIC_TALKJS_APP_ID
  const { locale } = await params

  const user = await retrieveCustomer()

  if (!APP_ID || !user)
    return (
      <>
        <Header />
        <div className="!pt-[68px]"></div>
        {children}
        <Footer />
        <StickyCartBar />
        <BottomNavbar />
        <Toaster />
      </>
    )

  return (
    <>
      <Session appId={APP_ID} userId={user.id}>
        <Header />
        <div className="!pt-[68px]"></div>
        {children}
        <Footer />
        <StickyCartBar />
        <BottomNavbar />
        <Toaster />
      </Session>
    </>
  )
}
