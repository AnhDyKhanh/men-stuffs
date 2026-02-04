import type { PlaceholderProduct } from "@/app/_constants/placeholderData";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: PlaceholderProduct[];
  buyNowLabel?: string;
  /** Number of columns on large screens (default 4) */
  columns?: 2 | 3 | 4;
}

const COLUMN_CLASSES = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
} as const;

export default function ProductGrid({
  products,
  buyNowLabel,
  columns = 4,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="text-center text-neutral-500 py-12">
        No products to display.
      </p>
    );
  }

  return (
    <ul
      className={`grid gap-6 ${COLUMN_CLASSES[columns]}`}
      role="list"
      aria-label="Product list"
    >
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} buyNowLabel={buyNowLabel} />
        </li>
      ))}
    </ul>
  );
}
