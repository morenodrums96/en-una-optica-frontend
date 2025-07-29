import { API_URL } from '../api'

type CardData = {
  card_number: string
  holder_name: string
  expiration_month: string
  expiration_year: string
  cvv2: string
}

export async function getOpenPayToken(cardData: CardData): Promise<{ tokenId: string }> {
  try {
    const res = await fetch(`${API_URL}/api/openpay/getOpenPayToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cardData),
    })

    const data = await res.json()

    if (!data.success) {
      throw new Error(data.message || 'No se pudo generar el token')
    }

    return { tokenId: data.tokenId }
  } catch (error: any) {
    console.error('❌ Error al obtener token desde el frontend:', error)
    throw new Error(error.message || 'Error desconocido al generar token')
  }
}
