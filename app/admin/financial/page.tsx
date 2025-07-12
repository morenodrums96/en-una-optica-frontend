'use client'

import { useEffect, useState } from 'react'
import {
  getFinanceSettings,
  saveFinanceSettings,
} from '@/lib/financialApis/financialApis'

export default function DashboardPage() {
  const [margin, setMargin] = useState<number | ''>('')
  const [projectedSales, setProjectedSales] = useState<number | ''>('')
  const [breakEvenPoint, setBreakEvenPoint] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Cargar configuración desde el backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getFinanceSettings()
        setMargin(data[0]?.desiredMargin ?? '')
        setProjectedSales(data[0]?.projectedMonthlySales ?? '')
        setBreakEvenPoint(data[0]?.breakEvenSales ?? null)
      } catch (err) {
        console.error('Error al cargar configuración:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await saveFinanceSettings({
        desiredMargin: typeof margin === 'number' ? margin : 0,
        projectedMonthlySales: typeof projectedSales === 'number' ? projectedSales : 0,
      })

      console.log('✅ Configuración guardada exitosamente')
      // Aquí puedes usar FloatingMessage('guardado con éxito')
    } catch (err) {
      console.error('❌ Error al guardar la configuración:', err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white text-black dark:bg-zinc-900 dark:text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Finanzas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl">
        <div>
          <label className="block mb-1 font-semibold">Utilidad deseada (%)</label>
          <input
            type="number"
            inputMode="decimal"
            value={margin}
            onChange={(e) => {
              const value = e.target.value
              if (value === '') return setMargin('')
              const parsed = parseFloat(value)
              setMargin(isNaN(parsed) ? '' : parsed)
            }}
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-black dark:text-white"
            placeholder="Ej. 150"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Ventas estimadas (armazones)</label>
          <input
            type="number"
            inputMode="numeric"
            value={projectedSales}
            onChange={(e) => {
              const value = e.target.value
              if (value === '') return setProjectedSales('')
              const parsed = parseInt(value)
              setProjectedSales(isNaN(parsed) ? '' : parsed)
            }}
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-black dark:text-white"
            placeholder="Ej. 30"
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block mb-1 font-semibold">Punto de equilibrio (ventas mínimas)</label>
          <input
            type="text"
            value={loading ? 'Cargando...' : breakEvenPoint ?? 'No disponible'}
            disabled
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className={`mt-8 px-6 py-2 rounded-lg transition ${isSaving
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
      >
        {isSaving ? 'Guardando...' : 'Guardar configuración'}
      </button>
    </div>
  )
}
