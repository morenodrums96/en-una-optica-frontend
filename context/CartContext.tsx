'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getCartByAnonymousId,
  addToCartByAnonymousId,
  removeFromCartByAnonymousId,
  updateQuantityByAnonymousId,
} from '@/lib/cartApis/cartApis'

interface CartItem {
  discountedPriceWithVAT?: number
  productId: string
  name: string
  customerPrice: number
  variantImage?: string
  selectedOptions?: Record<string, any[]>
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string, selectedOptions?: Record<string, any[]>) => void
  updateQuantity: (
    productId: string,
    selectedOptions: Record<string, any[]>,
    quantity: number,
    options?: {
      onError?: (err: any) => void
      onSettled?: () => void
    }
  ) => void
  clearCart: () => void
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient()
  const [anonymousId, setAnonymousId] = useState<string | null>(null)

  useEffect(() => {
    let anonId = localStorage.getItem('anonymousUserId')
    if (!anonId) {
      anonId = uuidv4()
      localStorage.setItem('anonymousUserId', anonId)
    }
    setAnonymousId(anonId)
  }, [])

  const { data: cartItems = [] } = useQuery<CartItem[]>({
    queryKey: ['cart', anonymousId],
    queryFn: async () => {
      if (!anonymousId) return []
      const res = await getCartByAnonymousId(anonymousId)
      return res.cartItems
    },
    enabled: !!anonymousId,
    staleTime: Infinity,
  })

  const addMutation = useMutation({
    mutationFn: (item: CartItem) => {
      if (!anonymousId) return Promise.resolve()
      return addToCartByAnonymousId(item, anonymousId)
    },
    onMutate: async (item) => {
      await queryClient.cancelQueries({ queryKey: ['cart', anonymousId] })
      const previous = queryClient.getQueryData<CartItem[]>(['cart', anonymousId]) || []

      const existingIndex = previous.findIndex(
        (p) =>
          p.productId === item.productId &&
          JSON.stringify(p.selectedOptions || {}) === JSON.stringify(item.selectedOptions || {})
      )

      let updated: CartItem[]
      if (existingIndex !== -1) {
        updated = [...previous]
        updated[existingIndex].quantity += 1
      } else {
        updated = [...previous, { ...item, quantity: 1 }]
      }

      queryClient.setQueryData(['cart', anonymousId], updated)
      return { previous }
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['cart', anonymousId], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', anonymousId] })
    },
  })

  const removeMutation = useMutation({
    mutationFn: ({ productId, selectedOptions }: { productId: string; selectedOptions?: Record<string, any[]> }) => {
      if (!anonymousId) return Promise.resolve()
      return removeFromCartByAnonymousId({ productId, selectedOptions, anonymousId })
    },
    onMutate: async ({ productId, selectedOptions }) => {
      await queryClient.cancelQueries({ queryKey: ['cart', anonymousId] })
      const previous = queryClient.getQueryData<CartItem[]>(['cart', anonymousId]) || []

      const updated = previous.filter(
        (item) =>
          item.productId !== productId ||
          JSON.stringify(item.selectedOptions || {}) !== JSON.stringify(selectedOptions || {})
      )

      queryClient.setQueryData(['cart', anonymousId], updated)
      return { previous }
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['cart', anonymousId], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', anonymousId] })
    },
  })

  const updateQuantityMutation = useMutation({
    mutationFn: ({
      productId,
      selectedOptions,
      quantity,
    }: {
      productId: string
      selectedOptions?: Record<string, any[]>
      quantity: number
    }) => {
      if (!anonymousId) return Promise.resolve()
      return updateQuantityByAnonymousId({
        productId,
        selectedOptions,
        quantity,
        anonymousId,
      })
    },
    // ❌ eliminamos la mutación local para evitar sobrescribir datos como descuento
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['cart', anonymousId] })
      return {}
    },
    onError: (_, __, context) => {
      // Nada por ahora
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', anonymousId] })
    },
  })

  const clearCart = () => {
    queryClient.setQueryData(['cart', anonymousId], [])
  }

  const totalPrice = cartItems.reduce((sum, item) => {
    const configTotal = Object.values(item.selectedOptions || {})
      .flat()
      .reduce((acc: number, opt: any) => acc + (opt.price * (opt.quantity || 1)), 0)

    const unitPrice = typeof item.discountedPriceWithVAT === 'number' &&
      item.discountedPriceWithVAT > 0 &&
      item.discountedPriceWithVAT < item.customerPrice
      ? item.discountedPriceWithVAT
      : item.customerPrice

    return sum + (unitPrice + configTotal) * item.quantity
  }, 0)


  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart: addMutation.mutate,
        removeFromCart: (productId, selectedOptions) =>
          removeMutation.mutate({ productId, selectedOptions }),
        updateQuantity: (productId, selectedOptions, quantity, options) =>
          updateQuantityMutation.mutate(
            { productId, selectedOptions, quantity },
            {
              onError: options?.onError,
              onSettled: options?.onSettled,
            }
          ),
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart debe usarse dentro de un CartProvider')
  return context
}
