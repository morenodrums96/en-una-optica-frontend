'use client'

import { Glasses, Star, Settings2 } from 'lucide-react'

export default function Benefits() {
  const items = [
    { icon: <Glasses className="w-6 h-6" />, title: 'Diseño único', desc: 'Lentes modernos y personalizables para todos los estilos.' },
    { icon: <Star className="w-6 h-6" />, title: 'Calidad premium', desc: 'Materiales resistentes y certificados para tu comodidad visual.' },
    { icon: <Settings2 className="w-6 h-6" />, title: 'Proceso simple', desc: 'Selecciona, personaliza y recibe en casa sin complicaciones.' }
  ]

  return (
    <section className="w-full py-16 bg-white px-6 sm:px-16 text-center">
      <h2 className="text-2xl font-bold text-primary-800 mb-10">¿Por qué elegirnos?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {items.map((item, idx) => (
          <div key={idx} className="bg-primary-50 rounded-xl p-6 shadow hover:shadow-md transition">
            <div className="mb-4 text-primary-700">{item.icon}</div>
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-primary-700">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
