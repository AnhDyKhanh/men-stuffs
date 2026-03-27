// src/app/api/admin/services/uploadImage.ts
import { getSupabaseAdmin } from '@/lib/supabase'

export async function uploadImage(file: File): Promise<{ url: string } | { error: string }> {
  const supabase = getSupabaseAdmin()

  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`

  const { error } = await supabase.storage.from('image').upload(fileName, file)
  if (error) return { error: error.message }

  const { data: { publicUrl } } = supabase.storage.from('image').getPublicUrl(fileName)
  return { url: publicUrl }
}