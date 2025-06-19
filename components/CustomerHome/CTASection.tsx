'use client'

import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="w-full py-20 bg-primary-900 text-white text-center px-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4">¿Listo para encontrar tus nuevos lentes?</h2>
      <p className="mb-6 text-lg">Personaliza tus lentes y recibe asesoría profesional en pocos pasos.</p>
      <Link
        href="/productos"
        className="bg-white text-primary-900 px-6 py-3 rounded-md font-semibold hover:bg-primary-100 transition"
      >
        Explorar productos
      </Link>
    </section>
  )
}
