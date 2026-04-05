'use client';

import React, { useState, useEffect } from 'react';

interface AggregationOrder {
  id: string;
  farmerCount: number;
  totalQuantity: number;
  product: string;
  targetPrice: number;
  currentPrice: number;
  status: 'forming' | 'ready' | 'completed' | 'cancelled';
  deadline: string;
}

export default function BulkAggregationEngine() {
  const [orders, setOrders] = useState<AggregationOrder[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<AggregationOrder | null>(null);

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    setLoading(true);
    setTimeout(() => {
      setOrders([
        { id: '1', farmerCount: 45, totalQuantity: 5000, product: 'Wheat', targetPrice: 2500, currentPrice: 2800, status: 'forming', deadline: '2024-12-31' },
        { id: '2', farmerCount: 32, totalQuantity: 3200, product: 'Rice', targetPrice: 3500, currentPrice: 3800, status: 'ready', deadline: '2024-12-25' },
        { id: '3', farmerCount: 28, totalQuantity: 2800, product: 'Corn', targetPrice: 2000, currentPrice: 2200, status: 'forming', deadline: '2024-12-28' },
        { id: '4', farmerCount: 50, totalQuantity: 6000, product: 'Soybeans', targetPrice: 4000, currentPrice: 4500, status: 'completed', deadline: '2024-12-20' },
      ]);
      setLoading(false);
    }, 500);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      forming: 'bg-yellow-500',
      ready: 'bg-green-500',
      completed: 'bg-blue-500',
      cancelled: 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="bulk-aggregation">
      <div className="header-section">
        <h2 className="text-2xl font-bold text-gray-800">Bulk Aggregation Engine</h2>
        <button className="btn-primary">
          + Create Pool
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-blue-100">👥</div>
          <div className="stat-content">
            <p className="stat-label">Active Pools</p>
            <p className="stat-value">{orders.filter(o => o.status === 'forming' || o.status === 'ready').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-green-100">✅</div>
          <div className="stat-content">
            <p className="stat-label">Ready to Ship</p>
            <p className="stat-value">{orders.filter(o => o.status === 'ready').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-purple-100">📦</div>
          <div className="stat-content">
            <p className="stat-label">Total Quantity</p>
            <p className="stat-value">{(orders.reduce((sum, o) => sum + o.totalQuantity, 0) / 1000).toFixed(1)}K kg</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-orange-100">👨‍🌾</div>
          <div className="stat-content">
            <p className="stat-label">Total Farmers</p>
            <p className="stat-value">{orders.reduce((sum, o) => sum + o.farmerCount, 0)}</p>
          </div>
        </div>
      </div>

      <div className="filter-tabs">
        {['all', 'forming', 'ready', 'completed', 'cancelled'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`filter-tab ${filter === tab ? 'active' : ''}`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="orders-layout">
        <div className="orders-list">
          {loading ? (
            <div className="loading-state">Loading pools...</div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <p>No aggregation pools found</p>
            </div>
          ) : (
            orders.map(order => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`order-item ${selectedOrder?.id === order.id ? 'selected' : ''}`}
              >
                <div className="order-header">
                  <h4>{order.product}</h4>
                  <span className={`status-badge ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-stats">
                  <span>👥 {order.farmerCount} farmers</span>
                  <span>📦 {order.totalQuantity} kg</span>
                </div>
                <div className="order-price">
                  <span>Target: ₹{order.targetPrice}</span>
                  <span className="current">Current: ₹{order.currentPrice}</span>
                </div>
                <p className="order-deadline">Deadline: {new Date(order.deadline).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>

        <div className="order-details">
          {selectedOrder ? (
            <>
              <div className="details-header">
                <h3>{selectedOrder.product} Pool</h3>
                <span className={`status-badge ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>

              <div className="details-info">
                <div className="info-row">
                  <span className="label">Pool ID:</span>
                  <span className="value">#{selectedOrder.id}</span>
                </div>
                <div className="info-row">
                  <span className="label">Farmers Joined:</span>
                  <span className="value">{selectedOrder.farmerCount}</span>
                </div>
                <div className="info-row">
                  <span className="label">Total Quantity:</span>
                  <span className="value">{selectedOrder.totalQuantity} kg</span>
                </div>
                <div className="info-row">
                  <span className="label">Target Price:</span>
                  <span className="value">₹{selectedOrder.targetPrice}/kg</span>
                </div>
                <div className="info-row">
                  <span className="label">Current Price:</span>
                  <span className="value">₹{selectedOrder.currentPrice}/kg</span>
                </div>
                <div className="info-row">
                  <span className="label">Deadline:</span>
                  <span className="value">{new Date(selectedOrder.deadline).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="actions-section">
                <button className="btn-join">Join Pool</button>
                <button className="btn-share">Share Pool</button>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <p>Select a pool to view details</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .bulk-aggregation {
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

        .orders-layout {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 24px;
          height: calc(100vh - 400px);
        }

        .orders-list {
          background: white;
          border-radius: 12px;
          padding: 16px;
          overflow-y: auto;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .order-item {
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 12px;
          cursor: pointer;
          border: 2px solid #e5e7eb;
          transition: all 0.2s;
        }

        .order-item:hover {
          border-color: #667eea;
          transform: translateX(4px);
        }

        .order-item.selected {
          background: #f3f4f6;
          border-color: #667eea;
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .order-header h4 {
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

        .order-stats {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .order-price {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .order-price .current {
          color: #059669;
        }

        .order-deadline {
          font-size: 12px;
          color: #9ca3af;
        }

        .order-details {
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

        .btn-join,
        .btn-share {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: transform 0.2s;
        }

        .btn-join {
          background: #667eea;
          color: white;
        }

        .btn-share {
          background: #10b981;
          color: white;
        }

        .btn-join:hover,
        .btn-share:hover {
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
