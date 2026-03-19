// ./_components/useAddToCart.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useAddToCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: any) => {
      // API thêm vào giỏ
      return fetch('/api/cart', { method: 'POST', body: JSON.stringify(payload) })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-current-cart'] })
    },
  })
}
