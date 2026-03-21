import Link from 'next/link'
import { cookies } from 'next/headers'
import { labels, BASE_PATH } from '@/lib/labels'
import { getUserRole } from '@/lib/auth'
import LogoutButton from '@/components/shared/LogoutButton'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const userRole = getUserRole(cookieStore)

  if (userRole !== 'admin') {
    return (
      <div className="relative min-h-screen bg-background">
        <div className="pointer-events-none fixed inset-0 bg-void-texture opacity-90" aria-hidden />
        <div className="relative z-10 container mx-auto px-4 py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold text-foreground">Truy cập bị từ chối</h1>
          <p className="mb-4 text-muted-foreground">Bạn cần đăng nhập với tài khoản admin.</p>
          <Link href={`${BASE_PATH}/login`} className="text-primary underline-offset-4 hover:underline">
            Đăng nhập Admin
          </Link>
        </div>
      </div>
    )
  }

  const navLink =
    'block rounded-xl border border-transparent px-4 py-3 text-sm text-muted-foreground transition hover:border-border hover:bg-muted/50 hover:text-foreground'

  return (
    <div className="relative flex min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-void-texture opacity-90" aria-hidden />
      <div className="pointer-events-none fixed inset-0 bg-grid-pattern opacity-40" aria-hidden />

      <aside className="relative z-10 min-h-screen w-64 border-r border-border bg-card/90 backdrop-blur">
        <div className="p-6">
          <Link href={`${BASE_PATH}/dashboard`} className="text-xl font-semibold tracking-tight">
            <span className="text-gradient-gold">Men Stuffs</span>
            <span className="ml-2 text-sm font-normal text-muted-foreground">Admin</span>
          </Link>
        </div>
        <nav className="space-y-1 px-3">
          <Link href={`${BASE_PATH}/dashboard`} className={navLink}>
            {labels.admin.dashboard}
          </Link>
          <Link href={`${BASE_PATH}/order`} className={navLink}>
            {labels.admin.orders}
          </Link>
          <Link href={`${BASE_PATH}/products-management`} className={navLink}>
            {labels.admin.products}
          </Link>
          <Link href={`${BASE_PATH}/categories-management`} className={navLink}>
            {labels.admin.categories}
          </Link>
          <div className="border-t border-border/80 pt-4">
            <LogoutButton />
          </div>
        </nav>
      </aside>

      <div className="relative z-10 flex flex-1 flex-col">
        <header className="border-b border-border bg-card/70 px-6 py-4 backdrop-blur">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-foreground">Bảng điều khiển Admin</h1>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-muted-foreground transition hover:text-foreground">
                {labels.admin.viewStore}
              </Link>
              <span className="text-sm text-border">|</span>
              <span className="font-mono text-xs text-muted-foreground">staff</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
