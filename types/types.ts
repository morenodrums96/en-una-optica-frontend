// types.ts

export type GalleryItem = {
  file: File
  previewUrl: string
}

export type VariantType = {
  color: string
  quantity: string
  imageFile?: File
  galleryFiles?: GalleryItem[]
  image?: string
  images: string[] // estas deben venir del previewUrl
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
