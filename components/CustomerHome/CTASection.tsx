'use client'

import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="w-full py-24 px-6 sm:px-16 bg-primary-900 text-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Barra decorativa opcional */}
        <div className="w-12 h-1 bg-white mx-auto mb-6 rounded-full" />

        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          ¿Listo para encontrar tus nuevos lentes?
        </h2>
        <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
          Personaliza tus lentes, descubre opciones únicas y recibe asesoría profesional sin complicaciones.
        </p>

        <Link
          href="/productos"
          className="inline-block bg-white text-primary-900 text-base sm:text-lg font-semibold px-6 py-3 rounded-full shadow hover:bg-primary-100 transition-all duration-300"
        >
          Explorar productos
        </Link>
      </div>
    </section>
  )
}
