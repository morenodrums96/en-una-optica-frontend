'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function BestSellersCarousel() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch('/api/products/bestsellers')
      .then(res => res.json())
      .then(data => setProducts(data))
  }, [])

  return (
    <section className="w-full py-10 bg-white">
      <h2 className="text-2xl font-bold text-center text-primary-800 mb-6">Más Vendidos</h2>
      <div className="flex overflow-x-auto gap-4 px-4 sm:px-8">
        {products.map((product: any) => (
          <div key={product._id} className="min-w-[200px] max-w-[240px] flex-shrink-0 bg-primary-50 rounded-md p-2 shadow hover:shadow-md transition">
            <Image
              src={product.image || '/images/placeholder-product.png'}
              alt={product.name}
              width={300}
              height={200}
              className="object-cover rounded-md w-full h-40"
            />
            <h3 className="mt-2 font-semibold text-primary-900 text-sm">{product.name}</h3>
            <p className="text-primary-700 text-sm">${product.price}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
