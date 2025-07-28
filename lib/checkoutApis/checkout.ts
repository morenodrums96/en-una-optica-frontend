'use client'

declare global {
  interface Window {
    OpenPay: any
  }
}

export async function getOpenPayToken(cardData: {
  card_number: string
  holder_name: string
  expiration_month: string
  expiration_year: string
  cvv2: string
}): Promise<{ tokenId: string; deviceSessionId: string }> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || typeof window.OpenPay === 'undefined') {
      return reject(new Error('OpenPay no está disponible en este momento.'))
    }

    const OpenPay = window.OpenPay

    try {
      OpenPay.setId('mlru0v3blmy5qboou3jx')
      OpenPay.setApiKey('sk_856039507564445a9bcf25eb4b95e871')
      OpenPay.setSandboxMode(true)

      OpenPay.token.create(
        cardData,
        (response: any) => {
          const tokenId = response.data.id
          const deviceSessionId = OpenPay.deviceData.setup('checkout-form', 'deviceIdHiddenInputName')
          resolve({ tokenId, deviceSessionId })
        },
        (error: any) => {
          console.error('Error al generar token:', error)
          reject(new Error(error.data?.description || 'Error al generar el token de tarjeta'))
        }
      )
    } catch (e) {
      reject(new Error('Error inesperado al procesar el token.'))
    }
  })
}
