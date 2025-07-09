// components/products/ToggleSwitches.tsx
import React from 'react'

type Props = {
  formData: {
    frond: boolean
    canModifyQuantity: boolean
    iva: boolean
  }
  onToggle: (field: 'frond' | 'canModifyQuantity' | 'iva') => void
}

export default function ToggleSwitches({ formData, onToggle }: Props) {
  const switches = [
    {
      label: 'Visible para el cliente',
      field: 'frond',
      value: formData.frond,
    },
    {
      label: 'Cantidad modificable',
      field: 'canModifyQuantity',
      value: formData.canModifyQuantity,
    },
    {
      label: 'Aplicar IVA',
      field: 'iva',
      value: formData.iva,
    },
  ] as const

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {switches.map((s) => (
        <div key={s.field} className="flex items-center justify-between px-4 py-2 bg-white dark:bg-primary-700 rounded shadow border">
          <span className="text-sm text-gray-700 dark:text-white">{s.label}</span>
          <button
            type="button"
            onClick={() => onToggle(s.field)}
            className={`w-10 h-6 flex items-center bg-gray-300 rounded-full p-1 transition-colors duration-300 ${
              s.value ? 'bg-primary-600' : ''
            }`}
          >
            <span
              className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-300 ${
                s.value ? 'translate-x-4' : ''
              }`}
            ></span>
          </button>
        </div>
      ))}
    </div>
  )
}
