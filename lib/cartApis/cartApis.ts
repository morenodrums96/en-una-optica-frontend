// /lib/cartApis/cart.ts
import { API_URL } from '../api'

export async function getCartByAnonymousId(anonymousId: string) {
  const res = await fetch(`${API_URL}/api/cart?anonymousId=${anonymousId}`, {
    method: 'GET',
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Error al cargar el carrito')
  return res.json()
}

export async function addToCartByAnonymousId(item: any, anonymousId: string) {
  const res = await fetch(`${API_URL}/api/cart/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item, anonymousId }),
  })
  if (!res.ok) throw new Error('Error al agregar al carrito')
  return res.json()
}

export async function removeFromCartByAnonymousId(
  data: { productId: string; selectedOptions?: any; anonymousId: string }
) {
  const res = await fetch(`${API_URL}/api/cart/remove`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error('Error al eliminar del carrito')
  return await res.json()
}

export async function updateQuantityByAnonymousId(
  data: { productId: string; selectedOptions?: any; quantity: number; anonymousId: string }
) {
  const res = await fetch(`${API_URL}/api/cart/updateQuantity`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errorData = await res.json()
    // Aquí agregamos un throw con información adicional
    const err = new Error(errorData.message || 'Error al actualizar la cantidad en el carrito') as any
    err.isStockError = errorData.message?.includes('disponibles en stock') || false
    throw err
  }

  return await res.json()
}