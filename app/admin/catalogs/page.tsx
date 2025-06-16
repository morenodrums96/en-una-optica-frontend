'use client'
import { useEffect, useState } from 'react'
import { PlusCircle } from 'lucide-react'
import {
  getCatalogByGroup, postCatalogEntry, updateCatalogEntry, toggleCatalogActiveStatus,
  getconfigurableOptions, createConfigurableOption, toggleCatalogActiveStatusConfigurable, getConfigurableOptionById,updateConfigurableOption
} from '@/lib/catalogApis/catalogApi'
import FloatingMessage from '@/components/FloatingMessage'
import CatalogRow from '@/components/catalog/CatalogRow'
import CatalogModal from '@/components/catalog/CatalogModal'
import ConfigurableOptionRow from '@/components/catalog/ConfigurableOptionRow'
import ConfigurableOptionModal from '@/components/catalog/ConfigurableOptionModal'

type CatalogItem = {
  _id?: string
  group: string
  label: string
  active: boolean
}

type Option = {
  name: string;
  description?: string;
  price: string;
  activeQuantity: boolean;
  availableColors?: Color[];
};

export type Color = {
  name: string;
  hex: string;
  enabled: boolean;
};
export type ConfigurableOption = {
  _id?: string
  group: string
  groupDescription: string
  allowMultiple: boolean
  enabled: boolean
}
const tabs = [
  { id: 'faceShape', label: 'Formas de Cara' },
  { id: 'frameShape', label: 'Forma de Armazón' },
  { id: 'frameMaterial', label: 'Material del Armazón' },
  { id: 'color', label: 'Colores del Armazón' },
  { id: 'configurableOptions', label: 'Opciones Configurables' },
]

export default function CatalogsPage() {
  const [activeTab, setActiveTab] = useState('faceShape')
  const [catalogs, setCatalogs] = useState<CatalogItem[]>([])
  const [configurableOptions, setConfigurableOptions] = useState<ConfigurableOption[]>([])
  const [showModal, setShowModal] = useState(false)
  const [label, setLabel] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [openRow, setOpenRow] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showConfigurableModal, setShowConfigurableModal] = useState(false)
  const [editingConfigurableOption, setEditingConfigurableOption] = useState<(ConfigurableOption & { options: Option[] }) | null>(null);


  useEffect(() => {
    if (activeTab === 'configurableOptions') {
      getconfigurableOptions()
        .then(setConfigurableOptions)
        .catch((err) => setErrorMsg(err.message))
    } else {
      getCatalogByGroup(activeTab)
        .then(setCatalogs)
        .catch((err) => setErrorMsg(err.message))
    }
  }, [activeTab])



  const handleSubmit = async () => {
    try {
      if (!label.trim()) {
        setErrorMsg('La etiqueta no puede estar vacía')
        return
      }
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


  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus
      const message = await toggleCatalogActiveStatus(id, currentStatus)

      setCatalogs(prev =>
        prev.map(item =>
          item._id === id ? { ...item, active: newStatus } : item
        )
      )

      setSuccessMsg(message)
    } catch (err: any) {
      setErrorMsg(err.message)
    }
  }

  const handleToggleActiveConfigurable = async (id: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus
      const message = await toggleCatalogActiveStatusConfigurable(id, currentStatus)

      // ✅ ACTUALIZA EL ESTADO LOCAL
      setConfigurableOptions(prev =>
        prev.map(item =>
          item._id === id ? { ...item, enabled: newStatus } : item
        )
      )

      setSuccessMsg(message)
    } catch (err: any) {
      setErrorMsg(err.message)
    }
  }


  const handleEdit = (item: CatalogItem) => {
    setIsEditing(true)
    setEditingId(item._id!)
    setLabel(item.label)
    setShowModal(true)
  }

  const handleEditConfigurable = async (item: ConfigurableOption) => {
    try {
      const fullData = await getConfigurableOptionById(item._id!);
      setEditingConfigurableOption(fullData);
      setShowConfigurableModal(true);
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return

    try {
      const message = await updateCatalogEntry(editingId, label)

      setCatalogs(prev =>
        prev.map(item =>
          item._id === editingId ? { ...item, label } : item
        )
      )

      setSuccessMsg(message)
      setShowModal(false)
      setLabel('')
      setEditingId(null)
      setIsEditing(false)
    } catch (err: any) {
      setErrorMsg(err.message)
    }
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
            onClick={() => {
              if (activeTab === 'configurableOptions') {
                setShowConfigurableModal(true)
              } else {
                setShowModal(true)
              }
            }}
            className="flex items-center gap-2 bg-primary-400 hover:bg-primary-500 text-white px-6 py-2 rounded-md text-sm transition-colors"
          >
            <PlusCircle className="h-5 w-5" />
            Agregar
          </button>
        </div>

      </div>

      <div className="bg-white dark:bg-primary-900 p-4 rounded shadow border border-primary-100 dark:border-primary-700">
        {catalogs.length === 0 ? (
          <p className="text-sm text-primary-500 dark:text-primary-300">
            No hay {activeTab === 'configurableOptions' ? 'opciones configurables' : 'elementos'} registrados aún.
          </p>

        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-100">
              <tr>
                {activeTab === 'configurableOptions' ? (
                  <>
                    <th className="px-4 py-3">Grupo</th>
                    <th className="px-4 py-3">Descripción</th>
                    <th className="px-4 py-3">Permite múltiples</th>
                    <th className="px-4 py-3">Activo</th>
                    <th className="px-4 py-3 w-12">Acciones</th>

                  </>
                ) : (
                  <>
                    <th className="px-4 py-3">Etiqueta</th>
                    <th className="px-4 py-3">Activo</th>
                    <th className="px-4 py-3 w-12">Acciones</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-primary-100 dark:divide-primary-800">
              {activeTab === 'configurableOptions'
                ? configurableOptions.map((item) => (
                  <ConfigurableOptionRow
                    key={item._id}
                    item={item}
                    openRow={openRow}
                    setOpenRow={setOpenRow}
                    onEdit={handleEditConfigurable}
                    onToggleActive={handleToggleActiveConfigurable}
                  />
                ))
                : catalogs.map((item) => (
                  <CatalogRow
                    key={item._id}
                    item={item}
                    openRow={openRow}
                    setOpenRow={setOpenRow}
                    onEdit={handleEdit}
                    onToggleActive={handleToggleActive}
                  />
                ))}
            </tbody>


          </table>
        )}
      </div>

      <CatalogModal
        show={showModal}
        label={label}
        onChange={setLabel}
        onClose={() => {
          setShowModal(false)
          setLabel('')
          setIsEditing(false)
          setEditingId(null)
        }}
        onSubmit={isEditing ? handleUpdate : handleSubmit}
        isEditing={isEditing}
        groupLabel={tabs.find(t => t.id === activeTab)?.label || ''}
      />
      <ConfigurableOptionModal
        show={showConfigurableModal}
        onClose={() => {
          setShowConfigurableModal(false);
          setEditingConfigurableOption(null);
        }}
        onSubmit={async (group, description, allowMultiple, options) => {
          try {
            if (editingConfigurableOption?._id) {
              // ✅ EDITAR EXISTENTE
              const message = await updateConfigurableOption(editingConfigurableOption._id, {
                group,
                groupDescription: description,
                allowMultiple,
                enabled: true,
                options,
              });

              setSuccessMsg(message);
            } else {
              // ✅ CREAR NUEVO
              const message = await createConfigurableOption({
                group,
                groupDescription: description,
                allowMultiple,
                enabled: true,
                options,
              });

              setSuccessMsg(message);
            }

            setShowConfigurableModal(false);
            setEditingConfigurableOption(null);
            const updatedOptions = await getconfigurableOptions();
            setConfigurableOptions(updatedOptions);
          } catch (err: any) {
            setErrorMsg(err.message);
          }
        }}

        defaultData={editingConfigurableOption || undefined}
      />



    </main>
  )
}
