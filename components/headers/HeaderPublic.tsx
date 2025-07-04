'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline'
import { Truck } from 'lucide-react'
import Image from 'next/image'
import logoLends from '@/components/icons/logoLends.svg'
import { useWishlist } from '@/hooks/useWishlist'
import { useCart } from '@/context/CartContext'
import { useAuthSlider } from '@/context/AuthSliderContext'

interface Props {
  animated?: boolean
}

// ... (imports y otros hooks)

export default function HeaderPublic({ animated = true }: Props) {
  const headerRef = useRef<HTMLElement>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const { wishlist } = useWishlist()
  const { cartItems } = useCart()
  const { openSlider } = useAuthSlider()

  useEffect(() => {
    if (!animated || !headerRef.current) return

    const handleScroll = () => {
      const scrolled = window.scrollY > 50
      setIsScrolled(scrolled)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [animated])


  return (
    <header
      ref={headerRef}
      id="header-public"
      className={`
    fixed top-8 left-1/2 transform -translate-x-1/2 z-[1000]
    transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]
    py-4 w-full flex items-center justify-center
    ${isScrolled
          ? 'bg-white shadow-md rounded-full px-10 max-w-6xl'
          : 'bg-transparent border-b border-gray-300 px-6 max-w-[100vw]'}
  `}
    >
      <div className="flex items-center justify-between w-full max-w-8xl-mid mx-auto animate-slide-down">
        {/* Logo */}
        <Link href="/">
          <span className="font-[Inkcorrode] text-4xl tracking-wide text-primary-900">
            <span className="text-primary-500">E</span>
            <span className="text-primary-900">n</span>
            <span className="text-primary-500">U</span>
            <span className="text-primary-900">na</span>
            <span className="text-primary-500">Ó</span>
            <span className="text-primary-900">ptica</span>
          </span>
        </Link>

        {/* Menú */}
        <nav className="hidden md:flex space-x-8 text-[#254C54] text-lg font-medium">
          <Link href="/products">Productos</Link>
          <Link href="#nosotros">Nosotros</Link>
          <Link href="#contacto">Contacto</Link>
        </nav>

        {/* Íconos */}
        <div className="flex items-center space-x-4 text-primary-800">
          <Link href="/wishlist" className="relative group">
            <Image
              src={logoLends}
              alt="Me gusta"
              width={50}
              height={50}
              className="w-11 h-11 object-contain transition-transform group-hover:scale-110"
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
          <Link href="/car" className="hover:text-primary-600 relative">
            <ShoppingCartIcon className="w-7 h-7 object-contain transition-transform hover:scale-110" />

            {cartItems.length > 0 && (
              <span
                className="absolute -top-2 -right-2 bg-primary-400 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold shadow"
              >
                {cartItems.length}
              </span>
            )}
          </Link>


          <Link href="/tracker" className="hover:text-primary-600">
            <Truck className="h-7 w-7 object-contain transition-transform hover:scale-110" />
          </Link>
          <button onClick={openSlider} className="hover:text-primary-600">
            <UserIcon className="h-7 w-7 object-contain transition-transform hover:scale-110" />
          </button>


        </div>
      </div>
    </header>

  )
}