'use client'

import { useState, useRef, useEffect } from 'react'
import { Settings, PlusCircle } from 'lucide-react'
import ProductFormModal from '@/components/products/ProductFormModal'
import { getCatalogByGroup, searchConfigurableActive, registresProduct } from '@/lib/productsApis/productApis'

const mockData = Array.from({ length: 45 }, (_, i) => ({
  id: i + 1,
  imagen: `imagen ${i + 1}`,
  nombre: `Producto ${i + 1}`,
  categoria: `Categoría ${i % 3 + 1}`,
  marca: `Marca ${i % 5 + 1}`,
  modelo: `Modelo ${i + 1}`,
  fecha: `2024-06-${(i % 30) + 1}`,
}))

const ITEMS_PER_PAGE = 15

export default function ProductosPage() {
  const [showModal, setShowModal] = useState(false)
  const [catalogs, setCatalogs] = useState({
    frameMaterial: [],
    faceShape: [],
    frameShape: [],
    colors: []
  })

  const [configurableOptions, setConfigurableOptions] = useState([])
  const [page, setPage] = useState(0)
  const [openRow, setOpenRow] = useState<number | null>(null)

  const totalPages = Math.ceil(mockData.length / ITEMS_PER_PAGE)
  const currentItems = mockData.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)

  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1)
  }

  const handlePrev = () => {
    if (page > 0) setPage(page - 1)
  }

  useEffect(() => {
    if (showModal) {
      loadCatalogs()
    }
  }, [showModal])

  const loadCatalogs = async () => {
    try {
      const catalogData = await getCatalogByGroup()
      const options = await searchConfigurableActive()

      const groupMap = (group: string) => catalogData.filter((c: any) => c.group === group)

      setCatalogs({
        frameMaterial: groupMap('frameMaterial'),
        faceShape: groupMap('faceShape'),
        frameShape: groupMap('frameShape'),
        colors: groupMap('color'), // ✅ CORREGIDO aquí
      })

      setConfigurableOptions(options)
    } catch (error) {
      console.error('Error cargando catálogos:', error)
    }
  }
  const handleSaveProduct = async (data: any) => {
    try {
      await registresProduct(data)
      alert('Producto guardado con éxito ✅')
      setShowModal(false)
      // Aquí podrías recargar productos si estás usando datos reales
    } catch (error: any) {
      alert('Error al guardar el producto: ' + error.message)
    }
  }

  return (
    <main className="flex-1 p-6 ml-13 bg-primary-50 dark:bg-primary-950 transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-primary-900 dark:text-primary-100">Productos</h2>
          <p className="text-sm text-primary-700 dark:text-primary-300">
            Aquí puedes agregar, modificar o eliminar productos del inventario.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary-400 hover:bg-primary-500 text-white px-4 py-2 rounded-md text-sm transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          Agregar producto
        </button>

        <ProductFormModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          catalogs={catalogs}
          configurableOptions={configurableOptions}
          onSubmit={handleSaveProduct} // ⬅️ aquí
        />

      </div>

      <div className="overflow-hidden rounded-lg border border-primary-200 dark:border-primary-800 bg-white dark:bg-primary-900 shadow">
        <table className="w-full text-sm text-left">
          <thead className="bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-100">
            <tr>
              <th className="px-4 py-3">Imagen</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3 hidden md:table-cell">Marca</th>
              <th className="px-4 py-3 hidden md:table-cell">Modelo</th>
              <th className="px-4 py-3 hidden md:table-cell">Fecha de alta</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-100 dark:divide-primary-800">
            {currentItems.map((item) => {
              const buttonRef = useRef<HTMLButtonElement | null>(null)
              const menuRef = useRef<HTMLDivElement | null>(null)

              useEffect(() => {
                const handleClickOutside = (event: MouseEvent) => {
                  const target = event.target as Node
                  if (
                    menuRef.current &&
                    !menuRef.current.contains(target) &&
                    buttonRef.current &&
                    !buttonRef.current.contains(target)
                  ) {
                    setOpenRow(null)
                  }
                }

                document.addEventListener('mousedown', handleClickOutside)
                return () => {
                  document.removeEventListener('mousedown', handleClickOutside)
                }
              }, [])

              return (
                <tr key={item.id} className="hover:bg-primary-50 dark:hover:bg-primary-800">
                  <td className="px-4 py-3">{item.imagen}</td>
                  <td className="px-4 py-3">{item.nombre}</td>
                  <td className="px-4 py-3">{item.categoria}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{item.marca}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{item.modelo}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{item.fecha}</td>
                  <td className="px-4 py-3 text-right relative">
                    <button
                      ref={buttonRef}
                      onClick={() => setOpenRow(openRow === item.id ? null : item.id)}
                      className="p-2 rounded hover:bg-primary-100 dark:hover:bg-primary-800"
                    >
                      <Settings className="h-5 w-5 text-primary-700 dark:text-primary-100" />
                    </button>

                    {openRow === item.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 mt-0 w-36 rounded-md shadow-md dark:shadow-primary-800/30 bg-white dark:bg-primary-900 border border-primary-100 dark:border-primary-700 z-50"
                      >
                        <ul className="py-1 text-sm text-primary-900 dark:text-primary-100">
                          <li>
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-primary-100 dark:hover:bg-primary-800"
                              onClick={() => {
                                alert(`Editar producto ${item.nombre}`)
                                setOpenRow(null)
                              }}
                            >
                              Editar
                            </button>
                          </li>
                          <li>
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
                              onClick={() => {
                                alert(`Eliminar producto ${item.nombre}`)
                                setOpenRow(null)
                              }}
                            >
                              Eliminar
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrev}
          disabled={page === 0}
          className="px-4 py-2 rounded bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-100 hover:bg-primary-200 disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-primary-700 dark:text-primary-200 text-sm">
          Página {page + 1} de {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages - 1}
          className="px-4 py-2 rounded bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-100 hover:bg-primary-200 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </main>
  )
}


