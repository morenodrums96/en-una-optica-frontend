'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import ProductFormModal from '@/components/products/ProductFormModal'
import {
  getCatalogByGroup,
  searchConfigurableActive,
  registresProduct,
  getAllProductsByPages,
  getProductSelected,
  updateProduts,
  deleteProduct,
} from '@/lib/productsApis/productApis'
import { PlusCircle, Pencil, Trash2 } from 'lucide-react'
import FloatingMessage from '@/components/FloatingMessage/FloatingMessage'
import ConfirmMessage from '@/components/FloatingMessage/ConfirmMessage'
import Image from 'next/image'
import { normalizeProductData } from '@/lib/utils/normalizeProduct'

const ProductImage = ({ src, alt }: { src: string; alt: string }) => {
  const [imgSrc, setImgSrc] = useState(src || '/imagen/placeholder-product.webp')

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
      className="object-cover rounded-md"
      priority
      onError={() => setImgSrc('/imagen/placeholder-product.webp')}
    />
  )
}

export default function ProductosPage() {
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [catalogs, setCatalogs] = useState({
    frameMaterial: [],
    faceShape: [],
    frameShape: [],
    colors: [],
  })
  const [configurableOptions, setConfigurableOptions] = useState([])
  const [products, setProducts] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [confirmDeleteName, setConfirmDeleteName] = useState<string | null>(null)

  // ⬇️ Asegúrate de declarar filters antes de usarse en fetchProducts
  const [filters, setFilters] = useState({
    name: '',
    minPrice: '',
    maxPrice: '',
  })

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (filters[name as keyof typeof filters] !== value) {
      setProducts([])
      setPage(1)
      setFilters(prev => ({ ...prev, [name]: value }))
    }
  }

  // 🔁 Reiniciar productos al cambiar filtros
  useEffect(() => {
    setProducts([])
    setPage(1)
  }, [filters])

  const observer = useRef<IntersectionObserver | null>(null)

  const lastProductRef = useCallback(
    (node: any) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1)
        }
      })

      if (node) observer.current.observe(node)
    },
    [loading, hasMore]
  )

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { products: newProducts, total } = await getAllProductsByPages(page, 10, filters)
      setProducts(prev => [...prev, ...newProducts])
      setHasMore((products.length + newProducts.length) < total)
    } catch (error) {
      setErrorMsg('Error al cargar productos:' + error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [filters, page])


  const loadCatalogs = async () => {
    try {
      const catalogData = await getCatalogByGroup()
      const options = await searchConfigurableActive()

      const groupMap = (group: string) =>
        catalogData.filter((c: any) => c.group === group)

      setCatalogs({
        frameMaterial: groupMap('frameMaterial'),
        faceShape: groupMap('faceShape'),
        frameShape: groupMap('frameShape'),
        colors: groupMap('color'),
      })

      setConfigurableOptions(options)
    } catch (error) {
      setErrorMsg('Error cargando catálogos:' + error)
    }
  }

  const handleSaveProduct = async (data: any) => {
    try {
      if (data._id) {
        const message = await updateProduts(data._id, data)
        setSuccessMsg(message + '✅')
      } else {
        await registresProduct(data)
        setSuccessMsg('Producto guardado con éxito ✅')
      }

      setShowModal(false)
      setSelectedProduct(null)
      setProducts([])
      setPage(1) // reiniciar lista
    } catch (error: any) {
      setErrorMsg('Error: ' + error.message)
    }
  }

  const handleEditProduct = async (id: string) => {
    try {
      const res = await getProductSelected(id)
      const normalized = normalizeProductData(res.product)
      setSelectedProduct(normalized)
      setShowModal(true)
    } catch (error) {
      console.error('Error al obtener producto para editar:', error)
    }
  }


  useEffect(() => {
    if (showModal) loadCatalogs()
  }, [showModal])

  return (
    <main className="flex-1 p-6 ml-13 bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-primary-950 dark:to-primary-900 transition-colors duration-300 min-h-screen">
      {successMsg && (
        <FloatingMessage message={successMsg} type="success" onClose={() => setSuccessMsg('')} />
      )}
      {errorMsg && (
        <FloatingMessage message={errorMsg} type="error" onClose={() => setErrorMsg('')} />
      )}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-primary-900 dark:text-white tracking-tight">Productos</h2>
          <p className="text-sm text-primary-700 dark:text-primary-300 leading-relaxed">
            Agrega, edita o elimina productos del inventario de tu óptica.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow transition-transform hover:scale-105"
        >
          <PlusCircle className="h-5 w-5" />
          Agregar producto
        </button>
      </div>
      <div className="mb-6 flex flex-wrap gap-4 items-end">
        <input
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
          placeholder="Buscar por nombre"
          className="border px-3 py-2 rounded-md text-sm"
        />
        <input
          name="minPrice"
          value={filters.minPrice}
          onChange={handleFilterChange}
          placeholder="Precio mínimo"
          type="number"
          className="border px-3 py-2 rounded-md text-sm"
        />
        <input
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          placeholder="Precio máximo"
          type="number"
          className="border px-3 py-2 rounded-md text-sm"
        />
      </div>



      <ProductFormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedProduct(null)
        }}
        catalogs={catalogs}
        configurableOptions={configurableOptions}
        defaultData={selectedProduct}
        onSubmit={handleSaveProduct}
      />

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product: any, i: number) => {
          const isLast = i === products.length - 1
          return (
            <div
              key={`${product._id}-${i}`}
              ref={isLast ? lastProductRef : null}
              className="cursor-pointer card-hover-animated bg-white dark:bg-primary-900 border border-primary-200 dark:border-primary-700 rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col"
            >
              <div className="relative w-full aspect-video">
                <ProductImage
                  src={product.variants?.[0]?.image}
                  alt={product.name}
                />
              </div>

              <div className="flex-1 space-y-1">
                <h3 className="text-lg font-semibold text-primary-900 dark:text-white">{product.name}</h3>
                <p className="text-sm text-primary-600 dark:text-primary-300">
                  Categoría: <span className="font-medium">{product.category || 'N/A'}</span>
                </p>
                <p className="text-sm text-primary-600 dark:text-primary-300">
                  Precio: <span className="font-medium">${product.customerPrice}</span>
                </p>
                <p className="text-sm text-primary-600 dark:text-primary-300">
                  Costo unitario: <span className="font-medium">${product.unitCost}</span>
                </p>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => handleEditProduct(product._id)}
                  className="p-2 rounded-lg bg-primary-100 dark:bg-primary-800 hover:bg-primary-200 dark:hover:bg-primary-700 transition"
                  title="Editar"
                >
                  <Pencil className="h-5 w-5 text-primary-700 dark:text-white" />
                </button>
                <button
                  data-allow-multiple
                  onClick={() => {
                    setConfirmDeleteId(product._id)
                    setConfirmDeleteName(product.name)
                  }}
                  className="p-2 rounded-lg bg-red-100 dark:bg-red-700 hover:bg-red-200 dark:hover:bg-red-600 transition"
                  title="Eliminar"
                >
                  <Trash2 className="h-5 w-5 text-red-700 dark:text-white" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {loading && (
        <div className="text-center py-6 text-primary-600 dark:text-primary-300">Cargando más productos...</div>
      )}

      {confirmDeleteId && (
        <ConfirmMessage
          message={`¿Seguro que quieres eliminar el producto "${confirmDeleteName}"?`}
          onCancel={() => {
            setConfirmDeleteId(null)
            setConfirmDeleteName(null)
          }}
          onConfirm={async () => {
            try {
              await deleteProduct(confirmDeleteId)
              setSuccessMsg('Producto eliminado correctamente ✅')
              setProducts([])
              setPage(1)
            } catch (error: any) {
              setErrorMsg(error.message || 'Error al eliminar el producto')
            } finally {
              setConfirmDeleteId(null)
              setConfirmDeleteName(null)
            }
          }}
        />
      )}
    </main>
  )
}
