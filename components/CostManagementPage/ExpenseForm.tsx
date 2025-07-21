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
    affectsStock?: boolean // <-- nuevo campo
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
      className="flex flex-wrap items-center gap-2 p-2 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
    >
      {/* Descripción */}
      <select
        name="description"
        value={form.description}
        onChange={onChange}
        className="p-2 rounded-md border dark:bg-neutral-900 dark:border-neutral-700 w-52"
      >
        <option value="">Seleccione una opcion</option>
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
        className="p-2 rounded-md border dark:bg-neutral-900 dark:border-neutral-700 w-44"
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
        className="p-2 rounded-md border dark:bg-neutral-900 dark:border-neutral-700 w-36"
      />

      {/* Cantidad */}
      <input
        name="quantity"
        type="number"
        value={form.quantity}
        onChange={onChange}
        placeholder="Cantidad"
        className="p-2 rounded-md border dark:bg-neutral-900 dark:border-neutral-700 w-36"
      />

      {/* Meses diferidos */}
      <input
        name="months"
        type="number"
        value={form.months}
        onChange={onChange}
        placeholder="Meses diferidos"
        className={`p-2 rounded-md border dark:bg-neutral-900 dark:border-neutral-700 w-36 transition-all duration-200 ${form.type === 'Gasto Diferidos' ? '' : 'invisible absolute'} ${form.type === 'Gasto Diferidos' && (!form.months || Number(form.months) <= 0) ? 'border-red-500' : ''}`}
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
        className="p-2 rounded-md border dark:bg-neutral-900 dark:border-neutral-700 w-36"
      />

      {/* Switch de stock */}
      <div className="flex items-center gap-1 text-sm font-medium text-neutral-800 dark:text-neutral-200">
        <span>Inventario / Stock</span>
        <div className="relative inline-block w-14 h-6">
          <input
            type="checkbox"
            id="affectsStock"
            name="affectsStock"
            checked={!!form.affectsStock}
            onChange={(e) =>
              onChange({
                target: {
                  name: 'affectsStock',
                  value: e.target.checked,
                },
              } as any)
            }
            className="peer opacity-0 w-0 h-0"
          />
          <label
            htmlFor="affectsStock"
            className="absolute inset-0 cursor-pointer rounded-full bg-neutral-400 peer-checked:bg-primary-400 transition-colors duration-300
               peer-checked:hover:bg-primary-600
               before:content-[''] before:absolute before:left-1 before:top-1 before:bg-white before:w-4 before:h-4 before:rounded-full
               before:transition-transform before:duration-300 peer-checked:before:translate-x-6"
          />
        </div>
      </div>

      {/* Botón */}
      <button
        type="submit"
        disabled={!isFormValid}
        className={`h-9 px-4 text-sm rounded-md font-semibold text-white transition ${isFormValid
          ? 'bg-primary-600 hover:bg-primary-700'
          : 'bg-gray-400 cursor-not-allowed'
          }`}
      >
        {form.date ? 'Guardar' : 'Agregar'}
      </button>
    </form>

  )

}
