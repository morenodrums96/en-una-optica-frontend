'use client'

import { usePathname } from 'next/navigation'
import { Geist, Geist_Mono } from 'next/font/google'
import '@/app/globals.css'
import ThemeWrapper from '@/components/ThemeWrapper'
import HeaderPublic from '@/components/headers/HeaderPublic'
import Footer from '@/components/CustomerFooter/Footer'
import TopMarquee from '@/components/TopMarquee'
import AuthSlider from '@/components/AuthSlider' // 👈 Importa el slider
import { WishlistProvider } from '@/context/WishlistContext'
import { CartProvider } from '@/context/CartContext'
import { AuthSliderProvider } from '@/context/AuthSliderContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/admin') || pathname === '/enUnaOpticaLogin'

  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <AuthSliderProvider>
          <WishlistProvider>
            <CartProvider>
              <ThemeWrapper>
                {!isAuthPage && <TopMarquee />}
                {!isAuthPage && <HeaderPublic />}
                <main className={`${!isAuthPage ? 'pt-[100px]' : ''}`}>
                  {children}
                </main>
                {!isAuthPage && <Footer />}
                <AuthSlider /> {/* 👈 Aquí se monta el slider */}
              </ThemeWrapper>
            </CartProvider>
          </WishlistProvider>
        </AuthSliderProvider>
      </body>
    </html>
  )
}
