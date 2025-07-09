'use client'

import { VariantType } from '@/types/types'

type Props = {
  index: number
  variant: VariantType
  errors: { [key: string]: string }
  galleryIndex: number
  onGalleryIndexChange: (index: number, newValue: number) => void
  catalogs: { colors: any[] }
  onChange: (index: number, field: keyof VariantType, value: string) => void
  onGalleryUpload: (index: number, files: FileList | null) => void
  onRemoveGalleryImage: (variantIndex: number, imageIndex: number) => void
  onMainImageSelect: (index: number, file: File) => void
  onRemoveVariant: (index: number) => void
  canRemove: boolean
}

export default function VariantCard({
  index,
  variant,
  errors,
  galleryIndex,
  onGalleryIndexChange,
  catalogs,
  onChange,
  onGalleryUpload,
  onRemoveGalleryImage,
  onMainImageSelect,
  onRemoveVariant,
  canRemove
}: Props) {
  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onMainImageSelect(index, file)
    }
  }

  return (
    <div className="p-5 bg-white dark:bg-primary-900 rounded-xl border border-primary-200 dark:border-primary-700 shadow-md hover:shadow-lg transition-shadow duration-300 space-y-4">
      <h4 className="font-semibold text-primary-800 dark:text-white">Variante {index + 1}</h4>

      {/* Color y cantidad */}
      <div className="grid grid-cols-2 gap-4">
        <select
          value={variant.color}
          onChange={e => onChange(index, 'color', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg transition ${errors[`variant_color_${index}`]
            ? 'border-red-500 focus:ring-red-400'
            : 'border-gray-300 dark:border-primary-700 focus:ring-primary-400'} bg-white dark:bg-primary-800 text-gray-900 dark:text-white`}
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
          value={variant.quantity}
          onChange={e => onChange(index, 'quantity', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg transition 
            ${errors[`variant_quantity_${index}`] ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 dark:border-primary-700 focus:ring-primary-400'} 
            bg-white dark:bg-primary-800 text-gray-900 dark:text-white appearance-none`}
        />
      </div>

      {/* Imagen principal y galería */}
      <div className="grid grid-cols-2 gap-4">
        {/* Imagen principal */}
        <div>
          <label htmlFor={`mainImage-${index}`} className="button-blue cursor-pointer block text-center mb-2">
            📁 Imagen principal
          </label>
          <input
            id={`mainImage-${index}`}
            type="file"
            accept="image/*"
            onChange={handleMainImage}
            className="hidden"
          />
          {variant.image && (
            <div className="flex justify-center">
              <img src={variant.image} alt="Principal" className="w-full max-w-[150px] h-auto object-cover rounded border shadow" />
            </div>
          )}
        </div>

        {/* Galería */}
        <div>
          <label htmlFor={`galleryImages-${index}`} className="button-blue cursor-pointer block text-center mb-2">
            📁 Galería de imágenes
          </label>
          <input
            id={`galleryImages-${index}`}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => onGalleryUpload(index, e.target.files)}
            className="hidden"
          />

          {variant.images?.length > 0 && (
            <div className="relative w-full max-w-[150px] h-[150px] mx-auto">
              <img
                src={variant.images[galleryIndex]}
                className="w-full h-full object-cover rounded border transition-all duration-300 ease-in-out"
                alt={`img-${galleryIndex}`}
              />
              <button
                type="button"
                onClick={() => onRemoveGalleryImage(index, galleryIndex)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow"
                title="Eliminar imagen"
              >
                ×
              </button>
              {variant.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => onGalleryIndexChange(index, (galleryIndex - 1 + variant.images.length) % variant.images.length)}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/50 text-white px-2 py-1 text-xs rounded-l"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => onGalleryIndexChange(index, (galleryIndex + 1) % variant.images.length)}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/50 text-white px-2 py-1 text-xs rounded-r"
                  >
                    ›
                  </button>
                </>
              )}
              <p className="text-xs text-center mt-1 text-gray-500">
                {galleryIndex + 1} de {variant.images.length}
              </p>
            </div>
          )}
        </div>
      </div>

      {canRemove && (
        <button
          type="button"
          onClick={() => onRemoveVariant(index)}
          className="text-red-600 text-sm underline mt-2"
        >
          Eliminar variante
        </button>
      )}
    </div>
  )
}
