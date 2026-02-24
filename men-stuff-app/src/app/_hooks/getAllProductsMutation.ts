import { getBaseUrl } from "@/lib/utils"
import { API_ROUTES } from "../_constants/apiRouter"

export const getAllProductsMutation = async () => {
  const res = await fetch(`${getBaseUrl()}${API_ROUTES.PRODUCTS.GET_ALL}`, {
    cache: 'no-store',
  })
  return res.json()
}