'use client';

import React, { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  status: 'active' | 'low_stock' | 'out_of_stock';
  image: string;
}

export function SmartProductHubModern() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [filter]);

  const loadProducts = async () => {
    setLoading(true);
    setTimeout(() => {
      setProducts([
        { id: '1', name: 'Organic Tomatoes', category: 'Vegetables', price: 48, quantity: 450, unit: 'kg', status: 'active', image: 'https://images.unsplash.com/photo-1546470427-227e9e3e0e4e?w=400' },
        { id: '2', name: 'Basmati Rice', category: 'Grains', price: 85, quantity: 1200, unit: 'kg', status: 'active', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
        { id: '3', name: 'Fresh Mangoes', category: 'Fruits', price: 125, quantity: 80, unit: 'kg', status: 'low_stock', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400' },
        { id: '4', name: 'Green Chillies', category: 'Vegetables', price: 65, quantity: 0, unit: 'kg', status: 'out_of_stock', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400' },
      ]);
      setLoading(false);
    }, 500);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-500',
      low_stock: 'bg-yellow-500',
      out_of_stock: 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="product-hub">
      <div className="header-section">
        <h2 className="text-2xl font-bold text-gray-800">Smart Product Hub</h2>
        <button className="btn-primary">
          + Add Product
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-green-100">📦</div>
          <div className="stat-content">
            <p className="stat-label">Total Products</p>
            <p className="stat-value">{products.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-blue-100">✅</div>
          <div className="stat-content">
            <p className="stat-label">Active</p>
            <p className="stat-value">{products.filter(p => p.status === 'active').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-yellow-100">⚠️</div>
          <div className="stat-content">
            <p className="stat-label">Low Stock</p>
            <p className="stat-value">{products.filter(p => p.status === 'low_stock').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-red-100">❌</div>
          <div className="stat-content">
            <p className="stat-label">Out of Stock</p>
            <p className="stat-value">{products.filter(p => p.status === 'out_of_stock').length}</p>
          </div>
        </div>
      </div>

      <div className="filter-tabs">
        {['all', 'active', 'low_stock', 'out_of_stock'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`filter-tab ${filter === tab ? 'active' : ''}`}
          >
            {tab.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      <div className="products-grid">
        {loading ? (
          <div className="loading-state">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p>No products found</p>
          </div>
        ) : (
          products.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <div className="product-content">
                <div className="product-header">
                  <h4>{product.name}</h4>
                  <span className={`status-badge ${getStatusColor(product.status)}`}>
                    {product.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="product-category">{product.category}</p>
                <div className="product-details">
                  <div className="detail-item">
                    <span className="label">Price:</span>
                    <span className="value">₹{product.price}/{product.unit}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Stock:</span>
                    <span className="value">{product.quantity} {product.unit}</span>
                  </div>
                </div>
                <div className="product-actions">
                  <button className="btn-edit">Edit</button>
                  <button className="btn-delete">Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .product-hub {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: transform 0.2s;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .stat-label {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: bold;
          color: #1f2937;
        }

        .filter-tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .filter-tab {
          padding: 10px 20px;
          border-radius: 8px;
          border: 2px solid #e5e7eb;
          background: white;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .filter-tab.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .product-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }

        .product-card:hover {
          transform: translateY(-4px);
        }

        .product-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .product-content {
          padding: 16px;
        }

        .product-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .product-header h4 {
          font-weight: 600;
          color: #1f2937;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
        }

        .product-category {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 12px;
        }

        .product-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
        }

        .detail-item .label {
          color: #6b7280;
          font-size: 14px;
        }

        .detail-item .value {
          font-weight: 600;
          color: #1f2937;
        }

        .product-actions {
          display: flex;
          gap: 8px;
        }

        .btn-edit,
        .btn-delete {
          flex: 1;
          padding: 8px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s;
        }

        .btn-edit {
          background: #667eea;
          color: white;
        }

        .btn-delete {
          background: #ef4444;
          color: white;
        }

        .btn-edit:hover,
        .btn-delete:hover {
          transform: translateY(-2px);
        }

        .loading-state,
        .empty-state {
          text-align: center;
          padding: 40px;
          color: #9ca3af;
          grid-column: 1 / -1;
        }
      `}</style>
    </div>
  );
}
