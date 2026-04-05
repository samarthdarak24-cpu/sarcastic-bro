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
  sales: number;
  revenue: number;
}

export default function SmartProductHub() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, [filter]);

  const loadProducts = async () => {
    setLoading(true);
    setTimeout(() => {
      setProducts([
        { id: '1', name: 'Organic Tomatoes', category: 'Vegetables', price: 48, quantity: 450, unit: 'kg', status: 'active', sales: 234, revenue: 21600 },
        { id: '2', name: 'Basmati Rice', category: 'Grains', price: 85, quantity: 1200, unit: 'kg', status: 'active', sales: 456, revenue: 102000 },
        { id: '3', name: 'Fresh Mangoes', category: 'Fruits', price: 125, quantity: 80, unit: 'kg', status: 'low_stock', sales: 189, revenue: 22500 },
        { id: '4', name: 'Turmeric Powder', category: 'Spices', price: 320, quantity: 50, unit: 'kg', status: 'low_stock', sales: 123, revenue: 25600 },
        { id: '5', name: 'Green Chillies', category: 'Vegetables', price: 65, quantity: 0, unit: 'kg', status: 'out_of_stock', sales: 0, revenue: 0 },
        { id: '6', name: 'Wheat Flour', category: 'Grains', price: 42, quantity: 850, unit: 'kg', status: 'active', sales: 345, revenue: 35700 },
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

  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
  const totalSales = products.reduce((sum, p) => sum + p.sales, 0);

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
          <div className="stat-icon bg-purple-100">💰</div>
          <div className="stat-content">
            <p className="stat-label">Total Revenue</p>
            <p className="stat-value">₹{(totalRevenue / 1000).toFixed(0)}K</p>
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

      <div className="products-layout">
        <div className="products-list">
          {loading ? (
            <div className="loading-state">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <p>No products found</p>
            </div>
          ) : (
            products.map(product => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className={`product-item ${selectedProduct?.id === product.id ? 'selected' : ''}`}
              >
                <div className="product-header">
                  <h4>{product.name}</h4>
                  <span className={`status-badge ${getStatusColor(product.status)}`}>
                    {product.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="product-category">{product.category}</p>
                <div className="product-stats">
                  <span>₹{product.price}/{product.unit}</span>
                  <span>{product.quantity} {product.unit}</span>
                </div>
                <div className="product-metrics">
                  <span>Sales: {product.sales}</span>
                  <span>Revenue: ₹{product.revenue.toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="product-details">
          {selectedProduct ? (
            <>
              <div className="details-header">
                <h3>{selectedProduct.name}</h3>
                <span className={`status-badge ${getStatusColor(selectedProduct.status)}`}>
                  {selectedProduct.status.replace('_', ' ')}
                </span>
              </div>

              <div className="details-info">
                <div className="info-row">
                  <span className="label">Category:</span>
                  <span className="value">{selectedProduct.category}</span>
                </div>
                <div className="info-row">
                  <span className="label">Price:</span>
                  <span className="value">₹{selectedProduct.price}/{selectedProduct.unit}</span>
                </div>
                <div className="info-row">
                  <span className="label">Stock:</span>
                  <span className="value">{selectedProduct.quantity} {selectedProduct.unit}</span>
                </div>
                <div className="info-row">
                  <span className="label">Total Sales:</span>
                  <span className="value">{selectedProduct.sales} orders</span>
                </div>
                <div className="info-row">
                  <span className="label">Revenue:</span>
                  <span className="value">₹{selectedProduct.revenue.toLocaleString()}</span>
                </div>
              </div>

              <div className="actions-section">
                <button className="btn-edit">Edit Product</button>
                <button className="btn-delete">Delete Product</button>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <p>Select a product to view details</p>
            </div>
          )}
        </div>
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

        .products-layout {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 24px;
          height: calc(100vh - 400px);
        }

        .products-list {
          background: white;
          border-radius: 12px;
          padding: 16px;
          overflow-y: auto;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .product-item {
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 12px;
          cursor: pointer;
          border: 2px solid #e5e7eb;
          transition: all 0.2s;
        }

        .product-item:hover {
          border-color: #667eea;
          transform: translateX(4px);
        }

        .product-item.selected {
          background: #f3f4f6;
          border-color: #667eea;
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
          font-size: 15px;
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
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .product-stats {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .product-metrics {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #6b7280;
        }

        .product-details {
          background: white;
          border-radius: 12px;
          padding: 24px;
          overflow-y: auto;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .details-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #e5e7eb;
        }

        .details-info {
          margin-bottom: 24px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .info-row .label {
          color: #6b7280;
          font-weight: 500;
        }

        .info-row .value {
          font-weight: 600;
          color: #1f2937;
        }

        .actions-section {
          display: flex;
          gap: 12px;
        }

        .btn-edit,
        .btn-delete {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: transform 0.2s;
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

        .no-selection {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #9ca3af;
        }

        .loading-state,
        .empty-state {
          text-align: center;
          padding: 40px;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}
