import { getSupabase } from "@/lib/supabase";
import { getCurrentCustomerId } from "../../services/getCustomerAccount";

// check user is login and get user id from cookie
// export async function getUserCartItems() {
//   const customerId = await getCurrentCustomerId()

//   // get cart id
//   const { data, error } = await getSupabase()
//     .from('cart')
//     .select('id')
//     .eq('customer_id', customerId)
//     .eq('status', 'active')
//     .limit(1)

//   if (error) throw error

//   const cartId = data?.[0]?.id
//   if (!cartId) return {
//     data: [],
//     error: 'Cart not found',
//     message: 'Cart not found',
//     status: 404
//   }

//   // get cart items
//   const { data: cartItems, error: cartItemsError } = await getSupabase()
//     .from('cart_items')
//     .select('*')
//     .eq('cart_id', cartId)

//   console.log('cartItems', cartItems)
//   if (cartItemsError) throw cartItemsError

//   //với mỗi cartItem lấy ra product_id và join với table product để lấy ra product_name, product_price, product_image
//   const cartItemsWithProduct = await Promise.all(cartItems.map(async (cartItem) => {
//     const { data: product, error: productError } = await getSupabase()
//       .from('product')
//       .select('name, price, discount_price, description, origin_image')
//       .eq('id', cartItem.product_id)
//     if (productError) throw productError
//     return {
//       ...cartItem,
//       product: product?.[0]
//     }
//   }))

//   console.log('cartItemsWithProduct', cartItemsWithProduct)

//   return {
//     data: cartItemsWithProduct,
//     error: null,
//     message: 'Cart items fetched successfully',
//     status: 200
//   }
// }

export async function getUserCartItems() {
  const customerId = await getCurrentCustomerId()

  // Chỉ cần 1 lần gọi duy nhất với cú pháp join của Supabase
  const { data: cartData, error } = await getSupabase()
    .from('cart')
    .select(`
      id,
      cart_items (
        id,
        quantity,
        product_id,
        product:product (
          name, 
          price, 
          discount_price, 
          description, 
          origin_image
        )
      )
    `)
    .eq('customer_id', customerId)
    .eq('status', 'active')
    .single() // Lấy duy nhất 1 giỏ hàng active

  if (error) {
    if (error.code === 'PGRST116') { // Mã lỗi của Supabase khi không tìm thấy dòng nào
      return { data: [], error: null, message: 'Cart is empty', status: 200 }
    }
    throw error
  }

  return {
    data: cartData.cart_items,
    error: null,
    message: 'Cart items fetched successfully',
    status: 200
  }
}