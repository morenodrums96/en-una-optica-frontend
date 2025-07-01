'use client'

import { usePathname } from 'next/navigation'
import { Geist, Geist_Mono } from 'next/font/google'
import '@/app/globals.css'
import ThemeWrapper from '@/components/ThemeWrapper'
import HeaderPublic from '@/components/headers/HeaderPublic'
import Footer from '@/components/CustomerFooter/Footer'
import TopMarquee from '@/components/TopMarquee'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/admin') || pathname === '/enUnaOpticaLogin'
  const isLandingPage = pathname === '/'

  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeWrapper>
          {!isAuthPage && <TopMarquee/>}

          {!isAuthPage && <HeaderPublic />}
          <main className={`${!isAuthPage ? 'pt-[100px]' : ''}`}>
            {children}
          </main>
          {!isAuthPage && <Footer />}
        </ThemeWrapper>
      </body>
    </html>
  )
}
