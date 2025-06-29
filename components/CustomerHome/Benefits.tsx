'use client'

import { Glasses, Star, Settings2 } from 'lucide-react'

export default function Benefits() {
  const items = [
    {
      icon: <Glasses className="w-6 h-6 text-primary-600" />,
      title: 'Diseño único',
      desc: 'Estilo moderno y personalización total. Creamos lentes que reflejan quién eres.',
    },
    {
      icon: <Star className="w-6 h-6 text-primary-600" />,
      title: 'Calidad premium',
      desc: 'Materiales certificados, alta durabilidad y confort visual en cada detalle.',
    },
    {
      icon: <Settings2 className="w-6 h-6 text-primary-600" />,
      title: 'Proceso simple',
      desc: 'Compra fácil: personaliza, elige y recibe tus lentes directamente en casa.',
    },
  ]

  return (
    <section className="w-full bg-primary-50 py-24 px-6 sm:px-16 text-primary-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary-800">
            ¿Por qué elegirnos?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="relative bg-white border-l-4 border-primary-500 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-primary-800">
                  {item.title}
                </h3>
              </div>
              <p className="text-sm text-primary-700 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
