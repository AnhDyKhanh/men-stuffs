'use client'
import { useQuery } from '@tanstack/react-query'
import { API_ROUTES } from '../_constants/apiRouter'
import { GetUserCartItemsApiResponse } from '../_types/cart'

//phải call url api, chứu ko gọi thăngt hàm vì sẽ xung đột với server component
async function fetchCustomerCurrentCart() {
  const url = `${API_ROUTES.GUEST.CART.GET_CUSTOMER_CURRENT_CART}`
  // url = /api/guest/cart => gọi đến hàm get ở file route/api/guest/cart/route.ts
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch customer current cart')
  return res.json()
}

export function useGetCustomerCurrentCart() {
  return useQuery({
    queryKey: ['customer-current-cart'],
    queryFn: fetchCustomerCurrentCart,
    placeholderData: (prev) => prev,
    select: (data: GetUserCartItemsApiResponse) => data.data ?? { cartItems: [], cartId: null },
  })
}