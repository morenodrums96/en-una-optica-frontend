// components/CostManagementPage/ExpenseRow.tsx

import { Pencil, Trash2 } from 'lucide-react'

type Expense = {
  id: number
  type: 'Gasto Indirecto' | 'Costo Directo'
  description: string
  amount: number
  date: string
}

type Props = {
  expense: Expense
  index: number
  onEdit: (expense: Expense) => void
  onDelete: (id: number) => void
}

export default function ExpenseRow({ expense, index, onEdit, onDelete }: Props) {
  return (
    <tr
      className={`${
        index % 2 === 0 ? 'bg-white dark:bg-neutral-850' : 'bg-neutral-50 dark:bg-neutral-800'
      } border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition`}
    >
      <td className="px-6 py-4 font-medium">{expense.type}</td>
      <td className="px-6 py-4">{expense.description}</td>
      <td className="px-6 py-4 text-right font-semibold text-green-700 dark:text-green-400">
        ${expense.amount.toFixed(2)}
      </td>
      <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">
        {new Date(expense.date).toLocaleDateString('es-MX', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </td>
      <td className="px-6 py-4 text-center space-x-2">
        <button
          onClick={() => onEdit(expense)}
          className="p-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 transition"
          title="Editar gasto"
        >
          <Pencil className="w-5 h-5" />
        </button>

        <button
          onClick={() => onDelete(expense.id)}
          className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 transition"
          title="Eliminar gasto"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </td>
    </tr>
  )
}
