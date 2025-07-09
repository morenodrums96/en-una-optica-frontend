// types.ts

export type VariantType = {
  color: string
  quantity: string
  imageFile?: File               // ✅ archivo imagen principal (para subir a S3)
  galleryFiles?: File[]         // ✅ archivos de galería (para subir a S3)
  image?: string                // ✅ URL final en S3 o preview local
  images: string[]
}

export type ProductFormData = {
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
}
