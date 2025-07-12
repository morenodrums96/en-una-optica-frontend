// components/CostManagementPage/ExpenseTable.tsx

import { Pencil, Trash2 } from 'lucide-react'
import type { Expense } from '@/types/expense'

interface Props {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}

export default function ExpenseTable({ expenses, onEdit, onDelete }: Props) {
  const total = expenses.reduce((sum, e) => sum + e.unitCost * e.quantity, 0)

  return (
    <div className="overflow-x-auto rounded-xl shadow-md">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-primary-100 dark:bg-neutral-900 text-primary-800 dark:text-primary-100 uppercase tracking-wider text-xs border-b border-neutral-200 dark:border-neutral-700">
          <tr>
            <th className="px-6 py-3">Tipo</th>
            <th className="px-6 py-3">Descripción</th>
            <th className="px-6 py-3 text-right">Costo unitario</th>
            <th className="px-6 py-3 text-right">Cantidad</th>
            <th className="px-6 py-3 text-right">Total</th>
            <th className="px-6 py-3">Fecha del gasto</th>
            <th className="px-6 py-3">Registrado el</th>
            <th className="px-6 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length > 0 ? (
            expenses.map((e, i) => (
              <tr
                key={e._id}
                className={`${i % 2 === 0
                    ? ''
                    : 'bg-neutral-100 dark:bg-neutral-800'

                  } border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-150`}
              >
                <td className="px-6 py-4 font-medium text-neutral-800 dark:text-neutral-200">{e.type}</td>
                <td className="px-6 py-4 text-neutral-700 dark:text-neutral-300">{e.description}</td>
                <td className="px-6 py-4 text-right text-neutral-800 dark:text-neutral-200">
                  ${e.unitCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 text-right text-neutral-800 dark:text-neutral-200">
                  {e.quantity}
                </td>
                <td className="px-6 py-4 text-right font-semibold text-green-700 dark:text-green-400">
                  ${(e.unitCost * e.quantity).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">
                  {new Date(e.date).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">
                  {e.createdAt
                    ? new Date(e.createdAt).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                    : '—'}
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button
                    onClick={() => onEdit(e)}
                    className="p-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-950 text-blue-600 dark:text-blue-400 transition-colors"
                    title="Editar gasto"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(e._id!)}
                    className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-950 text-red-600 dark:text-red-400 transition-colors"
                    title="Eliminar gasto"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={8}
                className="text-center p-8 text-neutral-400 dark:text-neutral-500 italic"
              >
                No hay gastos registrados para el período seleccionado.
              </td>
            </tr>
          )}
        </tbody>
        {expenses.length > 0 && (
          <tfoot className="bg-primary-100 dark:bg-neutral-900 text-primary-800 dark:text-primary-100 border-t border-neutral-300 dark:border-neutral-700">
            <tr>
              <td className="px-6 py-4 font-bold" colSpan={4}>
                Total
              </td>
              <td className="px-6 py-4 text-right font-bold text-green-800 dark:text-green-300">
                ${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </td>
              <td colSpan={3}></td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>

  )
}
