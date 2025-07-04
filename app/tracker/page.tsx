'use client'

import { useState } from 'react'

export default function TrackerPage() {
  const [search, setSearch] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      // Simulación de resultado, reemplaza esto por una llamada real a tu API
      await new Promise((r) => setTimeout(r, 1000))
      if (search === '123456') {
        setResult({
          status: 'En camino',
          tracking: 'MX456789123',
          estimatedDate: '2025-07-10',
        })
      } else {
        setError('No se encontró un pedido con ese número o correo.')
      }
    } catch (err) {
      setError('Ocurrió un error al buscar el pedido.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Rastrea tu pedido</h1>

      <form onSubmit={handleSearch} className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ingresa tu número de pedido o correo electrónico"
          className="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg transition"
        >
          {loading ? 'Buscando...' : 'Buscar Pedido'}
        </button>
      </form>

      {/* Resultado */}
      {result && (
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg shadow-md text-gray-800">
          <h2 className="text-xl font-semibold mb-2">Estado del Pedido</h2>
          <p><strong>Estado:</strong> {result.status}</p>
          <p><strong>Guía de rastreo:</strong> {result.tracking}</p>
          <p><strong>Fecha estimada de entrega:</strong> {result.estimatedDate}</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-6 text-red-600 text-center font-medium">{error}</div>
      )}
    </div>
  )
}
