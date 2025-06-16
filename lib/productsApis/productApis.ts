import { API_URL } from '../api'


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