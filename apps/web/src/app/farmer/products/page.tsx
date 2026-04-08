'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { productService } from '@/services/productService';
import { useSocket } from '@/hooks/useSocket';

interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  grade: string;
  description: string;
  image?: string;
  farmerId: string;
  createdAt: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SOLD_OUT';
}

export default function FarmerProductsPage() {
  const { user } = useAuth();
  const socket = useSocket();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ACTIVE');

  useEffect(() => {
    loadProducts();
  }, [filter]);

  useEffect(() => {
    if (!socket) return;
    socket.on('product:updated', (updatedProduct: Product) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
    });
    socket.on('product:created', (newProduct: Product) => {
      setProducts((prev) => [newProduct, ...prev]);
    });
    socket.on('product:deleted', (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    });
    return () => {
      socket.off('product:updated');
      socket.off('product:created');
      socket.off('product:deleted');
    };
  }, [socket]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const query = filter === 'ALL' ? '' : `?status=${filter}`;
      const response = await productService.getFarmerProducts(query);
      setProducts(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      setProducts([
        {
          id: '1',
          name: 'Organic Wheat',
          category: 'Cereals',
          quantity: 500,
          unit: 'kg',
          price: 45,
          grade: 'A+',
          description: 'Premium organic wheat from verified farm',
          farmerId: user?.id || '',
          createdAt: new Date().toISOString(),
          status: 'ACTIVE',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productService.deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  const handleStatusChange = async (
    productId: string,
    newStatus: 'ACTIVE' | 'INACTIVE' | 'SOLD_OUT'
  ) => {
    try {
      await productService.updateProduct(productId, { status: newStatus });
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, status: newStatus } : p
        )
      );
    } catch (err) {
      setError('Failed to update product status');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-green-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <Link href="/farmer/dashboard" className="text-green-600 hover:text-green-700">
                <span className="material-symbols-outlined">arrow_back</span>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  My Products
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {products.length} product{products.length !== 1 ? 's' : ''} listed
                </p>
              </div>
            </div>
            <Link
              href="/farmer/products/create"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">add</span>
              Add Product
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                filter === status
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:border-green-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 h-96 animate-pulse"
              >
                <div className="h-40 bg-gray-200 dark:bg-slate-700 rounded-lg mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-slate-700 block mb-4">
              inventory_2
            </span>
            <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">
              No products yet
            </h2>
            <p className="text-gray-500 dark:text-gray-500 mb-6">
              Create your first product listing to start selling
            </p>
            <Link
              href="/farmer/products/create"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all"
            >
              <span className="material-symbols-outlined">add</span>
              Create First Product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-slate-700 group"
              >
                <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-slate-500">
                      agriculture
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {product.category}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                        product.status === 'ACTIVE'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : product.status === 'SOLD_OUT'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {product.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-100 dark:border-slate-700">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Stock
                      </p>
                      <p className="font-bold text-gray-900 dark:text-white">
                        {product.quantity} {product.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Grade
                      </p>
                      <p className="font-bold text-gray-900 dark:text-white">
                        {product.grade}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 mb-4">
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      ₹{product.price}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      per {product.unit}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/farmer/products/${product.id}`}
                      className="flex-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 py-2 rounded-lg font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all text-center text-sm"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() =>
                        handleStatusChange(
                          product.id,
                          product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
                        )
                      }
                      className="flex-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-slate-600 transition-all text-sm"
                    >
                      {product.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(product.id)}
                    className="w-full mt-2 text-red-600 dark:text-red-400 py-2 rounded-lg font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
