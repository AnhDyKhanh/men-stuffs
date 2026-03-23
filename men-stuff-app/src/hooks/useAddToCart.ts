'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_ROUTES } from '../constants/apiRouter'
import { apiFetch } from '@/lib/apiFetch'
import { AddProductToCartDTO } from '../app/api/guest/services/addProductToCart'

async function fetchAddToCart(payload: AddProductToCartDTO) {
  const url = API_ROUTES.GUEST.ADD_TO_CART
  return apiFetch(url, { method: 'POST', body: payload })
}

export function useAddToCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: fetchAddToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-current-cart'] })
    },
  })
}
