'use client'

import { useProductForm } from '@/hooks/useProductForm'
import VariantCard from '@/components/products/VariantCard'
import ProductFields from '@/components/products/ProductFields'
import ToggleSwitches from '@/components/products/ToggleSwitches'
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
  const {
    formData,
    setFormData,
    selectedOptions,
    galleryIndices,
    setGalleryIndices,
    errors,
    setErrors,
    handleInput,
    handleToggle,
    handleVariantChange,
    handleVariantGallery,
    removeImageFromVariant,
    addVariant,
    removeVariant,
    validateForm
  } = useProductForm(isOpen, defaultData)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    // Subir imágenes antes de enviar
    const uploadedVariants = await Promise.all(formData.variants.map(async (v) => {
      let mainImageUrl = v.image
      let galleryUrls: string[] = v.images || []

      if (v.imageFile) {
        mainImageUrl = await uploadToS3(v.imageFile)
      }

      if (v.galleryFiles && v.galleryFiles.length > 0) {
        galleryUrls = await Promise.all(v.galleryFiles.map(file => uploadToS3(file)))
      }

      return {
        color: v.color,
        quantity: parseInt(v.quantity),
        image: mainImageUrl,
        images: galleryUrls
      }
    }))

    const productToSend = {
      ...formData,
      unitCost: parseFloat(formData.unitCost),
      customerPrice: parseFloat(formData.customerPrice),
      variants: uploadedVariants,
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
          <ProductFields
            formData={formData}
            errors={errors}
            catalogs={catalogs}
            handleInput={handleInput}
            setErrors={setErrors}
          />

          <div className="space-y-6">
            {formData.variants.map((v, i) => (
              <VariantCard
                key={i}
                index={i}
                variant={v}
                errors={errors}
                galleryIndex={galleryIndices[i]}
                onGalleryIndexChange={(idx, newIndex) => {
                  setGalleryIndices(prev => {
                    const updated = [...prev]
                    updated[idx] = newIndex
                    return updated
                  })
                }}
                catalogs={catalogs}
                onChange={handleVariantChange}
                onGalleryUpload={handleVariantGallery}
                onRemoveGalleryImage={removeImageFromVariant}
                onMainImageSelect={(idx, file) => {
                  setFormData(prev => {
                    const updatedVariants = [...prev.variants]
                    updatedVariants[idx].imageFile = file
                    updatedVariants[idx].image = URL.createObjectURL(file)
                    return { ...prev, variants: updatedVariants }
                  })
                }}
                onRemoveVariant={removeVariant}
                canRemove={formData.variants.length > 1}
              />

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
            <ToggleSwitches formData={formData} onToggle={handleToggle} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-primary-700 rounded shadow border">
              <span className="text-sm text-gray-700 dark:text-white">Visible para el cliente</span>
              <button
                type="button"
                onClick={() => handleToggle('frond')}
                className={`w-10 h-6 flex items-center bg-gray-300 rounded-full p-1 transition-colors duration-300 ${formData.frond ? 'bg-primary-600' : ''}`}
              >
                <span className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-300 ${formData.frond ? 'translate-x-4' : ''}`}></span>
              </button>
            </div>

            <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-primary-700 rounded shadow border">
              <span className="text-sm text-gray-700 dark:text-white">Cantidad modificable</span>
              <button
                type="button"
                onClick={() => handleToggle('canModifyQuantity')}
                className={`w-10 h-6 flex items-center bg-gray-300 rounded-full p-1 transition-colors duration-300 ${formData.canModifyQuantity ? 'bg-primary-600' : ''}`}
              >
                <span className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-300 ${formData.canModifyQuantity ? 'translate-x-4' : ''}`}></span>
              </button>
            </div>

            <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-primary-700 rounded shadow border">
              <span className="text-sm text-gray-700 dark:text-white">Aplicar IVA</span>
              <button
                type="button"
                onClick={() => handleToggle('iva')}
                className={`w-10 h-6 flex items-center bg-gray-300 rounded-full p-1 transition-colors duration-300 ${formData.iva ? 'bg-primary-600' : ''}`}
              >
                <span className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-300 ${formData.iva ? 'translate-x-4' : ''}`}></span>
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
