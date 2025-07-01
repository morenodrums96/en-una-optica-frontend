'use client'

export default function TopMarquee() {
  const messages = [
    '🚚 Envíos gratis en pedidos mayores a $999',
    '📦 Devoluciones fáciles en todo México',
    '😎 Lentes con protección UV incluidos',
    '👁️‍🗨️ Armazones únicos y personalizables',
    '💳 Pagos con OpenPay y Aplazo disponibles',
    '🇲🇽 Hecho con amor desde México',
  ]

  return (
    <div className="w-full overflow-hidden bg-primary-50 border-b border-primary-100 text-primary-900 text-base py-2 animate-slide-down">
      <div className="flex animate-marquee gap-10 whitespace-nowrap">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="flex gap-10 px-1 flex-shrink-0 w-auto"
          >
            {messages.map((msg, index) => (
              <span key={`${i}-${index}`} className="flex items-center gap-2">
                {msg}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
