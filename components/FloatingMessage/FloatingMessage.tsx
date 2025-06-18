"use client"

import { useEffect } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  Trash2,
  Pencil,
} from 'lucide-react'

type MessageType = 'success' | 'error' | 'updated' | 'deleted'

const iconMap = {
  success: <CheckCircle2 className="h-6 w-6 text-green-500" />,
  error: <AlertCircle className="h-6 w-6 text-red-500" />,
  updated: <Pencil className="h-6 w-6 text-yellow-500" />,
  deleted: <Trash2 className="h-6 w-6 text-rose-500" />,
}

const bgMap = {
  success: 'bg-white dark:bg-primary-900 border border-green-200 dark:border-green-500 text-green-700 dark:text-green-300',
  error: 'bg-white dark:bg-primary-900 border border-red-200 dark:border-red-500 text-red-700 dark:text-red-300',
  updated: 'bg-white dark:bg-primary-900 border border-yellow-200 dark:border-yellow-500 text-yellow-700 dark:text-yellow-300',
  deleted: 'bg-white dark:bg-primary-900 border border-rose-200 dark:border-rose-500 text-rose-700 dark:text-rose-300',
}

export default function FloatingMessage({
  message,
  type = 'success',
  onClose,
}: {
  message: string
  type?: MessageType
  onClose: () => void
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3500)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-10 pointer-events-none">
      <div
        className={`w-full max-w-md flex items-center gap-4 p-4 rounded-lg shadow-lg pointer-events-auto animate-fade-in ${bgMap[type]}`}
      >
        <div className="flex-shrink-0">
          {iconMap[type]}
        </div>
        <div className="flex-1 text-sm font-medium leading-tight">
          {message}
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-sm font-bold text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
        >
          ×
        </button>
      </div>
    </div>
  )
}