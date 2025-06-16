// components/ConfigurableOptionRow.tsx
'use client'

import { useEffect, useRef } from 'react'
import { Settings } from 'lucide-react'

export type ConfigurableOption = {
  _id?: string
  group: string
  groupDescription: string
  allowMultiple: boolean
  enabled: boolean
}

interface Props {
  item: ConfigurableOption
  openRow: string | null
  setOpenRow: (id: string | null) => void
  onEdit: (item: ConfigurableOption) => void
  onToggleActive: (id: string, enabled: boolean) => void
}

export default function ConfigurableOptionRow({ item, openRow, setOpenRow, onEdit, onToggleActive }: Props) {
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenRow(null)
      }
    }

    if (openRow === item._id) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openRow])

  return (
    <tr className="hover:bg-primary-50 dark:hover:bg-primary-800 relative">
      <td className="px-4 py-3 font-medium text-primary-900 dark:text-primary-100">{item.group}</td>
      <td className="px-4 py-3 text-sm text-primary-700 dark:text-primary-300">{item.groupDescription}</td>
      <td className="px-4 py-3 text-sm">{item.allowMultiple ? 'Sí' : 'No'}</td>
      <td className="px-4 py-3 text-sm">{item.enabled ? 'Sí' : 'No'}</td>
      <td className="px-4 py-3 text-right">
        <button
          onClick={() => setOpenRow(openRow === item._id ? null : item._id || null)}
          className="p-2 rounded hover:bg-primary-100 dark:hover:bg-primary-800"
        >
          <Settings className="h-5 w-5 text-primary-700 dark:text-primary-100" />
        </button>

        {openRow === item._id && (
          <div
            ref={menuRef}
            className="absolute mt-2 right-4 bg-white dark:bg-primary-900 shadow rounded border border-primary-200 dark:border-primary-700 z-50"
          >
            <button
              onClick={() => onEdit(item)}
              className="block w-full px-4 py-2 text-sm text-primary-900 dark:text-white hover:bg-primary-100 dark:hover:bg-primary-800"
            >
              Editar
            </button>
            <button
              onClick={() => onToggleActive(item._id!, item.enabled)}
              className={`block w-full px-4 py-2 text-sm transition-colors ${
                item.enabled
                  ? 'text-black hover:bg-red-100 hover:text-red-700'
                  : 'text-black hover:bg-green-100 hover:text-green-700'
              }`}
            >
              {item.enabled ? 'Desactivar' : 'Reactivar'}
            </button>
          </div>
        )}
      </td>
    </tr>
  )
}
