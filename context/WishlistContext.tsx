'use client'

import { createContext, useState, useEffect } from 'react'

export const WishlistContext = createContext<{
  wishlist: string[]
  toggleWishlist: (id: string) => void
  isInWishlist: (id: string) => boolean
}>({
  wishlist: [],
  toggleWishlist: () => {},
  isInWishlist: () => false
})

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('wishlist')
    if (stored) setWishlist(JSON.parse(stored))
  }, [])

  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
      const updated = prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]

      localStorage.setItem('wishlist', JSON.stringify(updated))
      return updated
    })
  }

  const isInWishlist = (id: string) => wishlist.includes(id)

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}
