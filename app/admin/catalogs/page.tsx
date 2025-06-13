'use client'
import { useEffect, useRef, useState } from 'react'
import { PlusCircle, Settings } from 'lucide-react'
import { getCatalogByGroup, postCatalogEntry } from '@/lib/catalogApi'
import FloatingMessage from '@/components/FloatingMessage'

type CatalogItem = {
  _id?: string
  group: string
  label: string
  active: boolean
}

const tabs = [
  { id: 'faceShape', label: 'Formas de Cara' },
  { id: 'frameShape', label: 'Formas de Armazón' },
  { id: 'frameMaterial', label: 'Materiales' },
  { id: 'color', label: 'Colores' },
  { id: 'configurableOptions', label: 'Opciones Configurables' },
]

export default function CatalogsPage() {
  const [activeTab, setActiveTab] = useState('faceShape')
  const [catalogs, setCatalogs] = useState<CatalogItem[]>([])
  const [showModal, setShowModal] = useState(false)
  const [label, setLabel] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [openRow, setOpenRow] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    getCatalogByGroup(activeTab)
      .then(setCatalogs)
      .catch((err) => setErrorMsg(err.message))
  }, [activeTab])

  const handleSubmit = async () => {
    try {
      const message = await postCatalogEntry({
        group: activeTab,
        label,
        active: true,
      })

      setCatalogs((prev) => [...prev, { group: activeTab, label, active: true }])
      setLabel('')
      setShowModal(false)
      setSuccessMsg(message)
    } catch (err: any) {
      setErrorMsg(err.message)
    }
  }

  const handleDelete = async (_id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/catalogs/${_id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (!res.ok) throw new Error('Error al eliminar')

      setCatalogs((prev) => prev.filter(item => item._id !== _id))
      setSuccessMsg('Eliminado correctamente')
    } catch (err: any) {
      setErrorMsg(err.message)
    }
  }

  const handleEdit = (item: CatalogItem) => {
    console.log('Editar item:', item)
  }

  return (
    <main className="flex-1 p-6 ml-13 bg-primary-50 dark:bg-primary-950 transition-colors duration-300">
      {successMsg && (
        <FloatingMessage message={successMsg} type="success" onClose={() => setSuccessMsg('')} />
      )}
      {errorMsg && (
        <FloatingMessage message={errorMsg} type="error" onClose={() => setErrorMsg('')} />
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-primary-900 dark:text-primary-100">Catálogos</h2>
        <p className="text-sm text-primary-700 dark:text-primary-300">
          Administra los catálogos del sistema como formas de cara, colores, materiales, etc.
        </p>
      </div>

      <div className="flex justify-between items-center mb-4 border-b border-primary-200 dark:border-primary-800 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t ${activeTab === tab.id ? 'bg-primary-300 text-primary-950 dark:bg-primary-700 dark:text-white' : 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100 hover:bg-primary-200 dark:hover:bg-primary-800'} transition-colors`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-2 sm:mt-0">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary-400 hover:bg-primary-500 text-white px-6 py-2 rounded-md text-sm transition-colors"
          >
            <PlusCircle className="h-5 w-5" />
            Agregar
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-primary-900 p-4 rounded shadow border border-primary-100 dark:border-primary-700">
        {catalogs.length === 0 ? (
          <p className="text-sm text-primary-500 dark:text-primary-300">No hay registros aún.</p>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-100">
              <tr>
                <th className="px-4 py-3">Etiqueta</th>
                <th className="px-4 py-3">Activo</th>
                <th className="px-4 py-3 w-12">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100 dark:divide-primary-800">
              {catalogs.map((item) => (
                <tr key={item._id} className="hover:bg-primary-50 dark:hover:bg-primary-800 relative">
                  <td className="px-4 py-3">{item.label}</td>
                  <td className="px-4 py-3">{item.active ? 'Sí' : 'No'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setOpenRow(openRow === item._id ? null : item._id || null)}
                      className="p-2 rounded hover:bg-primary-100 dark:hover:bg-primary-800"
                    >
                      <Settings className="h-5 w-5 text-primary-700 dark:text-primary-100" />
                    </button>
                    {openRow === item._id && (
                      <div className="absolute mt-2 right-4 bg-white dark:bg-primary-900 shadow rounded border border-primary-200 dark:border-primary-700 z-50">
                        <button
                          onClick={() => handleEdit(item)}
                          className="block w-full px-4 py-2 text-sm text-primary-900 dark:text-white hover:bg-primary-100 dark:hover:bg-primary-800"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(item._id!)}
                          className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-900 dark:text-red-400"
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-primary-900 p-6 rounded shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-primary-900 dark:text-primary-100">
              Nuevo registro: {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ej. Ovalada"
              className="w-full px-4 py-2 mb-4 rounded border border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-800 text-primary-900 dark:text-primary-100"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-primary-700 text-primary-900 dark:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded bg-primary-500 text-white hover:bg-primary-600"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
