'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Josefin_Sans } from 'next/font/google' // o cambia por Quicksand, Poppins, etc.

const josefin = Josefin_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-josefin',
})

export default function HeaderPublic() {
  return (
    <header
      id="header-public"
      className={`fixed top-0 left-0 w-full z-30 opacity-0 pointer-events-none bg-white/0 dark:bg-black/10 backdrop-blur-none ${josefin.variable}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2 flex justify-center items-center">
        <Link href="/">
          <Image
            src="/imagen/name_blue.png"
            alt="EnUnaÓptica Logo"
            width={200}
            height={50}
            className="h-auto max-h-[50px] object-contain drop-shadow-md "
            priority
          />
        </Link>
      </div>

      <nav className="flex justify-center space-x-6 text-[#254C54] dark:text-primary-100 text-base font-medium tracking-wide">
        <Link href="#productos" className="hover:underline transition">Productos</Link>
        <Link href="#nosotros" className="hover:underline transition">Nosotros</Link>
        <Link href="#contacto" className="hover:underline transition">Contacto</Link>
      </nav>
    </header>
  )
}
