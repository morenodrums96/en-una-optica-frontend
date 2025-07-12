import { API_URL } from '../api'

export async function getFinanceSettings() {
  const res = await fetch(`${API_URL}/api/settings/finance`, {
    method: 'GET',
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Error al cargar la configuración financiera.')
  return await res.json()
}

export async function saveFinanceSettings(data: {
  desiredMargin: number
  projectedMonthlySales: number
}) {
  const res = await fetch(`${API_URL}/api/settings/finance`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al guardar configuración financiera.')
  return await res.json()
}
