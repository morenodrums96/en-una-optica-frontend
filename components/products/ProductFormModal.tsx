// 🔄 Reemplazo completo del componente ProductFormModal con soporte para múltiples variantes

'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import Image from 'next/image'
import { uploadToS3 } from '@/lib/productsApis/productApis'

export default function ProductFormModal({
  isOpen,
  onClose,
  defaultData,
  catalogs,
  configurableOptions,
  onSubmit,
}: {
  isOpen: boolean
  onClose: () => void
  defaultData?: any
  catalogs: {
    frameMaterial: any[]
    faceShape: any[]
    frameShape: any[]
    colors: any[]
  }
  configurableOptions: any[]
  onSubmit: (data: any) => void
}) {
  const [formData, setFormData] = useState<{
    name: string
    category: string
    brand: string
    model: string
    description: string
    unitCost: string
    customerPrice: string
    supplier: string
    variants: VariantType[]
    frameMaterial: string
    faceShape: string
    frameShape: string
    configurableOptions: string[]
    frond: boolean
    canModifyQuantity: boolean
    iva: boolean
    size: string
  }>({
    name: '',
    category: '',
    brand: '',
    model: '',
    description: '',
    unitCost: '',
    customerPrice: '',
    supplier: '',
    variants: [{ color: '', quantity: '', image: '', images: [] }],
    frameMaterial: '',
    faceShape: '',
    frameShape: '',
    configurableOptions: [],
    frond: false,
    canModifyQuantity: false,
    iva: false,
    size: ''
  })

  type VariantType = {
    color: string
    quantity: string
    image: string
    images: string[]
  }

  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [preview, setPreview] = useState<string>('')
  const [galleryIndices, setGalleryIndices] = useState<number[]>([])

  useEffect(() => {
    setFormData(prev => ({ ...prev, configurableOptions: selectedOptions }))
  }, [selectedOptions])

  useEffect(() => {
    if (isOpen && !defaultData) {
      setFormData({
        name: '',
        category: '',
        brand: '',
        model: '',
        description: '',
        unitCost: '',
        customerPrice: '',
        supplier: '',
        variants: [{ color: '', quantity: '', image: '', images: [] }],
        frameMaterial: '',
        faceShape: '',
        frameShape: '',
        configurableOptions: [],
        frond: false,
        canModifyQuantity: false,
        iva: false,
        size: '',
      })
      setSelectedOptions([])
      setErrors({})
      setPreview('')
      setGalleryIndices([0]) // ✅ aquí va
    }
  }, [isOpen, defaultData])

  useEffect(() => {
    if (defaultData) {
      setFormData({
        ...defaultData,
        unitCost: defaultData.unitCost.toString(),
        customerPrice: defaultData.customerPrice.toString(),
        variants: defaultData.variants.map((v: any) => ({
          color: typeof v.color === 'object' ? v.color._id : v.color,
          quantity: v.quantity.toString(),
          image: v.image,
          images: v.images || []
        })),
        configurableOptions: defaultData.configurableOptions?.map((opt: any) => typeof opt === 'object' ? opt._id : opt) || []
      })
      setSelectedOptions(
        defaultData.configurableOptions?.map((opt: any) => typeof opt === 'object' ? opt._id : opt) || []
      )
      setGalleryIndices(defaultData.variants?.map(() => 0) || [0])
    }
  }, [defaultData])



  const handleInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[name] // ✅ limpia el error del campo modificado
      return newErrors
    })
  }


  const handleToggle = (field: 'frond' | 'canModifyQuantity' | 'iva') => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleVariantChange = (index: number, field: keyof VariantType, value: string) => {
    setFormData(prev => {
      const updated: VariantType[] = [...prev.variants]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, variants: updated }
    })

    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[`variant_${field}_${index}`] // ✅ limpia errores de variante si aplican
      return newErrors
    })
  }


  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  const handleVariantGallery = async (index: number, files: FileList | null) => {
    if (!files) return

    const urls: string[] = []

    for (const file of Array.from(files)) {
      const s3Url = await uploadToS3(file)
      urls.push(s3Url)
    }

    setFormData(prev => {
      const updated = [...prev.variants]
      const currentImages = new Set(updated[index].images)
      urls.forEach(url => currentImages.add(url))
      updated[index].images = Array.from(currentImages)
      return { ...prev, variants: updated }
    })
  }


  const removeImageFromVariant = (variantIndex: number, imageIndex: number) => {
    setFormData(prev => {
      const updated = [...prev.variants]
      const currentImages = [...updated[variantIndex].images]
      currentImages.splice(imageIndex, 1) // eliminar la imagen
      updated[variantIndex].images = currentImages

      return { ...prev, variants: updated }
    })

    setGalleryIndices(prev => {
      const updated = [...prev]
      const newLength = formData.variants[variantIndex].images.length - 1 // -1 porque todavía no se actualiza el estado
      const newIndex = Math.max(0, Math.min(prev[variantIndex], newLength))
      updated[variantIndex] = newIndex
      return updated
    })
  }



  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { color: '', quantity: '', image: '', images: [] }]
    }))
    setGalleryIndices(prev => [...prev, 0]) // ← nuevo índice para nueva variante
  }


  const removeVariant = (index: number) => {
    setFormData(prev => {
      const updated = [...prev.variants]
      updated.splice(index, 1)
      return { ...prev, variants: updated }
    })
  }

  const handleOptionToggle = (id: string) => {
    setSelectedOptions(prev =>
      prev.includes(id) ? prev.filter(opt => opt !== id) : [...prev, id]
    )
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (!formData.name.trim()) newErrors.name = 'Campo requerido'
    if (!formData.category.trim()) newErrors.category = 'Campo requerido'
    if (!formData.brand.trim()) newErrors.brand = 'Campo requerido'
    if (!formData.model.trim()) newErrors.model = 'Campo requerido'
    if (!formData.unitCost.trim()) newErrors.unitCost = 'Campo requerido'
    if (!formData.customerPrice.trim()) newErrors.customerPrice = 'Campo requerido'
    if (!formData.supplier.trim()) newErrors.supplier = 'Campo requerido'
    if (!formData.frameMaterial) newErrors.frameMaterial = 'Selecciona un material'
    if (!formData.faceShape) newErrors.faceShape = 'Selecciona una forma de cara'
    if (!formData.frameShape) newErrors.frameShape = 'Selecciona una forma de armazón'

    formData.variants.forEach((v, i) => {
      if (!v.color) newErrors[`variant_color_${i}`] = 'Color requerido'
      if (!v.quantity) newErrors[`variant_quantity_${i}`] = 'Cantidad requerida'
      if (!v.image) newErrors[`variant_image_${i}`] = 'Imagen principal requerida'
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const productToSend = {
      ...formData,
      unitCost: parseFloat(formData.unitCost),
      customerPrice: parseFloat(formData.customerPrice),
      variants: formData.variants.map(v => ({
        color: v.color,
        quantity: parseInt(v.quantity),
        image: v.image,
        images: v.images
      })),
      configurableOptions: selectedOptions
    }

    onSubmit(productToSend)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-primary-900 p-6 rounded-lg w-full max-w-5xl shadow-lg dark:shadow-primary-800/30 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-semibold text-primary-800 dark:text-white mb-6">
          {defaultData ? 'Edita el producto' : 'Registra un nuevo producto'}
        </h2>
        <form onSubmit={handleSubmit} className="p-5 bg-white dark:bg-primary-900 rounded-xl border border-primary-200 dark:border-primary-700 shadow-md hover:shadow-lg transition-shadow duration-300 space-y-4">
          <div className="grid grid-cols-2 gap-4 p-5 bg-white dark:bg-primary-900 rounded-xl border border-primary-200 dark:border-primary-700 shadow-md hover:shadow-lg transition-shadow duration-300">
            <input name="name" placeholder="Nombre" value={formData.name} onChange={handleInput} className={`w-full px-4 py-2 border rounded-lg transition ${errors.name ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 dark:border-primary-700 focus:ring-primary-400'}  placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-primary-800 text-gray-900 dark:text-white`} />
            <input name="category" placeholder="Categoría" value={formData.category} onChange={handleInput} className={`w-full px-4 py-2 border rounded-lg transition ${errors.category ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 dark:border-primary-700 focus:ring-primary-400'}  placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-primary-800 text-gray-900 dark:text-white`} />
            <input name="brand" placeholder="Marca" value={formData.brand} onChange={handleInput} className={`w-full px-4 py-2 border rounded-lg transition ${errors.brand ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 dark:border-primary-700 focus:ring-primary-400'}  placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-primary-800 text-gray-900 dark:text-white`} />
            <input name="model" placeholder="Modelo" value={formData.model} onChange={handleInput} className={`w-full px-4 py-2 border rounded-lg transition ${errors.model ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 dark:border-primary-700 focus:ring-primary-400'}  placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-primary-800 text-gray-900 dark:text-white`} />
            <input type="text"
              name="unitCost"
              placeholder="Costo unitario"
              value={formData.unitCost}
              onChange={(e) => {
                const value = e.target.value
                if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
                  handleInput(e)
                  setErrors(prev => {
                    const newErrors = { ...prev }
                    delete newErrors.unitCost
                    return newErrors
                  })
                }
              }} className={`w-full px-4 py-2 border rounded-lg transition ${errors.unitCost ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 dark:border-primary-700 focus:ring-primary-400'}  placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-primary-800 text-gray-900 dark:text-white`} />
            <input type="text"
              name="customerPrice"
              placeholder="Precio al cliente"
              value={formData.customerPrice}
              onChange={(e) => {
                const value = e.target.value
                if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
                  handleInput(e)
                  setErrors(prev => {
                    const newErrors = { ...prev }
                    delete newErrors.customerPrice
                    return newErrors
                  })
                }
              }} className={`w-full px-4 py-2 border rounded-lg transition ${errors.customerPrice ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 dark:border-primary-700 focus:ring-primary-400'}  placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-primary-800 text-gray-900 dark:text-white`} />
            <input name="supplier" placeholder="Proveedor" value={formData.supplier} onChange={handleInput} className={`w-full px-4 py-2 border rounded-lg transition ${errors.supplier ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 dark:border-primary-700 focus:ring-primary-400'}  placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-primary-800 text-gray-900 dark:text-white`} />
            <select name="frameMaterial" value={formData.frameMaterial} onChange={handleInput} className={`w-full px-4 py-2 border rounded-lg transition 
                    ${errors.frameMaterial ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 dark:border-primary-700 focus:ring-primary-400'} 
                    bg-white dark:bg-primary-800 text-gray-900 dark:text-white`}>
              <option value="">Material del Armazón</option>
              {catalogs.frameMaterial.map(c => <option key={c._id} value={c._id}>{c.label}</option>)}
            </select>
            <select name="faceShape" value={formData.faceShape} onChange={handleInput} className={`w-full px-4 py-2 border rounded-lg transition 
                    ${errors.faceShape ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 dark:border-primary-700 focus:ring-primary-400'} 
                    bg-white dark:bg-primary-800 text-gray-900 dark:text-white`}>
              <option value="">Forma de cara</option>
              {catalogs.faceShape.map(c => <option key={c._id} value={c._id}>{c.label}</option>)}
            </select>
            <select name="frameShape" value={formData.frameShape} onChange={handleInput} className={`w-full px-4 py-2 border rounded-lg transition 
                    ${errors.frameShape ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 dark:border-primary-700 focus:ring-primary-400'} 
                    bg-white dark:bg-primary-800 text-gray-900 dark:text-white`}>
              <option value="">Forma de armazón</option>
              {catalogs.frameShape.map(c => <option key={c._id} value={c._id}>{c.label}</option>)}
            </select>
            <select
              name="size"
              value={formData.size}
              onChange={handleInput}
              className={`w-full px-4 py-2 border rounded-lg transition 
              border-gray-300 dark:border-primary-700 focus:ring-primary-400
              bg-white dark:bg-primary-800 text-gray-900 dark:text-white`}
            >
              <option value="">Selecciona tamaño</option>
              <option value="Angosto">Angosto</option>
              <option value="Promedio">Promedio</option>
              <option value="Ancho">Ancho</option>
              <option value="Extra ancho">Extra ancho</option>
            </select>
            <textarea
              name="description"
              placeholder="Descripción"
              value={formData.description}
              onChange={handleInput}
              className={`w-full px-4 py-2 border rounded-lg transition col-span-2
              ${errors.description ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 dark:border-primary-700 focus:ring-primary-400'}
              placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-primary-800 text-gray-900 dark:text-white`}
            />
          </div>


          <div className="space-y-6">
            {formData.variants.map((v, i) => (
              <div key={i} className="p-5 bg-white dark:bg-primary-900 rounded-xl border border-primary-200 dark:border-primary-700 shadow-md hover:shadow-lg transition-shadow duration-300 space-y-4">
                <h4 className="font-semibold text-primary-800 dark:text-white">Variante {i + 1}</h4>

                {/* Fila 1: Color y cantidad */}
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={v.color}
                    onChange={e => handleVariantChange(i, 'color', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg transition ${errors[`variant_color_${i}`]
                      ? 'border-red-500 focus:ring-red-400'
                      : 'border-gray-300 dark:border-primary-700 focus:ring-primary-400'
                      } placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-primary-800 text-gray-900 dark:text-white`}
                  >
                    <option value="">Color del Armazón</option>
                    {catalogs.colors.map(c => (
                      <option key={c._id} value={c._id}>
                        {c.label}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Cantidad"
                    value={v.quantity}
                    onChange={e => handleVariantChange(i, 'quantity', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg transition 
                    ${errors[`variant_quantity_${i}`] ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 dark:border-primary-700 focus:ring-primary-400'} 
                    placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-primary-800 text-gray-900 dark:text-white 
                    appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  />

                </div>

                {/* Fila 2: Imagen principal y galería */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Imagen principal */}
                  <div>
                    <label htmlFor={`mainImage-${i}`} className="button-blue cursor-pointer block text-center mb-2">
                      📁 Imagen principal
                    </label>
                    <input
                      id={`mainImage-${i}`}
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const s3Url = await uploadToS3(file)
                          setFormData(prev => {
                            const updated = [...prev.variants]
                            updated[i].image = s3Url
                            return { ...prev, variants: updated }
                          })
                        }
                      }}
                      className="hidden"
                    />

                    {v.image && (
                      <div className="flex justify-center">
                        <img src={v.image} alt="Imagen principal" className="w-full max-w-[150px] h-auto object-cover rounded border shadow" />
                      </div>
                    )}

                  </div>

                  {/* Galería tipo carrusel */}
                  <div>
                    <label htmlFor={`galleryImages-${i}`} className="button-blue cursor-pointer block text-center mb-2">
                      📁 Galería de imágenes
                    </label>
                    <input
                      id={`galleryImages-${i}`}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleVariantGallery(i, e.target.files)}
                      className="hidden"
                    />


                    {v.images.length > 0 && (
                      <div className="relative w-full max-w-[150px] h-[150px] mx-auto">
                        <img
                          src={v.images[galleryIndices[i]]}
                          className="w-full h-full object-cover rounded border transition-all duration-300 ease-in-out"
                          alt={`img-${galleryIndices[i]}`}
                        />
                        {/* Botón eliminar */}
                        <button
                          type="button"
                          onClick={() => removeImageFromVariant(i, galleryIndices[i])}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow"
                          title="Eliminar imagen"
                        >
                          ×
                        </button>
                        {/* Botones de navegación */}
                        {v.images.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                setGalleryIndices(prev => {
                                  const updated = [...prev]
                                  updated[i] = (updated[i] - 1 + v.images.length) % v.images.length
                                  return updated
                                })
                              }
                              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/50 text-white px-2 py-1 text-xs rounded-l"
                            >
                              ‹
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setGalleryIndices(prev => {
                                  const updated = [...prev]
                                  updated[i] = (updated[i] + 1) % v.images.length
                                  return updated
                                })
                              }
                              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/50 text-white px-2 py-1 text-xs rounded-r"
                            >
                              ›
                            </button>
                          </>
                        )}
                        <p className="text-xs text-center mt-1 text-gray-500">
                          {galleryIndices[i] + 1} de {v.images.length}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botón eliminar variante */}
                {formData.variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(i)}
                    className="text-red-600 text-sm underline mt-2"
                  >
                    Eliminar variante
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addVariant}
              className="text-primary-500 dark:text-primary-300 font-medium hover:underline transition-colors"
            >
              ➕ Agregar variante
            </button>

          </div>

          <div className="p-5 bg-white dark:bg-primary-900 rounded-xl border border-primary-200 dark:border-primary-700 shadow-md hover:shadow-lg transition-shadow duration-300 space-y-4">
            <h3 className="text-sm font-medium mb-2 text-primary-800 dark:text-white">Opciones configurables</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {configurableOptions.map(opt => {
                const isChecked = selectedOptions.includes(opt._id)
                return (
                  <div key={opt._id} className="flex items-center justify-between px-4 py-2 bg-white dark:bg-primary-700 rounded shadow border">
                    <span className="text-sm text-gray-700 dark:text-white">{opt.groupDescription || opt.group}</span>
                    <button
                      type="button"
                      onClick={() => handleOptionToggle(opt._id)}
                      className={`w-10 h-6 flex items-center bg-gray-300 rounded-full p-1 transition-colors duration-300 ${isChecked ? 'bg-primary-600' : ''}`}
                    >
                      <span
                        className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-300 ${isChecked ? 'translate-x-4' : ''}`}
                      ></span>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Frontal */}
            <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-primary-700 rounded shadow border">
              <span className="text-sm text-gray-700 dark:text-white">Visible para el cliente</span>
              <button
                type="button"
                onClick={() => handleToggle('frond')}
                className={`w-10 h-6 flex items-center bg-gray-300 rounded-full p-1 transition-colors duration-300 ${formData.frond ? 'bg-primary-600' : ''
                  }`}
              >
                <span
                  className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-300 ${formData.frond ? 'translate-x-4' : ''
                    }`}
                ></span>
              </button>
            </div>

            {/* Modificar cantidad */}
            <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-primary-700 rounded shadow border">
              <span className="text-sm text-gray-700 dark:text-white">Cantidad modificable</span>
              <button
                type="button"
                onClick={() => handleToggle('canModifyQuantity')}
                className={`w-10 h-6 flex items-center bg-gray-300 rounded-full p-1 transition-colors duration-300 ${formData.canModifyQuantity ? 'bg-primary-600' : ''
                  }`}
              >
                <span
                  className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-300 ${formData.canModifyQuantity ? 'translate-x-4' : ''
                    }`}
                ></span>
              </button>
            </div>

            {/* IVA */}
            <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-primary-700 rounded shadow border">
              <span className="text-sm text-gray-700 dark:text-white">Aplicar IVA</span>
              <button
                type="button"
                onClick={() => handleToggle('iva')}
                className={`w-10 h-6 flex items-center bg-gray-300 rounded-full p-1 transition-colors duration-300 ${formData.iva ? 'bg-primary-600' : ''
                  }`}
              >
                <span
                  className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-300 ${formData.iva ? 'translate-x-4' : ''
                    }`}
                ></span>
              </button>
            </div>
          </div>


          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-primary-800 rounded"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-primary-500 text-white rounded"
            >
              {defaultData ? 'Actualizar' : 'Guardar'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
