'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { bestSellers } from '@/lib/productsApis/productApis'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import logoLends from '@/components/icons/logoLends.svg'
import logoLendsBlue from '@/components/icons/logoLendsBlue.svg'

import { useWishlist } from '@/hooks/useWishlist'

interface Product {
  _id: string
  name: string
  category: string
  customerPrice: number
  unitCost?: number
  variants?: { image: string }[]
}

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function BestSellersCarousel() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const { toggleWishlist, isInWishlist } = useWishlist()

  const handleProductClick = (productId: string) => {
    localStorage.setItem('selectedProductId', productId)
    router.push('/shop')
  }

  const scrollLeft = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  const scrollRight = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
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

  return (
    <section className="relative overflow-visible min-h-[750px]">
      <motion.div
        className="relative z-[999] flex flex-col items-center gap-2 mb-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        viewport={{ once: false, amount: 0.6 }}
      >
        <div className="w-20 h-1 bg-primary-400 rounded-full" />
        <h2 className="text-5xl font-extrabold text-center text-primary-600 tracking-tight leading-tight">
          Trending <span className="text-primary-400">Products</span>
        </h2>

        {loading && <div className="text-center text-primary-700 text-lg">Cargando productos...</div>}
        {error && <div className="text-center text-red-600 text-lg">{error}</div>}
        {!loading && !error && products.length === 0 && (
          <div className="text-center text-primary-700 text-lg">
            No hay productos más vendidos disponibles en este momento.
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            {products.length >= 5 ? (
              <div className="w-full flex justify-center relative pt-24 overflow-visible min-h-[600px]">
                {/* Botones de navegación */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-6 pb-4">
                  <button data-allow-multiple
                    onClick={scrollLeft}
                    className="bg-white shadow-md rounded-full p-4 hover:bg-primary-100 transition-colors"
                    aria-label="Ver productos anteriores"
                  >
                    <ChevronLeft className="w-8 h-8 text-primary-600" />
                  </button>

                  <button data-allow-multiple
                    onClick={scrollRight}
                    className="bg-white shadow-md rounded-full p-4 hover:bg-primary-100 transition-colors"
                    aria-label="Ver siguientes productos"
                  >
                    <ChevronRight className="w-8 h-8 text-primary-600" />
                  </button>
                </div>

                {/* Carrusel animado */}
                <motion.div layout className="flex gap-32 justify-center pt-28 lg:pt-56 w-full px-4">
                  {
                    (() => {
                      const visibleProducts = Array.from({ length: 5 }, (_, i) => {
                        const index = (currentIndex - 2 + i + products.length) % products.length
                        return { product: products[index], actualIndex: index }
                      })

                      return visibleProducts.map(({ product, actualIndex }) => {
                        const isCurrent = actualIndex === currentIndex
                        const isLeft = actualIndex === (currentIndex - 1 + products.length) % products.length
                        const isRight = actualIndex === (currentIndex + 1) % products.length
                        const isFarLeft = actualIndex === (currentIndex - 2 + products.length) % products.length
                        const isFarRight = actualIndex === (currentIndex + 2) % products.length

                        return (
                          <motion.div
                            layout
                            key={product._id}
                            layoutId={`product-${product._id}`}
                            onClick={() => handleProductClick(product._id)}
                            animate={{
                              y: isCurrent ? -250 : isLeft || isRight ? -225 : isFarLeft || isFarRight ? -140 : 0,
                              scale: isCurrent ? 1.25 : isLeft || isRight ? 1.1 : 1,
                              rotate: isLeft ? -10 : isRight ? 10 : isFarLeft ? -15 : isFarRight ? 15 : 0,
                              zIndex: isCurrent ? 20 : isLeft || isRight ? 30 : 20
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className={cn(
                              "card-hover-animated cursor-pointer relative overflow-hidden rounded-3xl bg-white",
                              "flex-shrink-0 w-[260px] h-[340px] p-4 shadow-xl hover:shadow-2xl border border-primary-100"
                            )}
                          >
                            {/* ❤️ Me gusta */}
                            <div className="absolute top-3 right-3 z-20 flex flex-col items-center space-y-1">
                              <div className="group flex flex-col items-center">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleWishlist(product._id)
                                  }}
                                  className="p-1 rounded-full bg-white shadow-md transition-transform hover:scale-90"
                                >
                                  <Image
                                    src={isInWishlist(product._id) ? logoLendsBlue : logoLends}
                                    alt="Me gusta"
                                    width={30}
                                    height={30}
                                    className="w-6 h-6 object-contain"
                                  />
                                </button>
                                <div className="mt-1 text-[10px] text-primary-600 font-semibold opacity-0 scale-95 translate-y-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 ease-out shadow-sm bg-white px-2 py-[1px] rounded-full">
                                  Me gusta
                                </div>
                              </div>
                            </div>

                            {/* Imagen */}
                            {/* Imagen – Estático */}
                            <div className="h-[200px] w-full overflow-hidden rounded-2xl flex items-center justify-center">
                              <img
                                src={product.variants?.[0]?.image || '/imagen/placeholder-product.webp'}
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = '/imagen/placeholder-product.webp'
                                }}
                                alt={`Imagen del producto ${product.name}`}
                                className="object-contain w-full h-full"
                              />
                            </div>


                            {/* Info */}
                            <div className="mt-5 text-center select-none">
                              <h3 className="text-lg font-semibold text-primary-900 truncate leading-tight">
                                {product.name}
                              </h3>
                              <p className="text-sm text-primary-700 font-medium mt-1">
                                Precio: <span className="font-semibold">${product.customerPrice.toLocaleString('es-MX')}</span>
                              </p>
                            </div>
                          </motion.div>
                        )
                      })
                    })()
                  }
                </motion.div>
              </div>
            ) : (
              // Layout simple cuando hay menos de 5 productos
              <div className="w-full flex flex-wrap justify-center gap-8 pt-20">
                {products.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleProductClick(product._id)}
                    className="card-hover-animated w-[260px] h-[340px] p-4 shadow-xl border border-primary-100 rounded-3xl bg-white cursor-pointer hover:shadow-2xl transition relative"
                  >
                    {/* Me gusta */}
                    <div className="absolute top-3 right-3 z-20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleWishlist(product._id)
                        }}
                        className="p-1 rounded-full bg-white shadow-md transition-transform hover:scale-90"
                      >
                        <Image
                          src={isInWishlist(product._id) ? logoLendsBlue : logoLends}
                          alt="Me gusta"
                          width={30}
                          height={30}
                          className="w-6 h-6 object-contain"
                        />
                      </button>
                    </div>

                    {/* Imagen */}
                    {/* Imagen – Carrusel */}
                    <div className="h-[200px] w-full overflow-hidden rounded-2xl flex items-center justify-center">
                      <img
                        src={product.variants?.[0]?.image || '/imagen/placeholder-product.webp'}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/imagen/placeholder-product.webp'
                        }}
                        alt={`Imagen del producto ${product.name}`}
                        className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>


                    {/* Info */}
                    <div className="mt-5 text-center select-none">
                      <h3 className="text-lg font-semibold text-primary-900 truncate leading-tight">
                        {product.name}
                      </h3>
                      <p className="text-sm text-primary-700 font-medium mt-1">
                        Precio: <span className="font-semibold">${product.customerPrice.toLocaleString('es-MX')}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </motion.div>
    </section>
  )
}
