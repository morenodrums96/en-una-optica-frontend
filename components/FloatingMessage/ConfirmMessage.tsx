'use client'

import { ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'

export default function ConfirmMessage({
  message,
  onConfirm,
  onCancel
}: {
  message: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-[9998] bg-black/40 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white dark:bg-primary-900 border border-primary-200 dark:border-primary-700 shadow-xl rounded-lg p-6 w-full max-w-md animate-fade-in">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-6 w-6 text-yellow-400 mt-1" />
          <div className="flex-1">
            <p className="text-sm text-gray-800 dark:text-gray-200 leading-tight">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 dark:bg-primary-800 text-sm rounded-md hover:bg-gray-300 dark:hover:bg-primary-700"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
