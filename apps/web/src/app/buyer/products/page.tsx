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
  farmerName: string;
  farmerId: string;
  description: string;
  rating?: number;
  reviews?: number;
  image?: string;
  createdAt: string;
  status: 'ACTIVE';
}

export default function BuyerProductsPage() {
  const { user } = useAuth();
  const socket = useSocket();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<Map<string, number>>(new Map());

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [grade, setGrade] = useState('ALL');
  const [sortBy, setSortBy] = useState('relevance');

  // Categories
  const categories = ['ALL', 'Cereals', 'Pulses', 'Vegetables', 'Fruits', 'Herbs'];
  const grades = ['ALL', 'A+', 'A', 'B+', 'B', 'C'];

  useEffect(() => {
    loadProducts();
  }, []);

  // Apply filters whenever any filter changes
  useEffect(() => {
    applyFilters();
  }, [products, search, category, priceRange, grade, sortBy]);

  // Real-time product updates
  useEffect(() => {
    if (!socket) return;
    socket.on('product:created', (newProduct: Product) => {
      setProducts((prev) => [newProduct, ...prev]);
    });
    socket.on('product:updated', (updatedProduct: Product) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === updatedProduct.id ? updatedProduct : p
        )
      );
    });
    socket.on('product:deleted', (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    });
    return () => {
      socket.off('product:created');
      socket.off('product:updated');
      socket.off('product:deleted');
    };
  }, [socket]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch only ACTIVE products for buyers
      const response = await productService.getBuyerProducts('?status=ACTIVE');
      setProducts(response.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load products'
      );
      // Mock data for demo
      setProducts([
        {
          id: '1',
          name: 'Organic Wheat',
          category: 'Cereals',
          quantity: 500,
          unit: 'kg',
          price: 45,
          grade: 'A+',
          farmerName: 'Green Valley Farms',
          farmerId: 'farmer1',
          description: 'Premium organic wheat',
          rating: 4.8,
          reviews: 24,
          createdAt: new Date().toISOString(),
          status: 'ACTIVE',
        },
        {
          id: '2',
          name: 'Basmati Rice',
          category: 'Cereals',
          quantity: 300,
          unit: 'kg',
          price: 120,
          grade: 'A',
          farmerName: 'Family Farm Agriculture',
          farmerId: 'farmer2',
          description: 'High-quality basmati rice',
          rating: 4.9,
          reviews: 32,
          createdAt: new Date().toISOString(),
          status: 'ACTIVE',
        },
        {
          id: '3',
          name: 'Fresh Tomatoes',
          category: 'Vegetables',
          quantity: 200,
          unit: 'kg',
          price: 25,
          grade: 'A',
          farmerName: 'Fresh Harvest Ltd',
          farmerId: 'farmer3',
          description: 'Locally grown fresh tomatoes',
          rating: 4.7,
          reviews: 18,
          createdAt: new Date().toISOString(),
          status: 'ACTIVE',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Search by name or farmer name
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.farmerName.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (category !== 'ALL') {
      filtered = filtered.filter((p) => p.category === category);
    }

    // Grade filter
    if (grade !== 'ALL') {
      filtered = filtered.filter((p) => p.grade === grade);
    }

    // Price range filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange.min && p.price <= priceRange.max
    );

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'newest') {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (productId: string) => {
    const newCart = new Map(cart);
    const currentQty = newCart.get(productId) || 0;
    newCart.set(productId, currentQty + 1);
    setCart(newCart);
  };

  const handleCartUpdate = (productId: string, quantity: number) => {
    const newCart = new Map(cart);
    if (quantity <= 0) {
      newCart.delete(productId);
    } else {
      newCart.set(productId, quantity);
    }
    setCart(newCart);
  };

  const cartTotal = cart.size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-blue-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <Link href="/buyer/dashboard" className="text-blue-600 hover:text-blue-700">
                <span className="material-symbols-outlined">arrow_back</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Shop Products
              </h1>
            </div>

            <Link
              href="/buyer/cart"
              className="relative flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              Cart
              {cartTotal > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cartTotal}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Sidebar Filters */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg h-fit sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">tune</span>
              Filters
            </h2>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search products or farmers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Category
              </label>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`block w-full text-left px-4 py-2 rounded-lg font-medium transition-all ${
                      category === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grade Filter */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Grade
              </label>
              <div className="space-y-2">
                {grades.map((gr) => (
                  <button
                    key={gr}
                    onClick={() => setGrade(gr)}
                    className={`block w-full text-left px-4 py-2 rounded-lg font-medium transition-all ${
                      grade === gr
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {gr}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Price Range (₹)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="number"
                  min="0"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({
                      ...priceRange,
                      min: parseFloat(e.target.value),
                    })
                  }
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({
                      ...priceRange,
                      max: parseFloat(e.target.value),
                    })
                  }
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  placeholder="Max"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ₹{priceRange.min} - ₹{priceRange.max}
              </p>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort & Results */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 dark:text-gray-400 font-semibold">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-semibold"
              >
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-800 dark:text-red-200">
                {error}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, idx) => (
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
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl">
                <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-slate-700 block mb-4">
                  search_off
                </span>
                <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">
                  No products found
                </h2>
                <p className="text-gray-500 dark:text-gray-500">
                  Try adjusting your filters or search query
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProducts.map((product) => {
                  const inCart = cart.get(product.id) || 0;
                  return (
                    <div
                      key={product.id}
                      className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-slate-700 group"
                    >
                      {/* Product Image */}
                      <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
                        <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-slate-500">
                          agriculture
                        </span>
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                              {product.name}
                            </h3>
                            <Link
                              href={`/buyer/suppliers/${product.farmerId}`}
                              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {product.farmerName}
                            </Link>
                          </div>
                          <div className="text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                            {product.grade}
                          </div>
                        </div>

                        {/* Rating */}
                        {product.rating && (
                          <div className="flex items-center gap-1 mb-3">
                            <span className="material-symbols-outlined text-sm text-yellow-500">
                              star
                            </span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                              {product.rating}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              ({product.reviews} reviews)
                            </span>
                          </div>
                        )}

                        {/* Price & Stock */}
                        <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-100 dark:border-slate-700 mb-4">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold">
                              Price
                            </p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              ₹{product.price}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold">
                              Stock
                            </p>
                            <p className="font-bold text-gray-900 dark:text-white">
                              {product.quantity} {product.unit}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Link
                            href={`/buyer/products/${product.id}`}
                            className="flex-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 py-2 rounded-lg font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all text-center text-sm"
                          >
                            View Details
                          </Link>
                          {inCart > 0 ? (
                            <div className="flex-1 flex items-center gap-2 bg-green-100 dark:bg-green-900/30 rounded-lg px-2">
                              <button
                                onClick={() =>
                                  handleCartUpdate(product.id, inCart - 1)
                                }
                                className="flex-1 text-green-700 dark:text-green-300 font-bold hover:scale-110 transition"
                              >
                                -
                              </button>
                              <span className="text-green-700 dark:text-green-300 font-bold">
                                {inCart}
                              </span>
                              <button
                                onClick={() =>
                                  handleCartUpdate(product.id, inCart + 1)
                                }
                                className="flex-1 text-green-700 dark:text-green-300 font-bold hover:scale-110 transition"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(product.id)}
                              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 rounded-lg font-semibold hover:shadow-lg active:scale-95 transition-all"
                            >
                              Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
