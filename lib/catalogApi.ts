import { API_URL } from './api'

export type CatalogEntry = {
  _id?: string
  group: string
  label: string
  active: boolean
  createdAt?: string
  updatedAt?: string
  groupDescription?: string
  allowMultiple?: boolean
  enabled?: boolean
}
export type ConfigurableOption = {
  _id?: string
  group: string
  groupDescription: string
  allowMultiple: boolean
  enabled: boolean
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
  } catch (error: any) {
    console.error('Error al obtener catálogo:', error)
    throw new Error(error.message || 'No se pudo obtener el catálogo')
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

export async function updateCatalogEntry(id: string, label: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/catalogs/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ label }),
  })

  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.message || 'Error al actualizar el registro')
  }

  const data = await res.json()
  return data.message || 'Registro actualizado correctamente'
}


export async function toggleCatalogActiveStatus(id: string, currentStatus: boolean): Promise<string> {
  const newStatus = !currentStatus

  const res = await fetch(`${API_URL}/api/catalogs/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ active: newStatus }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Error al actualizar el estado');
  }

  const data = await res.json();
  return data.message || 'Estado actualizado correctamente';
}

export async function getconfigurableOptions(): Promise<ConfigurableOption[]> {
  try {
    const res = await fetch(`${API_URL}/api/configurable-options/search`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!res.ok) throw new Error('Error al cargar los datos del catálogo')

    const data = await res.json()

    // Asegurarse de que sea un arreglo
    return data || []
  } catch (error: any) {
    console.error('Error al obtener catálogo:', error)
    throw new Error(error.message || 'No se pudo obtener el catálogo')
  }
}

