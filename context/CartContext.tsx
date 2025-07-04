'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface CartItem {
  _id: string
  name: string
  customerPrice: number
  variantImage?: string
  selectedOptions?: Record<string, any[]>
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (item: CartItem) => void
  clearCart: () => void
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('cart')
    if (stored) setCartItems(JSON.parse(stored))
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (item: CartItem) => {
    setCartItems(prev => [...prev, item])
  }

  const removeFromCart = (item: CartItem) => {
    setCartItems(prev => prev.filter(p => p._id !== item._id))
  }

  const clearCart = () => setCartItems([])

  const totalPrice = cartItems.reduce((sum, item) => {
    const configTotal = Object.values(item.selectedOptions || {}).flat().reduce(
      (acc: number, opt: any) => acc + (opt.price * (opt.quantity || 1)),
      0
    )
    return sum + item.customerPrice + configTotal
  }, 0)

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart debe usarse dentro de un CartProvider')
  return context
}
