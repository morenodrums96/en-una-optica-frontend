import { API_URL } from '../api'
type SkydropxAddress = {
  country_code: string
  postal_code: string
  area_level1: string
  area_level2: string
  area_level3: string
}

export function getOpenPayToken(cardData: {
  card_number: string
  holder_name: string
  expiration_month: string
  expiration_year: string
  cvv2: string
}): Promise<{ tokenIdOpenPay: string }> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.OpenPay) {
      return reject(new Error('OpenPay no está disponible en este entorno.'))
    }

    try {
      // Crear token con Openpay.js
      window.OpenPay.token.create(cardData, (response: any) => {
        const tokenIdOpenPay = response.data.id
        resolve({ tokenIdOpenPay })
      }, (error: any) => {
        const message = error.data?.description || error.message || 'Error al generar el token con Openpay.'
        reject(new Error(message))
      })
    } catch (err) {
      reject(new Error('No se pudo crear el token: ' + err))
    }
  })
}

export async function createOrGetCustomer(data: {
  anonymousId: string
  name: string
  lastName: string
  email: string
  phone: string
  address: {
    postal_code: string
    state: string
    city: string
    neighborhood: string
    street: string
    externalNumber: string
    internalNumber: string
    aditionalReferents: string
    country_code: string
  }
}) {
  const res = await fetch(`${API_URL}/api/payments/create-customer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'No se pudo crear el cliente')
  }

  return res.json() // { id, name, ... }
}

export async function createCharge(data: {
  anonymousId: string
  tokenIdOpenPay: string
}) {
  const res = await fetch(`${API_URL}/api/payments/create-charge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'No se pudo generar el cargo')
  }

  return res.json();
}
