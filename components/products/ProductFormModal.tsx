'use client'
import { useState, useEffect } from 'react'
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
    removeImageFromVariant,
    addVariant,
    removeVariant,
    validateForm
  } = useProductForm(isOpen, defaultData)

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsSubmitting(false)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const uploadedVariants = await Promise.all(formData.variants.map(async (v) => {
        let mainImageUrl = v.image

        if (v.imageFile) {
          mainImageUrl = await uploadToS3(v.imageFile)
        }

        let galleryUrls: string[] = []

        if (v.galleryFiles && v.galleryFiles.length > 0) {
          const uploaded = await Promise.all(
            v.galleryFiles.map(item => uploadToS3(item.file))
          )
          const existing = v.images.filter(url => !url.startsWith('blob:'))
          galleryUrls = [...existing, ...uploaded]
        } else {
          galleryUrls = v.images
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
    } catch (err) {
      console.error('Error al guardar:', err)
      setIsSubmitting(false)
    }
  }

  const handleVariantGallery = (index: number, files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)

    setFormData(prev => {
      const updated = [...prev.variants]
      const variant = updated[index]

      variant.galleryFiles ??= []
      variant.images ??= []

      const existingNames = new Set(variant.galleryFiles.map(item => item.file.name))

      const newItems = fileArray
        .filter(file => !existingNames.has(file.name))
        .map(file => {
          const previewUrl = URL.createObjectURL(file)
          return { file, previewUrl }
        })

      variant.galleryFiles.push(...newItems)
      variant.images.push(...newItems.map(item => item.previewUrl))

      return { ...prev, variants: updated }
    })
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
            setFormData={setFormData}
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
            <ToggleSwitches
              formData={formData}
              onToggle={(field) => {
                setFormData((prev) => ({
                  ...prev,
                  [field]: !prev[field],
                }))
              }}
            />
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
              disabled={isSubmitting}
              className={`px-4 py-2 rounded text-white transition ${isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-500 hover:bg-primary-600'
                }`}
            >
              {isSubmitting ? 'Guardando...' : defaultData ? 'Actualizar' : 'Guardar'}
            </button>

          </div>
        </form>
      </div>
    </div>
  )
}
