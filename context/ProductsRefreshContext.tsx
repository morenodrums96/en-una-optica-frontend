'use client'

import { createContext, useContext, useState } from 'react'

const ProductsRefreshContext = createContext<{
  productsNeedRefresh: boolean
  setProductsNeedRefresh: (value: boolean) => void
}>({
  productsNeedRefresh: false,
  setProductsNeedRefresh: () => {},
})

export const ProductsRefreshProvider = ({ children }: { children: React.ReactNode }) => {
  const [productsNeedRefresh, setProductsNeedRefresh] = useState(false)

  return (
    <ProductsRefreshContext.Provider value={{ productsNeedRefresh, setProductsNeedRefresh }}>
      {children}
    </ProductsRefreshContext.Provider>
  )
}

export const useProductsRefresh = () => useContext(ProductsRefreshContext)
