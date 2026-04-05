'use client';

import React, { useState, useEffect } from 'react';

interface Order {
  id: string;
  product: string;
  quantity: number;
  buyer: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  deliveryDate: string;
}

export default function OrderControl() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    setLoading(true);
    setTimeout(() => {
      setOrders([
        { id: 'ORD-001', product: 'Wheat', quantity: 500, buyer: 'ABC Traders', amount: 25000, status: 'pending', date: '2024-01-15', deliveryDate: '2024-01-20' },
        { id: 'ORD-002', product: 'Rice', quantity: 300, buyer: 'XYZ Corp', amount: 18000, status: 'confirmed', date: '2024-01-14', deliveryDate: '2024-01-19' },
        { id: 'ORD-003', product: 'Corn', quantity: 400, buyer: 'PQR Ltd', amount: 12000, status: 'shipped', date: '2024-01-13', deliveryDate: '2024-01-18' },
        { id: 'ORD-004', product: 'Soybeans', quantity: 600, buyer: 'LMN Buyers', amount: 36000, status: 'delivered', date: '2024-01-12', deliveryDate: '2024-01-17' },
      ]);
      setLoading(false);
    }, 500);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-500',
      confirmed: 'bg-blue-500',
      shipped: 'bg-purple-500',
      delivered: 'bg-green-500',
      cancelled: 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="order-control">
      <div className="header-section">
        <h2 className="text-2xl font-bold text-gray-800">Order Control</h2>
        <button className="btn-primary">
          + Create Order
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-yellow-100">⏳</div>
          <div className="stat-content">
            <p className="stat-label">Pending</p>
            <p className="stat-value">{orders.filter(o => o.status === 'pending').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-blue-100">✅</div>
          <div className="stat-content">
            <p className="stat-label">Confirmed</p>
            <p className="stat-value">{orders.filter(o => o.status === 'confirmed').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-purple-100">🚚</div>
          <div className="stat-content">
            <p className="stat-label">Shipped</p>
            <p className="stat-value">{orders.filter(o => o.status === 'shipped').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-green-100">📦</div>
          <div className="stat-content">
            <p className="stat-label">Delivered</p>
            <p className="stat-value">{orders.filter(o => o.status === 'delivered').length}</p>
          </div>
        </div>
      </div>

      <div className="filter-tabs">
        {['all', 'pending', 'confirmed', 'shipped', 'delivered'].map(tab => (
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
            <div className="loading-state">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <p>No orders found</p>
            </div>
          ) : (
            orders.map(order => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`order-item ${selectedOrder?.id === order.id ? 'selected' : ''}`}
              >
                <div className="order-header">
                  <h4>{order.id}</h4>
                  <span className={`status-badge ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <p className="order-product">{order.product} - {order.quantity} kg</p>
                <p className="order-buyer">Buyer: {order.buyer}</p>
                <p className="order-amount">₹{order.amount.toLocaleString()}</p>
              </div>
            ))
          )}
        </div>

        <div className="order-details">
          {selectedOrder ? (
            <>
              <div className="details-header">
                <h3>Order {selectedOrder.id}</h3>
                <span className={`status-badge ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>

              <div className="details-info">
                <div className="info-row">
                  <span className="label">Product:</span>
                  <span className="value">{selectedOrder.product}</span>
                </div>
                <div className="info-row">
                  <span className="label">Quantity:</span>
                  <span className="value">{selectedOrder.quantity} kg</span>
                </div>
                <div className="info-row">
                  <span className="label">Buyer:</span>
                  <span className="value">{selectedOrder.buyer}</span>
                </div>
                <div className="info-row">
                  <span className="label">Amount:</span>
                  <span className="value">₹{selectedOrder.amount.toLocaleString()}</span>
                </div>
                <div className="info-row">
                  <span className="label">Order Date:</span>
                  <span className="value">{new Date(selectedOrder.date).toLocaleDateString()}</span>
                </div>
                <div className="info-row">
                  <span className="label">Delivery Date:</span>
                  <span className="value">{new Date(selectedOrder.deliveryDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="actions-section">
                <button className="btn-confirm">Confirm Order</button>
                <button className="btn-cancel">Cancel Order</button>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <p>Select an order to view details</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .order-control {
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

        .order-product {
          font-size: 14px;
          color: #4b5563;
          margin-bottom: 4px;
        }

        .order-buyer {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .order-amount {
          font-size: 16px;
          font-weight: 600;
          color: #059669;
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

        .btn-confirm,
        .btn-cancel {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: transform 0.2s;
        }

        .btn-confirm {
          background: #10b981;
          color: white;
        }

        .btn-cancel {
          background: #ef4444;
          color: white;
        }

        .btn-confirm:hover,
        .btn-cancel:hover {
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
