'use client'
import { useQuery } from "@tanstack/react-query"
import { API_ROUTES } from "../_constants/apiRouter"

//phải call url api, chứu ko gọi thăngt hàm vì sẽ xung đột với server component
async function fetchCustomerCurrentCart() {
  const url = `${API_ROUTES.GUEST.CART.GET_CUSTOMER_CURRENT_CART}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch customer current cart')
  return res.json()
}

export function useGetCustomerCurrentCart() {
  return useQuery({
    queryKey: ['customer-current-cart'],
    queryFn: fetchCustomerCurrentCart,
    placeholderData: (prev) => prev,
  })
}


// mẫu api response cho ae lười console log:
// {
//   "data": [
//     {
//       "id": "68a8ea2e-ef26-4654-a90d-7486a164cfc5",
//       "product": {
//         "name": "Vòng tay bạc",
//         "price": 1802025,
//         "description": "Sản phẩm nam thiết kế tối giản, phù hợp phong cách lịch lãm.",
//         "origin_image": "https://xhclatfxcwxjhxbwxkch.supabase.co/storage/v1/object/public/image/1772371289953-jic1n6ngh1d.webp",
//         "discount_price": 1621822
//       },
//       "quantity": 2,
//       "product_id": "06339e54-c5b0-4227-a4c8-e9c9ad62ca5d"
//     }
//   ],
//     "error": null,
//       "message": "Cart items fetched successfully",
//         "status": 200
// }