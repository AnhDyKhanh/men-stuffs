export type OrderNotification = {
  id: string
  order_id: string
  customer_id: string
  content: string
  is_read: boolean
  created_at: Date | null
}

