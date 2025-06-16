'use client'

import { useEffect } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  Trash2,
  Pencil,
} from 'lucide-react'

type MessageType = 'success' | 'error' | 'updated' | 'deleted'

const iconMap = {
  success: <CheckCircle2 className="h-6 w-6 mt-1 text-green-400" />,
  error: <AlertCircle className="h-6 w-6 mt-1 text-red-400" />,
  updated: <Pencil className="h-6 w-6 mt-1 text-yellow-400" />,
  deleted: <Trash2 className="h-6 w-6 mt-1 text-rose-400" />,
}

const bgMap = {
  success: 'bg-neutral-800/90 text-green-300 border border-green-400/40',
  error: 'bg-neutral-800/90 text-red-300 border border-red-400/40',
  updated: 'bg-neutral-800/90 text-yellow-300 border border-yellow-400/40',
  deleted: 'bg-neutral-800/90 text-rose-300 border border-rose-400/40',
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
      <div className={`backdrop-blur-md shadow-xl rounded-lg px-5 py-4 w-full max-w-sm flex items-start gap-3 pointer-events-auto animate-slide-up ${bgMap[type]}`}>
        {iconMap[type]}
        <div className="flex-1">
          <p className="text-sm leading-tight">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white text-lg leading-none ml-2"
        >
          ×
        </button>
      </div>
    </div>
  )
}
