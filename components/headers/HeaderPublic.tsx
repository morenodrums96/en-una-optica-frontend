'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline'
import { Truck } from 'lucide-react'
import Image from 'next/image'
import logoLends from '@/components/icons/logoLends.svg'

interface Props {
  animated?: boolean
}

// ... (imports y otros hooks)

export default function HeaderPublic({ animated = true }: Props) {
  const headerRef = useRef<HTMLElement>(null)
  const [isScrolled, setIsScrolled] = useState(false)

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
    fixed top-8 left-1/2 transform -translate-x-1/2 z-[9999]
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
          <Link href="#productos">Productos</Link>
          <Link href="#nosotros">Nosotros</Link>
          <Link href="#contacto">Contacto</Link>
        </nav>

        {/* Íconos */}
        <div className="flex items-center space-x-4 text-primary-800">
          <Link href="/favoritos" className="hover:text-primary-600">
            <Image
              src={logoLends}
              alt="Me gusta"
              style={{ width: '50px', height: '50px' }}
              width={50}
              height={50}
              className="w-6 h-6 object-contain transition-transform hover:scale-110"
            />
            
          </Link>
          <Link href="/carrito" className="hover:text-primary-600 relative">
            <ShoppingCartIcon className="w-7 h-7 object-contain transition-transform hover:scale-110" />
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">3</span>
          </Link>
          <Link href="/seguimiento" className="hover:text-primary-600">
            <Truck className="h-7 w-7 object-contain transition-transform hover:scale-110" />
          </Link>
          <Link href="/login" className="hover:text-primary-600">
            <UserIcon className="h-7 w-7 object-contain transition-transform hover:scale-110" />
          </Link>
        </div>
      </div>
    </header>

  )
}