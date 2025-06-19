'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function HeaderPublic() {
  return (
    <header className="fixed top-0 left-0 w-full z-30 bg-transparent backdrop-blur-md shadow-sm pointer-events-none hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2 flex justify-center">
        <Link href="/">
          <Image
            src="/imagen/name_blue.png"
            alt="EnUnaÓptica Logo"
            width={200}
            height={50}
            className="h-auto max-h-[50px] object-contain"
            priority
          />
        </Link>
      </div>
      {/* Navegación (si quieres que siempre esté visible puedes moverla a otro lugar) */}
         <nav className="flex flex-wrap justify-center space-x-4 text-primary-800 text-sm font-medium mb-0">
          <Link href="#inicio" className="hover:underline">Inicio</Link>
          <Link href="#productos" className="hover:underline">Productos</Link>
          <Link href="#nosotros" className="hover:underline">Nosotros</Link>
          <Link href="#contacto" className="hover:underline">Contacto</Link>
        </nav>

    </header>
  )
}
