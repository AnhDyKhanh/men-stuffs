// app/api/auth/register/route.ts
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getSupabase } from '@/lib/supabase'

const ACCOUNT_TABLE = 'account'
const CUSTOMER_TABLE = 'customer'
const BCRYPT_ROUNDS = 12

interface RegisterBody {
  email?: string
  password?: string
  full_name?: string
  phone?: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, full_name, phone } = body as RegisterBody

    // --- Validate input ---
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email và mật khẩu là bắt buộc' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Mật khẩu phải có ít nhất 8 ký tự' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()
    const supabase = getSupabase()

    // --- Check email tồn tại ---
    const { data: existing } = await supabase
      .from(ACCOUNT_TABLE)
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'Email đã được sử dụng' },
        { status: 409 }
      )
    }

    // --- Hash password ---
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS)

    // --- Insert account ---
    const now = new Date().toISOString()
    const { data: newAccount, error: accountError } = await supabase
      .from(ACCOUNT_TABLE)
      .insert({
        email: normalizedEmail,
        password: hashedPassword,
        status: 'active',
        created_at: now,
        updated_at: now,
      })
      .select('id')
      .single()

    if (accountError || !newAccount) {
      console.error('[register] insert account error:', accountError)
      return NextResponse.json(
        { error: 'Không thể tạo tài khoản' },
        { status: 500 }
      )
    }

    // --- Insert customer (cùng id với account để tiện join) ---
    const { error: customerError } = await supabase
      .from(CUSTOMER_TABLE)
      .insert({
        id: newAccount.id,       // dùng chung UUID với account
        account_id: newAccount.id,
        full_name: full_name?.trim() ?? null,
        phone: phone?.trim() ?? null,
        point: 0,
        avata: null,
      })

    if (customerError) {
      // Rollback account vừa tạo để tránh orphan record
      console.error('[register] insert customer error:', customerError)
      await supabase.from(ACCOUNT_TABLE).delete().eq('id', newAccount.id)

      return NextResponse.json(
        { error: 'Không thể khởi tạo thông tin khách hàng' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Đăng ký thành công' },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}