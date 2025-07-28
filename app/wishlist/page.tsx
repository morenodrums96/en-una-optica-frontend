'use client'

import { useEffect, useState } from 'react'
import { useWishlistProducts } from '@/hooks/useWishlistProducts'
import { useWishlist } from '@/context/WishlistContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import logoLends from '@/components/icons/logoLends.svg'
import logoLendsRed from '@/components/icons/logoLendsRed.svg'

export default function WishlistPage() {
  const [anonymousId, setAnonymousId] = useState<string | null>(null)
  const router = useRouter()
  const { toggleWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    const id = localStorage.getItem('anonymousUserId')
    if (id) setAnonymousId(id)
  }, [])

  const { data: products, isLoading } = useWishlistProducts(anonymousId)

  const handleProductClick = (productId: string) => {
    localStorage.setItem('selectedProductId', productId)
    router.push('/shop')
  }

  return (
    <section className="relative py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary-900">
            Tus Favoritos
          </h1>
          <p className="text-base md:text-lg text-primary-600 max-w-2xl mx-auto">
            Aquí puedes ver todos los lentes que marcaste como favoritos.
          </p>
        </div>

        {!anonymousId || isLoading ? (
          <p className="text-center text-primary-600">Cargando productos...</p>
        ) : !products || products.length === 0 ? (
          <p className="text-center text-primary-600">No tienes productos en tu lista de deseos.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="card-hover-animated cursor-pointer relative overflow-hidden rounded-3xl bg-white
                flex-shrink-0 w-[260px] h-[340px] p-4 shadow-xl hover:shadow-2xl border border-primary-100"
              >
                {/* Botón Me gusta */}
                <div className="absolute top-2 right-2 z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleWishlist(product._id)
                    }}
                    className="p-1 rounded-full bg-white shadow-md transition-transform hover:scale-90"
                  >
                    <Image
                      src={isInWishlist(product._id) ? logoLendsRed : logoLends}
                      alt="Favorito"
                      width={30}
                      height={30}
                      className="w-6 h-6 object-contain"
                    />
                  </button>
                </div>

                {/* Imagen */}
                <div
                  onClick={() => handleProductClick(product._id)}
                  className="h-[200px] w-full bg-white flex items-center justify-center"
                >
                  <Image
                    src={product.variants?.[0]?.image || '/images/placeholder-product.png'}
                    alt={product.name}
                    width={500}
                    height={333}
                    className="object-contain w-full h-full"
                  />
                </div>

                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-primary-900 truncate">{product.name}</h3>
                  <p className="text-sm text-primary-700 font-medium mt-1">
                    ${product.customerPrice.toLocaleString('es-MX')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
