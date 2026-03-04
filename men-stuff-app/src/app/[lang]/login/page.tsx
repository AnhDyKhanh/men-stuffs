'use client'

import { LoginForm } from './_components/LoginForm'
import { labels, BASE_PATH } from '@/lib/labels'
import { useState } from 'react'

export default function LoginPage() {
  const [open, setOpen] = useState(true)

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-background"
      style={{
        // BỎ chữ /public đi, chỉ bắt đầu từ /bg
        backgroundImage: `url('/bg/backGround.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <LoginForm basePath={BASE_PATH} open={true} onOpenChange={setOpen} />
    </div>
  )
}