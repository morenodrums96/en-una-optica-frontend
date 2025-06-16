// components/CatalogModal.tsx
'use client'

import React, { useState, useEffect } from 'react'

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
  const [error, setError] = useState(false)

  useEffect(() => {
    if (show) {
      setError(false) // Limpiar errores cada vez que se abre el modal
    }
  }, [show])

  const handleSubmit = () => {
    if (label.trim() === '') {
      setError(true)
      return
    }
    setError(false)
    onSubmit()
  }

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
          className={`w-full px-4 py-2 mb-1 rounded border ${error
              ? 'border-red-500'
              : 'border-primary-300 dark:border-primary-700'
            } bg-primary-50 dark:bg-primary-800 text-primary-900 dark:text-primary-100`}
        />
        {error && (
          <p className="text-red-500 text-sm mb-3">
            Este campo no puede estar vacío.
          </p>
        )}
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-white dark:bg-primary-800 border border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-100 hover:bg-primary-100 dark:hover:bg-primary-700/70 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={label.trim() === ''}
            className={`px-4 py-2 rounded border transition-colors
    ${label.trim() === ''
                ? 'bg-gray-300 dark:bg-primary-700/50 text-gray-500 cursor-not-allowed'
                : 'bg-white dark:bg-primary-800 text-primary-700 dark:text-primary-100 hover:bg-primary-100 dark:hover:bg-primary-700/70'
              }
    border-primary-300 dark:border-primary-700`}
          >
            {isEditing ? 'Actualizar' : 'Guardar'}
          </button>

        </div>
      </div>
    </div>
  )
}
