import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ProductCardSampleProps {
  title?: string
  price?: string
}

export function ProductCardSample({
  title = 'Classic Wool Blazer',
  price = '2,450,000₫',
}: ProductCardSampleProps) {
  return (
    <Card className="overflow-hidden shadow-[var(--shadow)]">
      <div className="aspect-[4/5] bg-muted" />
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="py-0">
        <p className="text-sm text-muted-foreground">{price}</p>
      </CardContent>
      <CardFooter className="pt-4">
        <Button variant="secondary" className="w-full">
          View details
        </Button>
      </CardFooter>
    </Card>
  )
}
