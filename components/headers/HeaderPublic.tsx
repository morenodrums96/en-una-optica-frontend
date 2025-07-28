'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Truck } from 'lucide-react'
import Image from 'next/image'
import logoLends from '@/components/icons/logoLends.svg'
import logoLends600 from '@/components/icons/logoLends600.svg'

import { useWishlist } from '@/context/WishlistContext'
import { useCart } from '@/context/CartContext'
import { useAuthSlider } from '@/context/AuthSliderContext'

interface Props {
  animated?: boolean
}

export default function HeaderPublic({ animated = true }: Props) {
  const headerRef = useRef<HTMLElement>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { wishlist } = useWishlist()
  const { cartItems } = useCart()
  const { openSlider } = useAuthSlider()

  useEffect(() => {
    if (!animated || !headerRef.current) return
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [animated])

  return (
    <>
      <header
        ref={headerRef}
        id="header-public"
        className={`
          fixed top-8 left-1/2 transform -translate-x-1/2 z-[1000]
          transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]
          py-4 w-full flex items-center justify-center
          ${isScrolled
            ? 'bg-white shadow-md rounded-full px-4 max-w-6xl'
            : 'bg-transparent border-b border-gray-300 px-6 max-w-[100vw]'}
        `}
      >
        <div className="flex items-center justify-between w-full max-w-8xl-mid mx-auto animate-slide-down ">
          {/* Logo */}
          <Link href="/">
            <span className="font-[Inkcorrode] text-3xl sm:text-4xl tracking-wide text-primary-900">
              <span className="text-primary-500">E</span>
              <span className="text-primary-900">n</span>
              <span className="text-primary-500">U</span>
              <span className="text-primary-900">na</span>
              <span className="text-primary-500">Ó</span>
              <span className="text-primary-900">ptica</span>
            </span>
          </Link>

          {/* Menú Desktop */}
          <nav className="hidden md:flex space-x-8 text-[#254C54] text-lg font-medium">
            <Link href="/products">Productos</Link>
            <Link href="#nosotros">Nosotros</Link>
            <Link href="#contacto">Contacto</Link>
          </nav>

          <div className="flex items-center space-x-4 text-primary-800 ">
            <Link href="/wishlist" className="relative group w-10 h-10">
              <Image
                src={logoLends}
                alt="Me gusta"
                fill
                className="object-contain opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-110 transition-all duration-300 ease-in-out"
              />
              <Image
                src={logoLends600}
                alt="Me gusta hover"
                fill
                className="object-contain opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 ease-in-out"
              />

              {wishlist.length > 0 && (
                <span
                  className="absolute bg-primary-400 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold shadow"
                  style={{ top: '0px', left: '33px' }}
                >
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Carrito */}
            <Link href="/car" className="relative hover:text-primary-600">
              <ShoppingCartIcon className="w-7 h-7 transition-transform hover:scale-110 " />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-400 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold shadow">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* Rastreo */}
            <Link href="/tracker" className="hover:text-primary-600">
              <Truck className="h-7 w-7 transition-transform hover:scale-110" />
            </Link>

            {/* Usuario */}
            <button onClick={openSlider} className="hover:text-primary-600">
              <UserIcon className="h-7 w-7 transition-transform hover:scale-110" />
            </button>

            {/* Menú hamburguesa móvil */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-7 w-7" />
              ) : (
                <Bars3Icon className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[999] bg-white shadow-md pt-24 px-6 md:hidden">
          <nav className="flex flex-col space-y-6 text-lg text-[#254C54] font-semibold">
            <Link href="/products" onClick={() => setMobileMenuOpen(false)}>Productos</Link>
            <Link href="#nosotros" onClick={() => setMobileMenuOpen(false)}>Nosotros</Link>
            <Link href="#contacto" onClick={() => setMobileMenuOpen(false)}>Contacto</Link>
            <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)}>Favoritos</Link>
            <Link href="/car" onClick={() => setMobileMenuOpen(false)}>Carrito</Link>
            <Link href="/tracker" onClick={() => setMobileMenuOpen(false)}>Rastrear pedido</Link>
            <button onClick={() => { openSlider(); setMobileMenuOpen(false) }} className="text-left">Mi cuenta</button>
          </nav>
        </div>
      )}
    </>
  )
}
