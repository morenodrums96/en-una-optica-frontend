'use client'

import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { useState } from 'react'

export default function CartPage() {
  const { cartItems, removeFromCart, totalPrice, updateQuantity } = useCart()
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null)

  const handleQuantityChange = (item: any, newQty: number) => {
    if (newQty < 1) return

    const itemKey = `${item.productId}-${JSON.stringify(item.selectedOptions)}`
    setUpdatingItemId(itemKey)

    updateQuantity(item.productId, item.selectedOptions || {}, newQty, {
      onError: (error: any) => {
        if (error.isStockError) {
          toast.warning(error.message)
        } else {
          toast.error(error.message || 'Error al actualizar la cantidad del producto.')
        }
      },
      onSettled: () => setUpdatingItemId(null),
    })
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-extrabold text-primary-900 mb-8 text-center">Tu Carrito</h1>

      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-primary-700 text-lg">Tu carrito está vacío.</p>
          <Link
            href="/shop"
            className="text-primary-600 underline hover:text-primary-700 mt-4 inline-block"
          >
            Ir a la tienda
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {cartItems.map((item, index) => {
              const hasValidDiscount =
                typeof item.discountedPriceWithVAT === 'number' &&
                item.discountedPriceWithVAT > 0 &&
                item.discountedPriceWithVAT < item.customerPrice

              const subtotalUnit = hasValidDiscount
                ? item.discountedPriceWithVAT
                : item.customerPrice

              const subtotal = (subtotalUnit ?? 0) * item.quantity

              return (
                <article
                  key={index}
                  role="listitem"
                  className="flex flex-col md:flex-row gap-6 items-center bg-white p-6 rounded-2xl shadow-md border border-primary-100 transition-all duration-300"
                >
                  <Image
                    src={item.variantImage || '/images/placeholder-product.png'}
                    alt={`Imagen de ${item.name} en el carrito`}
                    width={120}
                    height={120}
                    className="object-contain w-32 h-32 rounded-lg border border-primary-200"
                  />
                  <div className="flex-1 space-y-2">
                    <h2 className="text-xl font-semibold text-primary-900">{item.name}</h2>
                    <p className="text-primary-800 font-medium">
                      Precio unitario: ${item.customerPrice.toLocaleString('es-MX')}
                    </p>

                    {typeof item.discountedPriceWithVAT === 'number' &&
                      item.discountedPriceWithVAT > 0 &&
                      item.discountedPriceWithVAT < item.customerPrice && (
                        <p className="text-sm text-green-600">
                          Ahorras: ${(
                            (item.customerPrice - item.discountedPriceWithVAT) * item.quantity
                          ).toLocaleString('es-MX')} (
                          {(
                            ((item.customerPrice - item.discountedPriceWithVAT) / item.customerPrice) *
                            100
                          ).toFixed(0)}%
                          )
                        </p>
                      )}

                    {item.selectedOptions && Object.entries(item.selectedOptions).map(([groupId, options]) => (
                      <div key={groupId} className="text-sm text-primary-700">
                        {options.map((opt: any) => (
                          <div key={opt._id} className="ml-4">
                            - {opt.name} x{opt.quantity || 1}
                            {opt.selectedColor && (
                              <span className="ml-2 text-primary-500">({opt.selectedColor.name})</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        className="bg-primary-100 hover:bg-primary-200 text-primary-800 font-bold px-3 py-1 rounded-full"
                        disabled={updatingItemId === `${item.productId}-${JSON.stringify(item.selectedOptions)}`}
                        aria-label="Disminuir cantidad"
                      >
                        −
                      </button>
                      <span className="text-lg font-semibold text-primary-900">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        className="bg-primary-100 hover:bg-primary-200 text-primary-800 font-bold px-3 py-1 rounded-full"
                        disabled={updatingItemId === `${item.productId}-${JSON.stringify(item.selectedOptions)}`}
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <p className="text-lg text-primary-800 font-bold">
                      Subtotal: ${subtotal.toLocaleString('es-MX')}
                    </p>
                    <button
                      onClick={() => {
                        removeFromCart(item.productId, item.selectedOptions)
                        toast.success('Producto eliminado del carrito')
                      }}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="mt-12 text-right">
            <p className="text-2xl font-bold text-primary-900 mb-4">
              Total: ${totalPrice.toLocaleString('es-MX')}
            </p>
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
