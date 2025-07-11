import { ChangeEvent } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { es } from 'date-fns/locale/es'
import { registerLocale } from 'react-datepicker'

registerLocale('es', es)

type Props = {
  form: {
    type: string
    description: string
    unitCost: string
    quantity: string
    date?: string
  }
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onSubmit: () => void
  isFormValid: boolean
}

export default function ExpenseForm({ form, onChange, onSubmit, isFormValid }: Props) {
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
  className="grid grid-cols-1 md:grid-cols-6 gap-4 p-6 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
>
  {/* Tipo */}
  <select
    name="type"
    value={form.type}
    onChange={onChange}
    className="p-2 rounded-md border dark:bg-neutral-900 dark:border-neutral-700"
  >
    <option value="Gasto Indirecto">Gasto Indirecto</option>
    <option value="Costo Directo">Costo Directo</option>
  </select>

  {/* Descripción */}
  <input
    name="description"
    type="text"
    value={form.description}
    onChange={onChange}
    placeholder="Descripción"
    className="p-2 rounded-md border dark:bg-neutral-900 dark:border-neutral-700"
  />

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

  {/* Fecha del gasto + Botón + Total */}
  <div className="md:col-span-2 flex items-center gap-3">
    <DatePicker
      selected={form.date ? new Date(form.date) : null}
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

    <button
      type="submit"
      disabled={!isFormValid}
      className={`h-10 px-4 rounded-md font-semibold text-white transition ${
        isFormValid ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-400 cursor-not-allowed'
      }`}
    >
      {form.date ? 'Guardar' : 'Agregar'}
    </button>

    {form.unitCost && form.quantity && (
      <span className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
        Total: <strong>${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong>
      </span>
    )}
  </div>
</form>

  )
}
