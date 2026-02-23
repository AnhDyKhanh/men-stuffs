import { Navbar } from '@/components/layout/Navbar'
import { ProductCardSample } from '@/components/product/ProductCardSample'
import { Button } from '@/components/ui/button'

/**
 * Minimal layout example: dark navbar, product card, accent button.
 * Use this as reference for luxury men style.
 */
export function LayoutExample() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 py-10">
        <section className="mb-10">
          <h1 className="mb-2 text-2xl font-semibold text-foreground">
            Luxury Men Style
          </h1>
          <p className="mb-6 text-muted-foreground">
            Dark theme · Silver accent · Subtle shadow
          </p>
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </section>
        <section>
          <h2 className="mb-4 text-lg font-medium text-foreground">
            Product card sample
          </h2>
          <div className="grid max-w-sm gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ProductCardSample />
            <ProductCardSample title="Leather Belt" price="890,000₫" />
            <ProductCardSample title="Silk Tie" price="450,000₫" />
          </div>
        </section>
      </main>
    </div>
  )
}
