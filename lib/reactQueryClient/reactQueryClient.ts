import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // nunca considera los datos como obsoletos
      refetchOnWindowFocus: false, // no vuelve a hacer fetch al volver a la pestaña
    },
  },
})
