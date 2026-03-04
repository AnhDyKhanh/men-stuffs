import { useQuery } from '@tanstack/react-query'
import type { Category } from '../_types/category'
import { getAllCategoryMutation } from './getAllCategoryMutation'

async function fetchAllCategories(): Promise<Category[]> {
  const res = await getAllCategoryMutation()

  if (Array.isArray(res)) {
    return res as Category[]
  }

  if (Array.isArray((res as { data?: unknown }).data)) {
    return (res as { data: Category[] }).data
  }

  return []
}

export function useGetAllCategories() {
  return useQuery({
    queryKey: ['@get-all-categories'],
    queryFn: fetchAllCategories,
    placeholderData: (previousData) => previousData,
  })
}

