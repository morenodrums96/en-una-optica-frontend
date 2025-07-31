'use client'
import { useEffect, useRef } from 'react'

interface Props {
  getCardDataRef: React.MutableRefObject<() => any>
  isCardValidRef: React.MutableRefObject<() => boolean>
}

export default function CardDetails({ getCardDataRef, isCardValidRef }: Props) {
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const openpayScript = document.createElement('script')
    openpayScript.src = 'https://openpay.s3.amazonaws.com/openpay.v1.min.js'
    openpayScript.async = true

    const dataScript = document.createElement('script')
    dataScript.src = 'https://openpay.s3.amazonaws.com/openpay-data.v1.min.js'
    dataScript.async = true

    let loadedScripts = 0

    const handleScriptLoaded = () => {
      loadedScripts++
      if (loadedScripts === 2) {
        // Ambos scripts están listos
        // @ts-ignore
        window.OpenPay.setId('mcxajuikhqhwoftq660v')
        // @ts-ignore
        window.OpenPay.setApiKey('pk_951afaac262d495881dd39eddf2bdcb1')
        // @ts-ignore
        window.OpenPay.setSandboxMode(true)
        // @ts-ignore
        window.OpenPay.deviceData.setup('card-form', 'deviceIdHiddenFieldName')
      }
    }

    openpayScript.onload = handleScriptLoaded
    dataScript.onload = handleScriptLoaded

    document.body.appendChild(openpayScript)
    document.body.appendChild(dataScript)
  }, [])

  // Exponer datos para el token
  getCardDataRef.current = () => {
    const container = formRef.current
    if (!container) return null

    const getValue = (selector: string) =>
      container.querySelector<HTMLInputElement>(selector)?.value.trim() || ''

    const cardNumber = getValue('[data-openpay-card="card_number"]')
    const cardName = getValue('[data-openpay-card="holder_name"]')
    const expMonth = getValue('[data-openpay-card="expiration_month"]')
    const expYear = getValue('[data-openpay-card="expiration_year"]')
    const cvv = getValue('[data-openpay-card="cvv2"]')

    if (!cardNumber || !cardName || !expMonth || !expYear || !cvv) {
      return null
    }

    return {
      cardNumber,
      cardName,
      expDate: `${expMonth}/${expYear}`,
      cvv,
    }
  }

  isCardValidRef.current = () => {
    const container = formRef.current
    if (!container) return false

    const requiredFields = [
      '[data-openpay-card="card_number"]',
      '[data-openpay-card="holder_name"]',
      '[data-openpay-card="expiration_month"]',
      '[data-openpay-card="expiration_year"]',
      '[data-openpay-card="cvv2"]',
    ]

    return requiredFields.every((selector) => {
      const input = container.querySelector<HTMLInputElement>(selector)
      return input?.value.trim().length
    })
  }

  return (
    <div id="card-form" ref={formRef} className="space-y-4 col-span-2 bg-primary-50 p-6 rounded-lg">
      <h2 className="text-lg font-bold mb-2 text-primary-900">Datos de la tarjeta</h2>

      <input
        type="text"
        name="holder_name"
        data-openpay-card="holder_name"
        placeholder="Nombre del titular"
        className="w-full p-3 border border-primary-200 rounded"
        required
      />

      <input
        type="text"
        name="card_number"
        data-openpay-card="card_number"
        placeholder="Número de tarjeta"
        className="w-full p-3 border border-primary-200 rounded"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="expiration_month"
          data-openpay-card="expiration_month"
          placeholder="Mes (MM)"
          className="w-full p-3 border border-primary-200 rounded"
          required
        />
        <input
          type="text"
          name="expiration_year"
          data-openpay-card="expiration_year"
          placeholder="Año (YY)"
          className="w-full p-3 border border-primary-200 rounded"
          required
        />
      </div>

      <input
        type="text"
        name="cvv2"
        data-openpay-card="cvv2"
        placeholder="Código de seguridad (CVV)"
        className="w-full p-3 border border-primary-200 rounded"
        required
      />

      <input type="hidden" name="deviceSessionId" id="deviceIdHiddenFieldName" />
    </div>
  )
}
