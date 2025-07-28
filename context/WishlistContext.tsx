'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getWishlistByAnonymousId, toggleWishlistByAnonymousId } from '@/lib/wishlistApis/wishlist'

type WishlistContextType = {
  wishlist: string[]
  toggleWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
}

export const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  toggleWishlist: () => {},
  isInWishlist: () => false,
})

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient()
  const [anonymousId, setAnonymousId] = useState<string | null>(null)

  // Crear o recuperar anonymousId
  useEffect(() => {
    let anonId = localStorage.getItem('anonymousUserId')
    if (!anonId) {
      anonId = uuidv4()
      localStorage.setItem('anonymousUserId', anonId)
    }
    setAnonymousId(anonId)
  }, [])

  // Obtener IDs de productos del wishlist
  const { data: wishlist = [] } = useQuery<string[]>({
    queryKey: ['wishlist', anonymousId],
    queryFn: async () => {
      if (!anonymousId) return []
      const data = await getWishlistByAnonymousId(anonymousId)
      return data.productIds
    },
    enabled: !!anonymousId,
    staleTime: Infinity,
  })

  // Toggle de producto con actualización optimista
  const { mutate: toggleWishlist } = useMutation({
    mutationFn: async (productId: string) => {
      if (!anonymousId) return
      return toggleWishlistByAnonymousId(productId, anonymousId)
    },
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ['wishlist', anonymousId] })
      const previous = queryClient.getQueryData<string[]>(['wishlist', anonymousId])

      queryClient.setQueryData<string[]>(['wishlist', anonymousId], (old = []) => {
        const exists = old.includes(productId)
        return exists ? old.filter(id => id !== productId) : [...old, productId]
      })

      return { previous }
    },
    onError: (err, productId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['wishlist', anonymousId], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', anonymousId] })
      queryClient.invalidateQueries({ queryKey: ['wishlist-products', anonymousId] }) // 👈 sincroniza /wishlist
    }
  })

  const isInWishlist = (productId: string) => wishlist.includes(productId)

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
