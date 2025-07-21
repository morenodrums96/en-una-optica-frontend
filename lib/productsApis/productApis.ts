import { API_URL } from '../api'

type CustomerPriceResponse = {
  customerPrice: number
  priceWithoutVAT: number
}
export async function getCatalogByGroup() {
  try {
    const res = await fetch(`${API_URL}/api/allCatalogs`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!res.ok) throw new Error('Error al cargar los datos del catálogo')

    const data = await res.json()
    return data
  } catch (error: any) {
    console.error('Error al obtener catálogo:', error)
    throw new Error(error.message || 'No se pudo obtener el catálogo')
  }
}

export async function searchConfigurableActive() {
  try {
    const res = await fetch(`${API_URL}/api/configurable-options/searchActive`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!res.ok) throw new Error('Error al cargar los datos de las configuraciones')

    const data = await res.json()
    return data;
  } catch (error: any) {
    console.error('Error al obtener catálogo:', error)
    throw new Error(error.message || 'No se pudo obtener el catálogo')
  }
}

export async function registresProduct(data: any) {
  const res = await fetch(`${API_URL}/api/products/registration`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  const dataa = await res.json()

  if (!res.ok) {
    throw new Error(dataa.message || 'Error al guardar el catálogo')
  }

  return dataa.message
}

export const uploadToS3 = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${API_URL}/api/upload-image`, {
    method: 'POST',
    body: formData,
  })

  const data = await res.json()

  if (!res.ok) throw new Error(data.error || 'Error al subir imagen')

  return data.url // ✅ Devuelve la URL limpia del bucket optimizado
}


export async function getAllProducts() {
  try {
    const res = await fetch(`${API_URL}/api/products`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!res.ok) throw new Error('Error al cargar los productos.')

    const data = await res.json()
    return data;
  } catch (error: any) {
    console.error('Error al obtener catálogo:', error)
    throw new Error(error.message || 'No se pudo obtener el catálogo')
  }
}

export async function getProductSelected(_id: String) {
  try {
    const res = await fetch(`${API_URL}/api/products/selected/${_id}`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!res.ok) throw new Error('Error al cargar el productos.')

    const data = await res.json()
    return data;
  } catch (error: any) {
    console.error('Error al obtener catálogo:', error)
    throw new Error(error.message || 'No se pudo obtener el catálogo')
  }
}

export async function updateProduts(_id: string, data: any) {

  const res = await fetch(`${API_URL}/api/products/update`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ _id, ...data }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Error al actualizar el estado');
  }

  const dataa = await res.json();
  return dataa.message || 'Estado actualizado correctamente';
}


export async function deleteProduct(_id: string) {
  const res = await fetch(`${API_URL}/api/products/${_id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Error al eliminar el producto');
  }

  const dataa = await res.json();
  return dataa.message || 'Producto eliminado correctamente';
}

export async function bestSellers() {
  try {
    const res = await fetch(`${API_URL}/api/products/byFilter?page=1&limit=8&sort=alphabetical`, {
      method: 'GET',
    })

    if (!res.ok) throw new Error('Error al cargar los datos')

    const data = await res.json()
    return data;
  } catch (error: any) {
    console.error('Error al obtener catálogo:', error)
    throw new Error(error.message || 'No se pudo obtener el catálogo')
  }
}

export async function productsByFiler(page = 1, limit = 10) {
  try {
    const res = await fetch(`${API_URL}/api/products/byFilter?page=${page}&limit=${limit}`, {
      method: 'GET',
    })

    if (!res.ok) throw new Error('Error al cargar los datos')

    const data = await res.json()
    return data
  } catch (error: any) {
    console.error('Error al obtener catálogo:', error)
    throw new Error(error.message || 'No se pudo obtener el catálogo')
  }
}

export async function getProductsByIds(ids: string[]) {
  try {
    const res = await fetch(`${API_URL}/api/products/byIds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    })

    if (!res.ok) throw new Error('Error al cargar productos por ID')

    const data = await res.json()
    return data
  } catch (error: any) {
    console.error('Error:', error)
    throw new Error(error.message || 'No se pudieron obtener los productos')
  }
}

export const cleanupTempImages = async (urls: string[]) => {
  for (const url of urls) {
    try {
      await fetch(`/api/delete-image?url=${encodeURIComponent(url)}`, {
        method: 'DELETE',
      })
    } catch (err) {
      console.error('Error al eliminar imagen temporal:', err)
    }
  }
}

export async function getAllProductsByPages(page = 1, limit = 10, filters = {}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...Object.fromEntries(Object.entries(filters).map(([key, val]) => [key, String(val)]))
  })

  const res = await fetch(`${API_URL}/api/products/byPages?${params}`)
  if (!res.ok) throw new Error('Error al cargar los productos')
  return await res.json()
}

export async function putExpense(id: string, data: {
  type: string
  description: string
  amount: number
  date: string
}) {
  const res = await fetch(`${API_URL}/api/expenses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al actualizar el gasto')
  return await res.json()
}

export async function getCustomerPrice(unitCost: number): Promise<CustomerPriceResponse> {
  try {
    const res = await fetch(`${API_URL}/api/products/customerPrice?unitCost=${unitCost}`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!res.ok) throw new Error('Error al calcular el precio.')

    const data = await res.json()
    return {
      customerPrice: data.customerPrice,
      priceWithoutVAT: data.priceWithoutVAT,
    }
  } catch (error: any) {
    console.error('Error al obtener el precio sugerido:', error)
    throw new Error(error.message || 'No se pudo calcular el precio')
  }
}
