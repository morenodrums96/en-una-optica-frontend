'use client'

import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import Link from 'next/link'

export default function CartPage() {
  const { cartItems, removeFromCart, totalPrice } = useCart()

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Tu Carrito</h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">Tu carrito está vacío.</p>
      ) : (
        <>
          <div className="grid gap-6">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-6 items-center bg-white p-6 rounded-lg shadow-md border"
              >
                <Image
                  src={item.variantImage || '/images/placeholder-product.png'}
                  alt={item.name}
                  width={120}
                  height={120}
                  className="object-contain w-32 h-32"
                />
                <div className="flex-1 space-y-2">
                  <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                  <p className="text-gray-600">Precio: ${item.customerPrice.toLocaleString('es-MX')}</p>

                  {/* Mostrar configuraciones */}
                  {item.selectedOptions && Object.entries(item.selectedOptions).map(([groupId, options]) => (
                    <div key={groupId} className="text-sm text-gray-700">
                      {options.map((opt: any) => (
                        <div key={opt._id} className="ml-4">
                          - {opt.name} x{opt.quantity || 1} 
                          {opt.selectedColor && (
                            <span className="ml-2 text-gray-500">({opt.selectedColor.name})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => removeFromCart(item)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>

          <div className="mt-12 text-right">
            <p className="text-2xl font-bold text-gray-800 mb-4">Total: ${totalPrice.toLocaleString('es-MX')}</p>
            <Link
              href="/checkout"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg transition-transform hover:scale-105"
            >
              Continuar al Pago
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
