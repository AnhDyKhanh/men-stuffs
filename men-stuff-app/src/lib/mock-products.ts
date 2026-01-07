/**
 * Mock product data and CRUD operations
 * In-memory storage for frontend-only implementation
 */

export type ProductStatus = 'active' | 'inactive';

export interface Product {
  id: string;
  name_vi: string;
  name_en: string;
  price: number;
  thumbnail: string;
  status: ProductStatus;
  createdAt: string;
}

// In-memory product storage
let mockProducts: Product[] = [
  {
    id: '1',
    name_vi: 'Áo thun nam',
    name_en: 'Men T-Shirt',
    price: 299000,
    thumbnail: '/placeholder-product.jpg',
    status: 'active',
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    name_vi: 'Quần jean nam',
    name_en: 'Men Jeans',
    price: 599000,
    thumbnail: '/placeholder-product.jpg',
    status: 'active',
    createdAt: new Date('2024-01-20').toISOString(),
  },
  {
    id: '3',
    name_vi: 'Giày thể thao',
    name_en: 'Sports Shoes',
    price: 899000,
    thumbnail: '/placeholder-product.jpg',
    status: 'inactive',
    createdAt: new Date('2024-02-01').toISOString(),
  },
];

/**
 * Get all products
 */
export function getAllProducts(): Product[] {
  return [...mockProducts];
}

/**
 * Get product by ID
 */
export function getProductById(id: string): Product | undefined {
  return mockProducts.find((p) => p.id === id);
}

/**
 * Create a new product
 */
export function createProduct(product: Omit<Product, 'id' | 'createdAt'>): Product {
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  mockProducts.push(newProduct);
  return newProduct;
}

/**
 * Update an existing product
 */
export function updateProduct(id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>): Product | null {
  const index = mockProducts.findIndex((p) => p.id === id);
  if (index === -1) {
    return null;
  }
  mockProducts[index] = {
    ...mockProducts[index],
    ...updates,
  };
  return mockProducts[index];
}

/**
 * Delete a product
 */
export function deleteProduct(id: string): boolean {
  const index = mockProducts.findIndex((p) => p.id === id);
  if (index === -1) {
    return false;
  }
  mockProducts.splice(index, 1);
  return true;
}

/**
 * Get product name based on locale
 */
export function getProductName(product: Product, locale: 'vi' | 'en'): string {
  return locale === 'vi' ? product.name_vi : product.name_en;
}

