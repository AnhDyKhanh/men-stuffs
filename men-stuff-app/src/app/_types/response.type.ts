export type Data<T> = {
  data: T | null
  error: string | null
  message: string | null
  status: number | null
}

export type PaginatedData<T> = Data<T> & {
  total?: number
}