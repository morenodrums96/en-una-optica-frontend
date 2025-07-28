import { API_URL } from '../api'

export async function getWishlistByAnonymousId(anonymousId: string) {
  try {
    const res = await fetch(`${API_URL}/api/wishlist?anonymousId=${anonymousId}`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!res.ok) throw new Error('Error al cargar los datos del wishlist')

    const data = await res.json()
    return data
  } catch (error: any) {
    console.error('Error al obtener wishlist:', error)
    throw new Error(error.message || 'No se pudo obtener el wishlist')
  }
}

export async function toggleWishlistByAnonymousId(productId: string, anonymousId: string): Promise<{ productIds: string[] }> {
  try {
    const res = await fetch(`${API_URL}/api/wishlist/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, anonymousId }),
    })

    if (!res.ok) throw new Error('Error al actualizar el wishlist')

    return await res.json()
  } catch (error: any) {
    console.error('Error en toggleWishlist:', error)
    throw new Error(error.message || 'No se pudo actualizar el wishlist')
  }
}


export async function getWishlistProductsByAnonymousId(anonymousId: string) {
  const res = await fetch(`${API_URL}/api/wishlist/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ anonymousId }),
  })

  if (!res.ok) throw new Error('Error al obtener productos del wishlist')

  const data = await res.json()
  return data.products // array de productos completos
}