// ./_components/useAddToCart.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useAddToCart = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: any) => {
            // API thêm vào giỏ
            return fetch('/api/cart', { method: 'POST', body: JSON.stringify(payload) })
        },
        onSuccess: () => {
            // ĐÂY LÀ PHẦN QUAN TRỌNG:
            // 'cart' là cái Key mà bạn dùng trong useQuery để lấy danh sách giỏ hàng
            queryClient.invalidateQueries({ queryKey: ['cart'] })

            // Nếu bạn muốn mở luôn Side Cart sau khi thêm thành công:
            // openSideCart(); 
        },
    })
}