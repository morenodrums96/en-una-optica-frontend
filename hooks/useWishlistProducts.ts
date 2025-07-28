import { useQuery } from '@tanstack/react-query'
import { getWishlistProductsByAnonymousId } from '@/lib/wishlistApis/wishlist'

export interface Product {
  _id: string
  name: string
  customerPrice: number
  variants?: { image: string }[]
}

export const useWishlistProducts = (anonymousId: string | null) => {
  return useQuery<Product[]>({
    queryKey: ['wishlist-products', anonymousId],
    queryFn: () => getWishlistProductsByAnonymousId(anonymousId!),
    enabled: !!anonymousId,
    staleTime: 1000 * 60 * 5,
  })
}
