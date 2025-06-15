// components/CatalogModal.tsx
import React from 'react'

type CatalogModalProps = {
  show: boolean
  label: string
  onChange: (value: string) => void
  onClose: () => void
  onSubmit: () => void
  isEditing: boolean
  groupLabel: string
}

export default function CatalogModal({
  show,
  label,
  onChange,
  onClose,
  onSubmit,
  isEditing,
  groupLabel,
}: CatalogModalProps) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-primary-900 p-6 rounded shadow-lg w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4 text-primary-900 dark:text-primary-100">
          {isEditing ? 'Editar registro' : 'Nuevo registro'}: {groupLabel}
        </h2>
        <input
          type="text"
          value={label}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ej. Ovalada"
          className="w-full px-4 py-2 mb-4 rounded border border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-800 text-primary-900 dark:text-primary-100"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-white dark:bg-primary-800 border border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-100 hover:bg-primary-100 dark:hover:bg-primary-700/70 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 rounded bg-white dark:bg-primary-800 border border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-100 hover:bg-primary-100 dark:hover:bg-primary-700/70 transition-colors"
          >
            {isEditing ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
