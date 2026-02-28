import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

// POST /api/admin/create-file
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // 1. Tạo tên file duy nhất
    const fileExtension = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`
    const filePath = `${fileName}`

    // 2. Upload file vào bucket 'image'
    // Lưu ý: file ở đây là một đối tượng Blob/File, Supabase SDK xử lý được trực tiếp
    const { data: uploadData, error: uploadError } = await getSupabase().storage
      .from('image')
      .upload(filePath, file)

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // 3. Lấy Public URL
    const { data: { publicUrl } } = getSupabase().storage
      .from('image')
      .getPublicUrl(filePath)

    // 4. Trả về response dạng JSON
    return NextResponse.json({ url: publicUrl }, { status: 200 })

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}