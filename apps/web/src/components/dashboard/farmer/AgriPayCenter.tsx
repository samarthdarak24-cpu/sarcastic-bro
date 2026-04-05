'use client';

import React, { useState, useEffect } from 'react';

interface Payment {
  id: string;
  type: 'received' | 'sent' | 'pending';
  amount: number;
  from: string;
  to: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  method: string;
}

export default function AgriPayCenter() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, [filter]);

  const loadPayments = async () => {
    setLoading(true);
    setTimeout(() => {
      setPayments([
        { id: '1', type: 'received', amount: 25000, from: 'Buyer Corp', to: 'You', date: '2024-01-15', status: 'completed', method: 'UPI' },
        { id: '2', type: 'sent', amount: 5000, from: 'You', to: 'Supplier Ltd', date: '2024-01-14', status: 'completed', method: 'Bank Transfer' },
        { id: '3', type: 'pending', amount: 15000, from: 'ABC Traders', to: 'You', date: '2024-01-13', status: 'pending', method: 'UPI' },
        { id: '4', type: 'received', amount: 30000, from: 'XYZ Buyers', to: 'You', date: '2024-01-12', status: 'completed', method: 'NEFT' },
      ]);
      setLoading(false);
    }, 500);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-500',
      pending: 'bg-yellow-500',
      failed: 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      received: 'text-green-600',
      sent: 'text-red-600',
      pending: 'text-yellow-600'
    };
    return colors[type as keyof typeof colors] || 'text-gray-600';
  };

  const totalReceived = payments.filter(p => p.type === 'received' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const totalSent = payments.filter(p => p.type === 'sent' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="agripay-center">
      <div className="header-section">
        <h2 className="text-2xl font-bold text-gray-800">AgriPay Center</h2>
        <button className="btn-primary">
          + New Payment
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-green-100">💰</div>
          <div className="stat-content">
            <p className="stat-label">Total Received</p>
            <p className="stat-value">₹{(totalReceived / 1000).toFixed(0)}K</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-red-100">📤</div>
          <div className="stat-content">
            <p className="stat-label">Total Sent</p>
            <p className="stat-value">₹{(totalSent / 1000).toFixed(0)}K</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-yellow-100">⏳</div>
          <div className="stat-content">
            <p className="stat-label">Pending</p>
            <p className="stat-value">₹{(totalPending / 1000).toFixed(0)}K</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-blue-100">📊</div>
          <div className="stat-content">
            <p className="stat-label">Net Balance</p>
            <p className="stat-value">₹{((totalReceived - totalSent) / 1000).toFixed(0)}K</p>
          </div>
        </div>
      </div>

      <div className="filter-tabs">
        {['all', 'received', 'sent', 'pending'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`filter-tab ${filter === tab ? 'active' : ''}`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="payments-grid">
        {loading ? (
          <div className="loading-state">Loading payments...</div>
        ) : payments.length === 0 ? (
          <div className="empty-state">
            <p>No payments found</p>
          </div>
        ) : (
          payments.map(payment => (
            <div key={payment.id} className="payment-card">
              <div className="card-header">
                <div className="payment-type">
                  <span className={getTypeColor(payment.type)}>
                    {payment.type === 'received' ? '↓' : payment.type === 'sent' ? '↑' : '⏳'} {payment.type.toUpperCase()}
                  </span>
                </div>
                <span className={`status-badge ${getStatusColor(payment.status)}`}>
                  {payment.status}
                </span>
              </div>
              <div className="payment-amount">
                <span className="amount">₹{payment.amount.toLocaleString()}</span>
              </div>
              <div className="payment-details">
                <div className="detail-row">
                  <span className="label">From:</span>
                  <span className="value">{payment.from}</span>
                </div>
                <div className="detail-row">
                  <span className="label">To:</span>
                  <span className="value">{payment.to}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Method:</span>
                  <span className="value">{payment.method}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Date:</span>
                  <span className="value">{new Date(payment.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .agripay-center {
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

        .payments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .payment-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }

        .payment-card:hover {
          transform: translateY(-4px);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .payment-type {
          font-weight: 600;
          font-size: 14px;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
        }

        .payment-amount {
          margin-bottom: 16px;
        }

        .amount {
          font-size: 32px;
          font-weight: bold;
          color: #1f2937;
        }

        .payment-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }

        .detail-row .label {
          color: #6b7280;
        }

        .detail-row .value {
          font-weight: 600;
          color: #1f2937;
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
