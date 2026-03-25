'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateOrderDTO } from '../app/api/guest/payment/services/createPayment'
import { API_ROUTES } from '../constants/apiRouter'

async function fetchCreatePayment(body: CreateOrderDTO) {
  const url = API_ROUTES.GUEST.PAYMENT
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('Tạo đơn hàng thất bại')
  return res.json()
}

export function useCreatePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: fetchCreatePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-current-cart'] })
    },
  })
}
