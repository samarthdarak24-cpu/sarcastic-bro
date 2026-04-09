'use client';

import React, { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { productService } from '@/services/productService';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  imageUrls: string[];
  qualityGrade?: string;
}

export const SmartProductHub: React.FC<{ userId: string }> = ({ userId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { socket } = useSocket();

  useEffect(() => {
    loadProducts();
    if (socket) {
      socket.on('product:created', (product) => {
        setProducts(prev => [product, ...prev]);
      });
      socket.on('product:updated', (product) => {
        setProducts(prev => prev.map(p => p.id === product.id ? product : p));
      });
      socket.on('product:deleted', (productId) => {
        setProducts(prev => prev.filter(p => p.id !== productId));
      });
    }
    return () => {
      socket?.off('product:created');
      socket?.off('product:updated');
      socket?.off('product:deleted');
    };
  }, [socket]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getByFarmerId(userId);
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Smart Product Hub</h2>
      {loading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg transition">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-gray-600">{product.category}</p>
              <p className="text-xl font-bold text-green-600">₹{product.price}</p>
              <p className="text-sm text-gray-500">Stock: {product.quantity} kg</p>
              {product.qualityGrade && (
                <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  Grade: {product.qualityGrade}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartProductHub;
