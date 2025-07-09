// hooks/useProductForm.ts

import { useState, useEffect, ChangeEvent } from 'react'
import { ProductFormData, VariantType } from '@/types/types'
import { uploadToS3 } from '@/lib/productsApis/productApis'

export function useProductForm(isOpen: boolean, defaultData?: any) {
  const [formData, setFormData] = useState<ProductFormData>({
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

  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [galleryIndices, setGalleryIndices] = useState<number[]>([])

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
        size: ''
      })
      setSelectedOptions([])
      setErrors({})
      setGalleryIndices([0])
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
        configurableOptions: defaultData.configurableOptions?.map((opt: any) =>
          typeof opt === 'object' ? opt._id : opt
        ) || []
      })

      setSelectedOptions(
        defaultData.configurableOptions?.map((opt: any) =>
          typeof opt === 'object' ? opt._id : opt
        ) || []
      )

      setGalleryIndices(defaultData.variants?.map(() => 0) || [0])
    }
  }, [defaultData])

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      configurableOptions: selectedOptions
    }))
  }, [selectedOptions])

  const handleInput = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[name]
      return newErrors
    })
  }

  const handleToggle = (field: 'frond' | 'canModifyQuantity' | 'iva') => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleVariantChange = (index: number, field: keyof VariantType, value: string) => {
    setFormData(prev => {
      const updated = [...prev.variants]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, variants: updated }
    })

    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[`variant_${field}_${index}`]
      return newErrors
    })
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
      const currentImages = new Set<string>(updated[index].images)
      urls.forEach(url => currentImages.add(url))
      updated[index].images = Array.from(currentImages)
      return { ...prev, variants: updated }
    })
  }

  const removeImageFromVariant = (variantIndex: number, imageIndex: number) => {
    setFormData(prev => {
      const updated = [...prev.variants]
      const currentImages = [...updated[variantIndex].images]
      currentImages.splice(imageIndex, 1)
      updated[variantIndex].images = currentImages
      return { ...prev, variants: updated }
    })

    setGalleryIndices(prev => {
      const updated = [...prev]
      const newLength = formData.variants[variantIndex].images.length - 1
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
    setGalleryIndices(prev => [...prev, 0])
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

  return {
    formData,
    setFormData,
    selectedOptions,
    setSelectedOptions,
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
    handleOptionToggle,
    validateForm
  }
}
