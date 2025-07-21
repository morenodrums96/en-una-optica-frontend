// lib/utils/normalizeProduct.ts

export function initialEmptyProduct() {
  return {
    name: '',
    category: '',
    brand: '',
    model: '',
    unitCost: '',
    customerPrice: '',
    priceWithoutVAT: '',
    hasDiscount: false,
    discount: '',
    discountedPriceWithVAT: '',
    discountedPriceWithoutVAT: '',
    supplier: '',
    frameMaterial: '',
    faceShape: '',
    frameShape: '',
    size: '',
    description: '',
    variants: [],
    configurableOptions: [],
  }
}

export function normalizeProductData(product: any) {
  return {
    ...initialEmptyProduct(), // garantiza que no falte ningún campo
    ...product,
    hasDiscount: product.hasDiscount ?? false,
    discount: product.discount ?? '',
    discountedPriceWithVAT: product.discountedPriceWithVAT ?? '',
    discountedPriceWithoutVAT: product.discountedPriceWithoutVAT ?? '',
    customerPrice: product.customerPrice ?? '',
    priceWithoutVAT: product.priceWithoutVAT ?? '',
    unitCost: product.unitCost ?? '',
  }
}
