'use client'

import { LoginForm } from './_components/LoginForm'

export default function LoginPage() {
  return (
    <div
      className="bg-background flex min-h-screen w-full items-center justify-center"
      style={{
        backgroundImage: `url('/bg/backGround.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <LoginForm />
    </div>
  )
}
