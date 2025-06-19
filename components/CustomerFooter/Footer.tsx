'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full bg-primary-100 text-primary-900 pt-10 px-4 sm:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-8 pb-8 border-b border-primary-300">
        
        {/* Logo o Marca */}
        <div>
          <Link href="/" className="inline-block mb-2">
            <Image
              src="/imagen/name_blue.png"
              alt="EnUnaÓptica Logo"
              width={150}
              height={50}
              className="object-contain"
            />
          </Link>
          <p className="text-sm text-primary-800">
            Lentes hechos para ti. Comodidad, tecnología y estilo en un solo lugar.
          </p>
        </div>

        {/* Navegación */}
        <div>
          <h4 className="font-semibold mb-3">Navegación</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:underline">Inicio</Link></li>
            <li><Link href="/productos" className="hover:underline">Productos</Link></li>
            <li><Link href="/#nosotros" className="hover:underline">Nuestra historia</Link></li>
            <li><Link href="/#contacto" className="hover:underline">Contacto</Link></li>
          </ul>
        </div>

        {/* Legal / Extra */}
        <div>
          <h4 className="font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/terminos" className="hover:underline">Términos y condiciones</Link></li>
            <li><Link href="/privacidad" className="hover:underline">Aviso de privacidad</Link></li>
            <li><Link href="/preguntas" className="hover:underline">Preguntas frecuentes</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-semibold mb-3">Suscríbete</h4>
          <p className="text-sm mb-2">Recibe ofertas y novedades exclusivas.</p>
        </div>
      </div>

      {/* Footer inferior */}
      <div className="max-w-7xl mx-auto py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-primary-700 gap-2">
        <div>
          © {new Date().getFullYear()} EnUnaÓptica. Todos los derechos reservados.
        </div>
        <div className="flex gap-4">
          <Link href="https://facebook.com" target="_blank" aria-label="Facebook">
            <Facebook className="w-4 h-4 hover:text-primary-900" />
          </Link>
          <Link href="https://instagram.com" target="_blank" aria-label="Instagram">
            <Instagram className="w-4 h-4 hover:text-primary-900" />
          </Link>
          <Link href="https://twitter.com" target="_blank" aria-label="Twitter">
            <Twitter className="w-4 h-4 hover:text-primary-900" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
