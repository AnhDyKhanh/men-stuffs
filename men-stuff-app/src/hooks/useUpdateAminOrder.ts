import { API_ROUTES } from "@/constants/apiRouter";
import { OrderStatus } from "@/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateOrderStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const res = await fetch(API_ROUTES.ORDERS.PATCH_STATUS(id), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Cập nhật thất bại')
      return data
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['@admin-orders'] })
      toast.success('Đã cập nhật trạng thái đơn hàng')
    },
    onError: (e: Error) => {
      toast.error(e.message || 'Có lỗi xảy ra')
    },
  })
}
