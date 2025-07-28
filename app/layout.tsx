'use client'

import { usePathname } from 'next/navigation'
import '@/app/globals.css'
import ThemeWrapper from '@/components/ThemeWrapper'
import HeaderPublic from '@/components/headers/HeaderPublic'
import Footer from '@/components/CustomerFooter/Footer'
import TopMarquee from '@/components/TopMarquee'
import AuthSlider from '@/components/AuthSlider'

import { WishlistProvider } from '@/context/WishlistContext'
import { CartProvider } from '@/context/CartContext'
import { AuthSliderProvider } from '@/context/AuthSliderContext'
import { ProductsRefreshProvider } from '@/context/ProductsRefreshContext'

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/reactQueryClient/reactQueryClient'

import { Toaster } from 'sonner'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/admin') || pathname === '/enUnaOpticaLogin'

  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <QueryClientProvider client={queryClient}>
          <ProductsRefreshProvider>
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
                    <AuthSlider />
                  </ThemeWrapper>

                  {/* ✅ TOASTER: visible en toda la app para mostrar mensajes */}
                  <Toaster richColors position="top-center" />
                </CartProvider>
              </WishlistProvider>
            </AuthSliderProvider>
          </ProductsRefreshProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
