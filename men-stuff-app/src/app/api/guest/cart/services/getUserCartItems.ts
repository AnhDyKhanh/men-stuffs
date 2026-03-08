import { getSupabase } from "@/lib/supabase";
import { getCurrentCustomerId } from "../../services/getCustomerAccount";

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
          id,
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
    if (error.code === 'PGRST116') {
      return { data: { cartItems: [], cartId: null }, error: null, message: 'Cart is empty', status: 200 }
    }
    throw error
  }

  const rawItems = cartData?.cart_items ?? []
  const cartItems = rawItems.map((row: unknown) => {
    const r = row as {
      id: string
      quantity: number
      product_id: string
      price_at_time?: number | null
      product?: unknown
    }
    const rawProduct = r.product
    const p = Array.isArray(rawProduct) ? rawProduct[0] : rawProduct
    const prod = p as { id?: string; name?: string; price?: number; discount_price?: number | null; description?: string; origin_image?: string } | null | undefined
    const unitPrice = r.price_at_time ?? prod?.discount_price ?? prod?.price ?? 0
    return {
      id: r.id,
      product_id: r.product_id,
      quantity: r.quantity,
      price: Number(unitPrice),
      product: {
        id: prod?.id ?? '',
        name: prod?.name ?? '',
        price: prod?.price ?? 0,
        discount_price: prod?.discount_price ?? 0,
        description: prod?.description ?? '',
        origin_image: prod?.origin_image ?? '',
      },
    }
  })

  return {
    data: {
      cartItems,
      cartId: cartData?.id ?? null,
    },
    error: null,
    message: 'Cart items fetched successfully',
    status: 200,
  }
}