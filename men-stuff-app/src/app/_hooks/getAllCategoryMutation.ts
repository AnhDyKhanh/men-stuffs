import { getFetchUrl } from '@/lib/utils'
import { API_ROUTES } from '../_constants/apiRouter'

export const getAllCategoryMutation = async () => {
  const path = API_ROUTES.CATEGORIES.GET_ALL
  const res = await fetch(getFetchUrl(path), {
    cache: 'no-store',
  })
  return res.json()
}
