'use client'

import { useEffect, useState, MutableRefObject } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

type CardForm = {
  cardName: string
  cardNumber: string
  expDate: string
  cvv: string
}

interface CardDetailsProps {
  getCardDataRef: MutableRefObject<() => CardForm | null>
  isCardValidRef: MutableRefObject<() => boolean>
}

const CardDetails = ({ getCardDataRef, isCardValidRef }: CardDetailsProps) => {
  const [form, setForm] = useState<CardForm>({
    cardName: '',
    cardNumber: '',
    expDate: '',
    cvv: '',
  })

  const [valid, setValid] = useState({
    cardName: false,
    cardNumber: false,
    expDate: false,
    cvv: false,
  })

  useEffect(() => {
    getCardDataRef.current = () => form
    isCardValidRef.current = () =>
      valid.cardName && valid.cardNumber && valid.expDate && valid.cvv
  }, [form, valid, getCardDataRef, isCardValidRef])

  const handleChange = (name: keyof CardForm, rawValue: string) => {
    let value = rawValue

    if (name === 'cardNumber') {
      value = value.replace(/[^\d]/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
    }

    if (name === 'expDate') {
      value = value.replace(/[^\d]/g, '').slice(0, 4)
      if (value.length >= 3) value = `${value.slice(0, 2)}/${value.slice(2)}`
    }

    setForm(prev => ({ ...prev, [name]: value }))
    validate(name, value)
  }

  const validate = (name: keyof CardForm, value: string) => {
    let isValid = false

    switch (name) {
      case 'cardName':
        isValid = value.trim().length > 0
        break
      case 'cardNumber':
        isValid = /^\d{16}$/.test(value.replace(/\s/g, ''))
        break
      case 'expDate':
        const [month, year] = value.split('/')
        isValid = /^\d{2}\/\d{2}$/.test(value) && Number(month) >= 1 && Number(month) <= 12 && Number(year) >= 24
        break
      case 'cvv':
        isValid = /^\d{3,4}$/.test(value)
        break
    }

    setValid(prev => ({ ...prev, [name]: isValid }))
  }

  const renderInput = (label: string, name: keyof CardForm, type = 'text') => {
    const value = form[name]
    const isValid = valid[name]

    return (
      <div className="relative w-full">
        <input
          value={value}
          placeholder={label}
          type={type}
          onChange={(e) => handleChange(name, e.target.value)}
          className={`w-full p-3 rounded-md border ${isValid ? 'border-primary-600' : 'border-red-500'} focus:outline-none focus:ring-2 ${isValid ? 'focus:ring-primary-500' : 'focus:ring-red-500'} text-primary-900 placeholder-primary-800`}
        />
        {isValid ? (
          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-600" size={20} />
        ) : (
          <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" size={20} />
        )}
      </div>
    )
  }

  return (
    <div className="md:col-span-2 mt-8">
      <h2 className="text-xl font-semibold text-primary-800 mb-4">Datos de tarjeta</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderInput('Nombre en la tarjeta', 'cardName')}
        {renderInput('Número de tarjeta', 'cardNumber', 'tel')}
        {renderInput('Expiración (MM/YY)', 'expDate', 'tel')}
        {renderInput('CVV', 'cvv', 'tel')}
      </div>
    </div>
  )
}

export default CardDetails
