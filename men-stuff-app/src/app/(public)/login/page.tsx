// app/login/page.tsx
import { LoginForm } from './_components/LoginForm'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const { redirect } = await searchParams

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
      <LoginForm redirect={redirect ?? null} />
    </div>
  )
}