export interface ProductQueryOptions {
  page?: number;
  size?: number;
  orderBy?: string;
  ascending?: boolean;
  /** Tìm theo tên sản phẩm */
  search?: string;
  /** Lọc theo category_id */
  categoryId?: string;
  /** Lọc theo ngày tạo từ (ISO string) */
  dateFrom?: string;
  /** Lọc theo ngày tạo đến (ISO string) */
  dateTo?: string;
}
