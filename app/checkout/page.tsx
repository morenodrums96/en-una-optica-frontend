'use client'

import { useCart } from '@/context/CartContext'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart()
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    secondName: '',
    secondLastName: '',
    street: '',
    externalNumber: '',
    internalNumber: '',
    postalCode: '',
    neighborhood: '',
    city: '',
    state: '',
    aditionalReferents: '',
    phone: '',
    email: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Refs para tarjeta
  const cardNumberRef = useRef<HTMLInputElement>(null)
  const cardNameRef = useRef<HTMLInputElement>(null)
  const expMonthRef = useRef<HTMLInputElement>(null)
  const expYearRef = useRef<HTMLInputElement>(null)
  const cvvRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).OpenPay) {
      const OpenPay = (window as any).OpenPay
      OpenPay.setId('YOUR_OPENPAY_ID')
      OpenPay.setApiKey('YOUR_PUBLIC_API_KEY')
      OpenPay.setSandboxMode(true)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const OpenPay = (window as any).OpenPay

    const cardData = {
      holder_name: cardNameRef.current?.value,
      card_number: cardNumberRef.current?.value,
      expiration_month: expMonthRef.current?.value,
      expiration_year: expYearRef.current?.value,
      cvv2: cvvRef.current?.value,
    }

    OpenPay.token.create(cardData, onSuccess, onError)
  }

  const onSuccess = async (response: any) => {
    const tokenId = response.data.id
    console.log('TOKEN ID:', tokenId)

    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form, cartItems, totalPrice, tokenId }),
      })

      const data = await res.json()

      if (!data.success) {
        throw new Error(data.message || 'Fallo al guardar orden')
      }

      clearCart()
      alert('¡Pago exitoso! Redirigiendo...')
      router.push('/')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const onError = (error: any) => {
    console.error('OpenPay error:', error)
    setError(error.data?.description || 'Error al procesar la tarjeta')
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">Información de Envío y Pago</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-md">

        {/* Datos de envío */}
        <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre(s)" className="input" required />
        <input name="secondName" value={form.secondName} onChange={handleChange} placeholder="Segundo Nombre" className="input" />
        <input name="secondLastName" value={form.secondLastName} onChange={handleChange} placeholder="Segundo Apellido" className="input" />
        <input name="street" value={form.street} onChange={handleChange} placeholder="Calle" className="input" required />
        <input name="externalNumber" value={form.externalNumber} onChange={handleChange} placeholder="Número Exterior" className="input" required />
        <input name="internalNumber" value={form.internalNumber} onChange={handleChange} placeholder="Número Interior (opcional)" className="input" />
        <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="Código Postal" className="input" required />
        <input name="neighborhood" value={form.neighborhood} onChange={handleChange} placeholder="Colonia" className="input" required />
        <input name="city" value={form.city} onChange={handleChange} placeholder="Ciudad" className="input" required />
        <input name="state" value={form.state} onChange={handleChange} placeholder="Estado" className="input" required />
        <input name="aditionalReferents" value={form.aditionalReferents} onChange={handleChange} placeholder="Referencias adicionales" className="input" />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Teléfono" className="input" required />
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Correo electrónico" className="input" required />

        {/* Tarjeta */}
        <input ref={cardNameRef} placeholder="Nombre en la tarjeta" className="input" required />
        <input ref={cardNumberRef} placeholder="Número de tarjeta" className="input" required />
        <input ref={expMonthRef} placeholder="Mes de expiración (MM)" className="input" required />
        <input ref={expYearRef} placeholder="Año de expiración (YY)" className="input" required />
        <input ref={cvvRef} placeholder="CVV" className="input" required />

        <div className="md:col-span-2 flex justify-between items-center mt-4">
          <p className="text-lg font-semibold text-gray-700">Total a pagar: ${totalPrice.toLocaleString('es-MX')}</p>
          <button type="submit" disabled={loading} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg shadow">
            {loading ? 'Procesando...' : 'Pagar'}
          </button>
        </div>

        {error && <p className="md:col-span-2 text-red-500 mt-2 text-center">{error}</p>}
      </form>
    </div>
  )
}
