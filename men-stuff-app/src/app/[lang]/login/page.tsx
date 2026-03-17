'use client'

import { LoginForm } from './_components/LoginForm'
import { labels, BASE_PATH } from '@/lib/labels'
import { useState } from 'react'

export default function LoginPage() {
  const [open, setOpen] = useState(true)

  return (
    <div
      className="bg-background flex min-h-screen w-full items-center justify-center"
      style={{
        // BỎ chữ /public đi, chỉ bắt đầu từ /bg
        backgroundImage: `url('/bg/backGround.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <LoginForm basePath={BASE_PATH} open={true} onOpenChange={setOpen} />
    </div>
  )
}
