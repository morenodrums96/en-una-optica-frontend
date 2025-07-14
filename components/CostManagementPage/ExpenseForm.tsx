import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { es } from 'date-fns/locale/es'
import { registerLocale } from 'react-datepicker'
import { getCatalogByGroup, CatalogEntry } from '@/lib/catalogApis/catalogApi'
import { useState, useEffect, ChangeEvent } from 'react'

registerLocale('es', es)

type Props = {
  form: {
    type: string
    description: string
    unitCost: string
    quantity: string
    months: string
    date?: string
  }
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onSubmit: () => void
  isFormValid: boolean
}
export default function ExpenseForm({ form, onChange, onSubmit, isFormValid }: Props) {
  const [expenseOptions, setExpenseOptions] = useState<CatalogEntry[]>([])

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const data = await getCatalogByGroup('expenses')
        setExpenseOptions(data)
      } catch (error) {
        console.error('Error cargando catálogo de expenses:', error)
      }
    }

    fetchCatalog()
  }, [])

  const total =
    !isNaN(Number(form.unitCost)) && !isNaN(Number(form.quantity))
      ? Number(form.unitCost) * Number(form.quantity)
      : 0

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-4  gap-4 p-6 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
    >
      {/* Descripción */}
      <select
        name="description"
        value={form.description}
        onChange={onChange}
        className="p-2 rounded-md border dark:bg-neutral-900 dark:border-neutral-700"
      >
        <option value="">Selecciona una descripción</option>
        {expenseOptions.map((option) => (
          <option key={option._id} value={option.label}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Tipo */}
      <select
        name="type"
        value={form.type}
        onChange={onChange}
        className="p-2 rounded-md border dark:bg-neutral-900 dark:border-neutral-700"
      >
        <option value="Gasto Fijo">Gasto Fijo</option>
        <option value="Gasto Variable">Gasto Variable</option>
        <option value="Gasto Diferidos">Gasto Diferidos</option>
      </select>

      {/* Costo unitario */}
      <input
        name="unitCost"
        type="number"
        value={form.unitCost}
        onChange={onChange}
        placeholder="Costo unitario"
        className="p-2 rounded-md border dark:bg-neutral-900 dark:border-neutral-700"
      />

      {/* Cantidad */}
      <input
        name="quantity"
        type="number"
        value={form.quantity}
        onChange={onChange}
        placeholder="Cantidad"
        className="p-2 rounded-md border dark:bg-neutral-900 dark:border-neutral-700"
      />

      {/* Meses diferidos */}
      <input
        name="months"
        type="number"
        value={form.months}
        onChange={onChange}
        placeholder="Meses diferidos"
        className={`p-2 rounded-md border dark:bg-neutral-900 dark:border-neutral-700 transition-all duration-200 ${form.type === 'Gasto Diferidos' ? '' : 'invisible absolute'
          } ${form.type === 'Gasto Diferidos' && (!form.months || Number(form.months) <= 0) ? 'border-red-500' : ''}`}
      />
      {/* Fecha */}
      <DatePicker
        selected={form.date && !isNaN(Date.parse(form.date)) ? new Date(form.date) : null}
        onChange={(date: Date | null) =>
          onChange({
            target: {
              name: 'date',
              value: date?.toISOString() || '',
            },
          } as any)
        }
        dateFormat="dd MMMM yyyy"
        locale="es"
        placeholderText="Fecha del gasto"
        className="p-2 rounded-md border dark:bg-neutral-900 dark:border-neutral-700"
      />

      {/* Botón */}
      <button
        type="submit"
        disabled={!isFormValid}
        className={`h-10 px-4 rounded-md font-semibold text-white transition ${isFormValid
          ? 'bg-primary-600 hover:bg-primary-700'
          : 'bg-gray-400 cursor-not-allowed'
          }`}
      >
        {form.date ? 'Guardar' : 'Agregar'}
      </button>
    </form>

  )

}
