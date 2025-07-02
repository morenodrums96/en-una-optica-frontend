'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full bg-primary-100 text-primary-900 pt-16 px-6 sm:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-10 pb-12 border-b border-primary-300">

        {/* Logo + descripción */}
        <div>
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
          <p className="text-sm text-primary-800 leading-relaxed">
            Lentes hechos para ti. Comodidad, tecnología y estilo en un solo lugar.
          </p>
        </div>

        {/* Navegación */}
        <div>
          <h4 className="font-semibold text-base mb-3">Navegación</h4>
          <ul className="space-y-2 text-sm text-primary-700">
            <li><Link href="/" className="hover:text-primary-900 transition">Inicio</Link></li>
            <li><Link href="/productos" className="hover:text-primary-900 transition">Productos</Link></li>
            <li><Link href="/#nosotros" className="hover:text-primary-900 transition">Nuestra historia</Link></li>
            <li><Link href="/#contacto" className="hover:text-primary-900 transition">Contacto</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-semibold text-base mb-3">Legal</h4>
          <ul className="space-y-2 text-sm text-primary-700">
            <li><Link href="/terminos" className="hover:text-primary-900 transition">Términos y condiciones</Link></li>
            <li><Link href="/privacidad" className="hover:text-primary-900 transition">Aviso de privacidad</Link></li>
            <li><Link href="/preguntas" className="hover:text-primary-900 transition">Preguntas frecuentes</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-semibold text-base mb-3">Suscríbete</h4>
          <p className="text-sm text-primary-700 mb-3">Recibe novedades exclusivas y promociones.</p>
          {/* Aquí podrías agregar un formulario real en el futuro */}
          <input
            type="email"
            placeholder="Tu correo electrónico"
            className="w-full rounded-md px-4 py-2 text-sm border border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Línea inferior */}
      <div className="max-w-7xl mx-auto py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-primary-700 gap-4">
        <div>
          © {new Date().getFullYear()} EnUnaÓptica. Todos los derechos reservados.
        </div>
        <div className="flex gap-4">
          <Link href="https://facebook.com" target="_blank" aria-label="Facebook">
            <Facebook className="w-5 h-5 hover:text-primary-900 transition" />
          </Link>
          <Link href="https://instagram.com" target="_blank" aria-label="Instagram">
            <Instagram className="w-5 h-5 hover:text-primary-900 transition" />
          </Link>
          <Link href="https://twitter.com" target="_blank" aria-label="Twitter">
            <Twitter className="w-5 h-5 hover:text-primary-900 transition" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
