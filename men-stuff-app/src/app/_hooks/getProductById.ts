import { API_ROUTES } from "../_constants/apiRouter"
import { getBaseUrl } from "@/lib/utils"

/** GET /api/admin/products/[id] — id phải nằm trong path, không dùng query. */
export const getProductById = async (id: string) => {
  const path = API_ROUTES.PRODUCTS.GET_BY_ID.replace(':id', id)
  const res = await fetch(`${getBaseUrl()}${path}`)
  const data = await res.json()
  if (!res.ok) return null
  if (data && typeof data === 'object' && 'error' in data) return null
  return data
}

//response là dạng sau
// {
//   "id": "06339e54-c5b0-4227-a4c8-e9c9ad62ca5d",
//     "name": "Vòng tay bạc",
//       "slug": "vong-tay-bac",
//         "description": "Sản phẩm nam thiết kế tối giản, phù hợp phong cách lịch lãm.",
//           "price": 1802025,
//             "thumbnail": "https://xhclatfxcwxjhxbwxkch.supabase.co/storage/v1/object/public/image/1772371289953-jic1n6ngh1d.webp",
//               "status": "active",
//                 "createdAt": "2026-02-21T07:43:41.641825"
// }