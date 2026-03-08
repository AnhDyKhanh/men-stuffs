import { useMutation } from "@tanstack/react-query"
import { CreateOrderDTO } from "../api/guest/payment/services/createPayment"

async function fetchCreatePayment(body: CreateOrderDTO) {
  const res = await fetch('/api/guest/payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

export function useCreatePayment() {
  return useMutation({
    mutationFn: fetchCreatePayment,
  })
}