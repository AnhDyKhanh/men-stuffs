import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Navbar() {
  return (
    <header className="border-border bg-background/95 sticky top-0 z-50 w-full border-b shadow-sm backdrop-blur">
      <nav className="container flex h-14 items-center justify-between px-4">
        <Link href="/" className="text-foreground font-semibold">
          Men Stuffs
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/vi">Store</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/vi/login">Login</Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}
