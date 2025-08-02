import { API_URL } from '../api'


export async function getAllOrders() {

    const res = await fetch(`${API_URL}/api/orders`, {
        method: 'GET',
        credentials: 'include',
    })

    if (!res.ok) throw new Error('Error al cargar las ordenes.')
    return await res.json()
}


export async function getOrderById(id: String) {
    const res = await fetch(`${API_URL}/api/orders/${id}`, {
        method: 'GET',
        cache: 'no-store', 
    });

    if (!res.ok) throw new Error('Error al cargar las ordenes.')
    return await res.json()
}