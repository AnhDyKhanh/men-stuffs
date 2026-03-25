'use client'

import { RegisterForm } from '../login/_components/RegisterForm'

export default function RegisterPage() {
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
      <RegisterForm />
    </div>
  )
}
