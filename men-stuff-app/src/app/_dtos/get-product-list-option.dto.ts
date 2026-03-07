export interface ProductQueryOptions {
  page?: number;
  size?: number;
  orderBy?: string;
  ascending?: boolean;
  /** Filter by category id */
  categoryId?: string | null;
  /** Search in name and description */
  search?: string | null;
}