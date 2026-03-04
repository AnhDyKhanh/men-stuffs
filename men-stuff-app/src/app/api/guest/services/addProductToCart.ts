import { getSupabase } from "@/lib/supabase"
import { getCurrentCustomerId } from "./getCustomerAccount"

export type AddProductToCartDTO = {
  productId: string
  quantity: number
  priceAtTime: number
}

export async function addProductToCart(body: AddProductToCartDTO) {
  const { productId, quantity, priceAtTime } = body
  try {
    const customerId = await getCurrentCustomerId()
    if (!customerId) return { data: null, error: 'Unauthorized', status: 401 }

    const supabase = getSupabase()

    // 1. Lấy Cart Active
    const { data: existingCart, error: fetchError } = await supabase
      .from('cart')
      .select('id')
      .eq('customer_id', customerId)
      .eq('status', 'active')
      .maybeSingle()

    if (fetchError) throw fetchError

    // Xác định cartId (Tạo mới nếu chưa có)
    let cartId = existingCart?.id

    if (!cartId) {
      const { data: newCart, error: createError } = await supabase
        .from('cart')
        .insert({ customer_id: customerId, status: 'active' })
        .select('id')
        .single()

      if (createError) throw createError
      cartId = newCart.id
    }

    // 2. Kiểm tra item hiện tại để cộng dồn số lượng
    const { data: existingItem, error: itemError } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cartId)
      .eq('product_id', productId)
      .maybeSingle()

    if (itemError) throw itemError

    // 3. Upsert sản phẩm
    const { data: finalItem, error: upsertError } = await supabase
      .from('cart_items')
      .upsert({
        id: existingItem?.id, // Có id là update, không có là insert
        cart_id: cartId,
        product_id: productId,
        quantity: (existingItem?.quantity || 0) + quantity,
        price_at_time: priceAtTime,
      })
      .select()
      .single()

    if (upsertError) throw upsertError

    return {
      data: finalItem,
      error: null,
      message: 'Sản phẩm đã nằm gọn trong giỏ!',
      status: 200
    }

  } catch (error: any) {
    console.error('[ADD_TO_CART_ERROR]:', error.message)
    return {
      data: null,
      error: error.message,
      message: 'Có lỗi xảy ra, vui lòng thử lại sau!',
      status: 500
    }
  }
}