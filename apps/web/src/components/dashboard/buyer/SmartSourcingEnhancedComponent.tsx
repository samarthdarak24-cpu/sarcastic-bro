'use client';

import React, { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  farmerName: string;
  qualityGrade?: string;
}

export const SmartSourcingEnhancedComponent: React.FC<{ buyerId: string }> = ({ buyerId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ category: '', minPrice: 0, maxPrice: 10000 });
  const { socket } = useSocket();

  useEffect(() => {
    loadProducts();
    if (socket) {
      socket.on('product:created', (product) => {
        setProducts(prev => [product, ...prev]);
      });
      socket.on('price:updated', (update) => {
        setProducts(prev => prev.map(p => p.id === update.productId ? { ...p, price: update.newPrice } : p));
      });
    }
    return () => {
      socket?.off('product:created');
      socket?.off('price:updated');
    };
  }, [socket]);

  const loadProducts = async () => {
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        category: filters.category,
        minPrice: filters.minPrice.toString(),
        maxPrice: filters.maxPrice.toString(),
      });
      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Smart Sourcing</h2>
      
      <div className="mb-4 space-y-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full border rounded px-3 py-2"
        />
        <div className="grid grid-cols-3 gap-2">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="border rounded px-3 py-2"
          >
            <option value="">All Categories</option>
            <option value="fruit">Fruit</option>
            <option value="vegetable">Vegetable</option>
            <option value="grain">Grain</option>
          </select>
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: parseFloat(e.target.value) })}
            placeholder="Min Price"
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: parseFloat(e.target.value) })}
            placeholder="Max Price"
            className="border rounded px-3 py-2"
          />
        </div>
        <button
          onClick={loadProducts}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg transition">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.farmerName}</p>
            <p className="text-xl font-bold text-green-600 mt-2">₹{product.price}</p>
            <p className="text-sm text-gray-500">Stock: {product.quantity} kg</p>
            {product.qualityGrade && (
              <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                {product.qualityGrade}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
