'use client'

export default function AboutUs() {
  return (
    <section className="w-full bg-primary-50 py-24 px-6 sm:px-16 text-primary-900">
      <div className="max-w-4xl mx-auto bg-white border-l-4 border-primary-500 rounded-xl shadow-sm p-8 sm:p-12">
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-800 tracking-tight">
            Nuestra Historia
          </h2>

          <p className="text-lg sm:text-xl text-primary-700 leading-relaxed">
            EnUnaÓptica nació con la misión de ayudarte a verte mejor y sentirte increíble.
            Creemos que cada lente debe ser tan único como tú, combinando calidad, diseño moderno
            y personalización como base de todo lo que hacemos.
          </p>

          <p className="text-lg sm:text-xl text-primary-700 leading-relaxed">
            Junto a un equipo de expertos en optometría y tecnología, ofrecemos una experiencia
            visual completamente pensada para ti. Comodidad, estilo y funcionalidad en un solo lugar.
          </p>
        </div>
      </div>
    </section>
  )
}
