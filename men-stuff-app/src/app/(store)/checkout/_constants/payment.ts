import { PaymentMethod } from "@/enum/payment.enum"

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.COD]: 'COD (Thanh toán khi nhận hàng)',
  [PaymentMethod.BANK_TRANSFER]: 'Chuyển khoản ngân hàng',
  [PaymentMethod.MOMO]: 'Ví MoMo',
  [PaymentMethod.AT_SHOP]: 'Nhận tại shop',
}