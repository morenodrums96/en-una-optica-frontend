// lib/expensesApis/expensesApis.ts
import { API_URL } from '../api'

export async function getExpenses() {
    const res = await fetch(`${API_URL}/api/expenses`, {
        method: 'GET',
        credentials: 'include',
    })
    if (!res.ok) throw new Error('Error al cargar los gastos.')
    return await res.json()
}

export async function postExpenses(expense: {
    type: string
    description: string
    unitCost: number
    quantity: number
    amount: number
    date: string
}) {
    const res = await fetch(`${API_URL}/api/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(expense),
    })
    if (!res.ok) throw new Error('Error al guardar el gasto.')
    return await res.json()
}


export async function deleteExpenses(id: string) {
    const res = await fetch(`${API_URL}/api/expenses/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    })
    if (!res.ok) throw new Error('Error al eliminar el gasto.')
    return await res.json()
}
export async function putExpense(id: string, data: {
    type: string
    description: string
    unitCost: number
    quantity: number
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
