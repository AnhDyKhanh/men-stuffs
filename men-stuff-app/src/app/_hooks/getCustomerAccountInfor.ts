'use client'
import { API_ROUTES } from "../_constants/apiRouter"
import { useQuery } from "@tanstack/react-query"

async function fetchCustomerAccountInfor() {
  const url = `${API_ROUTES.GUEST.ACCOUNT.GET_CUSTOMER_ACCOUNT_INFOR}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch customer account information')
  return res.json()
}

export function useGetCustomerAccountInfor() {
  return useQuery({
    queryKey: ['@get-customer-account-infor'],
    queryFn: fetchCustomerAccountInfor,
    placeholderData: (prev) => prev,
  })
}