import { useMutation } from "@tanstack/react-query"
import { AddProductToCartDTO } from "../api/guest/services/addProductToCart"

async function fetchAddProductToCart(body: AddProductToCartDTO) {
  const res = await fetch('/api/guest/add-to-cart', {
    method: 'POST',
    body: JSON.stringify(body),
  })
  return res.json()
}

export function useAddProductToCart() {
  return useMutation({
    mutationFn: fetchAddProductToCart,
  })
}