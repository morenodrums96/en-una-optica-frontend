import { API_URL } from './api'

export type CatalogEntry = {
  _id?: string
  group: string
  label: string
  active: boolean
  createdAt?: string
  updatedAt?: string
}

export async function getCatalogByGroup(group: string): Promise<CatalogEntry[]> {
  try {
    const res = await fetch(`${API_URL}/api/catalogs?group=${group}`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!res.ok) throw new Error('Error al cargar los datos del catálogo')

    const data = await res.json()
    return data.catalogs[group] || []
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function postCatalogEntry(entry: CatalogEntry): Promise<string> {
  const res = await fetch(`${API_URL}/api/catalog/registration`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(entry),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Error al guardar el catálogo')
  }

  return data.message // <-- Devolvemos el mensaje del backend
}


