'use client'

import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { bestSellers } from '@/lib/productsApis/productApis'
import { useRouter } from 'next/navigation' // 👈 Agrega esto
import Link from 'next/link'

interface Product {
  _id: string;
  name: string;
  category: string;
  customerPrice: number;
  unitCost?: number;
  variants?: { image: string }[];
}

export default function BestSellersCarousel() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollAmount = 320

  const router = useRouter()

  const handleProductClick = (productId: string) => {
    localStorage.setItem('selectedProductId', productId)
    router.push('/shop')
  }

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true)
        const response = await bestSellers()
        setProducts(response.products || [])
      } catch (err) {
        console.error('Error al cargar los más vendidos:', err)
        setError('No se pudieron cargar los productos más vendidos. Intenta de nuevo más tarde.')
      } finally {
        setLoading(false)
      }
    }

    fetchBestSellers()
  }, [])

  // Autoplay scroll cada 3s y reinicia
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const interval = setInterval(() => {
      const maxScrollLeft = container.scrollWidth - container.clientWidth
      if (Math.round(container.scrollLeft) >= Math.round(maxScrollLeft)) {
        container.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      }
    }, 3000) // Cambiado de 5000 a 3000ms (más rápido)

    return () => clearInterval(interval)
  }, [products])

  return (
    <section className="w-full py-20 bg-primary-50 overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-12">

        <h2 className="text-5xl font-extrabold text-center text-primary-950 mb-16 tracking-tight leading-tight">
          Nuestros <span className="text-primary-500">Más Vendidos</span>
        </h2>

        {loading && <div className="text-center text-primary-700 text-lg">Cargando productos...</div>}
        {error && <div className="text-center text-red-600 text-lg">{error}</div>}
        {!loading && !error && products.length === 0 && (
          <div className="text-center text-primary-700 text-lg">No hay productos más vendidos disponibles en este momento.</div>
        )}

        {!loading && !error && products.length > 0 && (
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto pb-6 scrollbar-hide scroll-smooth snap-x snap-mandatory"
          >
            <div className="flex gap-10 w-max px-2">
              {products.map((product) => (
                <Link
                  key={product._id}
                  href="/shop"
                  onClick={() => localStorage.setItem('selectedProductId', product._id)}
                  className="cursor-pointer snap-start flex-shrink-0 w-[280px] bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-primary-100"
                >
                  <div>
                    <div className="aspect-[3/2] w-full overflow-hidden rounded-xl bg-primary-50 flex items-center justify-center">
                      <Image
                        src={product.variants?.[0]?.image || '/images/placeholder-product.png'}
                        alt={product.name}
                        width={500}
                        height={333}
                        className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    <div className="mt-7 text-center select-none">
                      <h3 className="text-xl font-bold text-primary-900 truncate mb-2">{product.name}</h3>
                      <p className="text-sm text-primary-700 mb-1">Categoría: <span className="font-medium text-primary-800">{product.category}</span></p>
                      <p className="text-2xl font-extrabold text-primary-600 mb-1">
                        ${product.customerPrice.toLocaleString('es-MX')}
                      </p>
                      <p className="text-xs text-primary-500">
                        Costo unitario:{' '}
                        <span className="font-semibold">
                          {product.unitCost ? `$${product.unitCost.toLocaleString('es-MX')}` : '—'}
                        </span>
                      </p>
                    </div>
                  </div>
                </Link>
              ))}

            </div>
          </div>
        )}
      </div>
    </section>
  )
}
