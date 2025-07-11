'use client'

import Image from 'next/image'
import { useEffect, useState, useRef, useCallback } from 'react'
import { productsByFiler } from '@/lib/productsApis/productApis'
import { useRouter } from 'next/navigation'
import logoLends from '@/components/icons/logoLends.svg'
import logoLendsBlue from '@/components/icons/logoLendsBlue.svg' // 💙 para activo
import { useWishlist } from '@/hooks/useWishlist'

interface Product {
    _id: string
    name: string
    category: string
    customerPrice: number
    unitCost?: number
    variants?: { image: string }[]
}

export default function BestSellersCarousel() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const { toggleWishlist, isInWishlist } = useWishlist()

    const observerRef = useRef<HTMLDivElement | null>(null)
    const router = useRouter()

    const fetchMoreProducts = useCallback(async () => {
        try {
            setLoading(true)
            const response = await productsByFiler(page, 10)
            const newProducts = response.products || []

            setProducts(prev => [...prev, ...newProducts])
            setHasMore(newProducts.length === 10) // si trae menos de 10, ya no hay más
        } catch (err) {
            setError('Error al cargar más productos.')
        } finally {
            setLoading(false)
        }
    }, [page])

    useEffect(() => {
        fetchMoreProducts()
    }, [fetchMoreProducts])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    setPage(prev => prev + 1)
                }
            },
            { threshold: 1 }
        )

        const currentRef = observerRef.current
        if (currentRef) observer.observe(currentRef)

        return () => {
            if (currentRef) observer.unobserve(currentRef)
        }
    }, [hasMore, loading])

    const handleProductClick = (productId: string) => {
        localStorage.setItem('selectedProductId', productId)
        router.push('/shop')
    }

    return (
        <section className="relative py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary-900">
                        Catálogo de Lentes
                    </h1>
                    <div className="w-16 h-1 mx-auto bg-primary-400 rounded-full" />
                    <p className="text-base md:text-lg text-primary-600 max-w-2xl mx-auto">
                        Encuentra el par perfecto. Filtra por color, forma o tamaño según tu estilo.
                    </p>
                </div>


                {error && <p className="text-center text-red-600 text-lg">{error}</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            onClick={() => handleProductClick(product._id)}
                            className="card-hover-animated cursor-pointer relative overflow-hidden rounded-3xl bg-white
                flex-shrink-0 w-[260px] h-[340px] p-4 shadow-xl hover:shadow-2xl border border-primary-100"
                        >
                            {/* ❤️ BOTÓN DE ME GUSTA */}
                            <div className="absolute top-2 right-1 z-20 flex flex-col items-center space-y-1">
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

                                    <div className="
                    mt-1 text-[10px] text-primary-600 font-semibold 
                    opacity-0 scale-95 translate-y-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0
                    transition-all duration-300 ease-out shadow-sm bg-white px-2 py-[1px] rounded-full
                  ">
                                        Me gusta
                                    </div>
                                </div>
                            </div>

                            <div className="h-[200px] w-full bg-white flex items-center justify-center">
                                <img
                                    src={product.variants?.[0]?.image || '/imagen/placeholder-product.webp'}
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = '/imagen/placeholder-product.webp'
                                    }}
                                    alt={product.name}
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

                {/* Sentinel para IntersectionObserver */}
                <div ref={observerRef} className="w-full h-10 mt-10 flex justify-center items-center">
                    {loading && <p className="text-primary-600">Cargando más...</p>}
                </div>
            </div>
        </section>
    )
}
