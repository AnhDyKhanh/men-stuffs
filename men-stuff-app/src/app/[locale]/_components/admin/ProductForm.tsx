'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Product, ProductStatus } from '@/lib/mock-products';

interface ProductFormProps {
  product?: Product;
  locale: string;
  translations: {
    productName: string;
    productNameVi: string;
    productNameEn: string;
    productPrice: string;
    productStatus: string;
    active: string;
    inactive: string;
    save: string;
    cancel: string;
  };
}

/**
 * Product form component for create/edit
 */
export default function ProductForm({ product, locale, translations }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name_vi: product?.name_vi || '',
    name_en: product?.name_en || '',
    price: product?.price || 0,
    status: (product?.status || 'active') as ProductStatus,
    thumbnail: product?.thumbnail || '/placeholder-product.jpg',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = product
        ? `/api/admin/products/${product.id}`
        : '/api/admin/products';
      const method = product ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.refresh();
        router.push(`/${locale}/admin/products`);
      } else {
        alert('Failed to save product');
      }
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {translations.productNameVi}
        </label>
        <input
          type="text"
          value={formData.name_vi}
          onChange={(e) => setFormData({ ...formData, name_vi: e.target.value })}
          className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {translations.productNameEn}
        </label>
        <input
          type="text"
          value={formData.name_en}
          onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
          className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {translations.productPrice}
        </label>
        <input
          type="number"
          step="1000"
          min="0"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <p className="mt-1 text-sm text-gray-500">Price in VND</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {translations.productStatus}
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as ProductStatus })}
          className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="active">{translations.active}</option>
          <option value="inactive">{translations.inactive}</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {isSubmitting ? 'Saving...' : translations.save}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/${locale}/admin/products`)}
          className="bg-gray-200 text-black px-6 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          {translations.cancel}
        </button>
      </div>
    </form>
  );
}

