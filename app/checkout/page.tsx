'use client'

import { useCart } from '@/context/CartContext'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import CardDetails from '@/components/CardDetails/CardDetails'
import { getOpenPayToken, createOrGetCustomer, createCharge } from '@/lib/checkoutApis/checkout'
import { toast } from 'sonner'

type CardForm = {
  cardName: string
  cardNumber: string
  expDate: string
  cvv: string
}

const Input = ({ label, name, value, onChange, required = false, type = 'text', className = '' }: any) => {
  const isValid = value && value.trim().length > 0
  return (
    <div className="relative w-full">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={label}
        className={`w-full p-3 rounded-md border ${isValid ? 'border-primary-600' : 'border-primary-950'
          } focus:outline-none focus:ring-2 focus:ring-primary-500 text-primary-900 placeholder-primary-800 ${className}`}
      />
      {isValid && (
        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-600" size={20} />
      )}
    </div>
  )
}

export default function CheckoutPage() {
  const getCardDataRef = useRef<() => CardForm | null>(() => null)
  const isCardValidRef = useRef<() => boolean>(() => false)

  const { cartItems, totalPrice, clearCart } = useCart()
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    lastName: '',
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
    subscribe: false,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const cardIsValid = isCardValidRef.current?.()
      const cardData = getCardDataRef.current?.()

      if (!cardIsValid || !cardData) {
        setError('Por favor completa los datos de la tarjeta correctamente.')
        setLoading(false)
        return
      }

      const anonymousId = localStorage.getItem('anonymousUserId')
      if (!anonymousId) {
        setError('No se encontró el identificador de sesión.')
        setLoading(false)
        return
      }

      const [expMonth, expYear] = cardData.expDate.split('/')

      const formattedCardData = {
        card_number: cardData.cardNumber.replace(/\s/g, ''),
        holder_name: cardData.cardName,
        expiration_month: expMonth,
        expiration_year: expYear,
        cvv2: cardData.cvv,
      }

      // 1️⃣ Generar token de OpenPay
      const { tokenIdOpenPay } = await getOpenPayToken(formattedCardData)
      console.log('✅ Token OpenPay:', tokenIdOpenPay)

      // 3️⃣ Crear cliente en OpenPay
      const fullName = `${form.name} ${form.lastName}`

      const customer = await createOrGetCustomer({
        anonymousId,
        name: fullName,
        email: form.email,
        phone: form.phone,
        address: {
          city: form.city,
          line1: `${form.street} ${form.externalNumber}`,
          line2: form.internalNumber,
          postal_code: form.postalCode,
          state: form.state,
          country_code: 'MX',
        },
      })

      console.log('✅ Cliente creado u obtenido:', customer)

      // 4️⃣ Crear cargo en OpenPay
      const charge = await createCharge({
        anonymousId,
        tokenIdOpenPay,
      })

      console.log('✅ Cargo realizado con éxito:', charge)
      toast.success('¡Pago exitoso! Gracias por tu compra.')

      // ⏳ Futuro: crear orden + envío

    } catch (err: any) {
      console.error('❌ Error en proceso de pago:', err)
      setError(err.message || 'Ocurrió un error inesperado.')
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-primary-800 mb-8 text-center">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow">
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input name="name" label="Nombre(s)" value={form.name} onChange={handleChange} required />
          <Input name="lastName" label="Apellidos" value={form.lastName} onChange={handleChange} required />
          <Input name="street" label="Calle" value={form.street} onChange={handleChange} required />
          <Input name="internalNumber" label="Número interior" value={form.internalNumber} onChange={handleChange} required />
          <Input name="externalNumber" label="Número exterior" value={form.externalNumber} onChange={handleChange} />
          <Input name="postalCode" label="C.P." value={form.postalCode} onChange={handleChange} required />
          <Input name="state" label="Estado" value={form.state} onChange={handleChange} required />
          <Input name="city" label="Ciudad" value={form.city} onChange={handleChange} required />
          <Input name="neighborhood" label="Colonia" value={form.neighborhood} onChange={handleChange} required />
          <Input name="aditionalReferents" label="Referencias adicionales" value={form.aditionalReferents} onChange={handleChange} maxLength={300} />
          <Input name="phone" label="Teléfono" value={form.phone} onChange={handleChange} required />
          <Input name="email" type="email" label="Correo electrónico" value={form.email} onChange={handleChange} required />
          <label className="col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              name="subscribe"
              checked={form.subscribe}
              onChange={handleChange}
              className="accent-primary-200"
            />
            Quiero recibir noticias y ofertas exclusivas.
          </label>
        </div>

        <CardDetails
          getCardDataRef={getCardDataRef}
          isCardValidRef={isCardValidRef}
        />

        <div className="md:col-span-2 flex justify-between items-center mt-4">
          <p className="text-lg font-bold text-primary-900">
            Total a pagar: ${totalPrice.toLocaleString('es-MX')}
          </p>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg"
          >
            {loading ? 'Procesando...' : 'Pagar'}
          </button>
        </div>

        {error && <p className="md:col-span-2 text-red-500 text-center mt-2">{error}</p>}
      </form>
    </div>
  )
}
