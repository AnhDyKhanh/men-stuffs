import { getFetchUrl } from "@/lib/utils"
import { API_ROUTES } from "../_constants/apiRouter"

export const getAllProductsMutation = async () => {
  const path = API_ROUTES.PRODUCTS.GET_ALL
  const res = await fetch(getFetchUrl(path), {
    cache: 'no-store',
  })
  return res.json()
}