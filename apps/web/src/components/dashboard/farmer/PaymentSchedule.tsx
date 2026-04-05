'use client';

import React, { useState, useEffect } from 'react';
import { paymentScheduleService } from '@/services/paymentScheduleService';

export function PaymentSchedule() {
  const [payments, setPayments] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, [filter]);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const data = await paymentScheduleService.getPayments(filter);
      setPayments(data);
    } catch (error) {
      console.error('Failed to load payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-500',
      processing: 'bg-blue-500',
      completed: 'bg-green-500',
      failed: 'bg-red-500',
      overdue: 'bg-orange-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalCompleted = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="payment-schedule">
      <div className="header-section">
        <h2 className="text-2xl font-bold text-gray-800">Payment Schedule</h2>
        <button className="btn-export">📥 Export Report</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-yellow-100">⏳</div>
          <div className="stat-content">
            <p className="stat-label">Pending Payments</p>
            <p className="stat-value">₹{totalPending.toLocaleString()}</p>
            <p className="stat-count">{payments.filter(p => p.status === 'pending').length} payments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-green-100">✅</div>
          <div className="stat-content">
            <p className="stat-label">Completed</p>
            <p className="stat-value">₹{totalCompleted.toLocaleString()}</p>
            <p className="stat-count">{payments.filter(p => p.status === 'completed').length} payments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-orange-100">⚠️</div>
          <div className="stat-content">
            <p className="stat-label">Overdue</p>
            <p className="stat-value">₹{totalOverdue.toLocaleString()}</p>
            <p className="stat-count">{payments.filter(p => p.status === 'overdue').length} payments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-blue-100">📊</div>
          <div className="stat-content">
            <p className="stat-label">Total Scheduled</p>
            <p className="stat-value">₹{payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</p>
            <p className="stat-count">{payments.length} payments</p>
          </div>
        </div>
      </div>

      <div className="filter-tabs">
        {['all', 'pending', 'processing', 'completed', 'overdue', 'failed'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`filter-tab ${filter === tab ? 'active' : ''}`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="payments-table">
        <table>
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Order ID</th>
              <th>Buyer</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Method</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="loading-cell">Loading payments...</td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan={8} className="empty-cell">No payments found</td></tr>
            ) : (
              payments.map(payment => (
                <tr key={payment.id}>
                  <td className="payment-id">{payment.id}</td>
                  <td>{payment.orderId}</td>
                  <td>{payment.buyer}</td>
                  <td className="amount">₹{payment.amount.toLocaleString()}</td>
                  <td>{new Date(payment.dueDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td>{payment.method}</td>
                  <td>
                    <div className="action-buttons">
                      {payment.status === 'pending' && (
                        <button className="btn-remind">Remind</button>
                      )}
                      {payment.status === 'overdue' && (
                        <button className="btn-escalate">Escalate</button>
                      )}
                      <button className="btn-view">View</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .payment-schedule {
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

        .btn-export {
          background: #667eea;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
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
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
        }

        .stat-count {
          font-size: 12px;
          color: #9ca3af;
          margin-top: 4px;
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

        .payments-table {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          text-align: left;
          padding: 12px;
          border-bottom: 2px solid #e5e7eb;
          color: #6b7280;
          font-weight: 600;
          font-size: 14px;
        }

        td {
          padding: 16px 12px;
          border-bottom: 1px solid #f3f4f6;
        }

        .payment-id {
          font-weight: 600;
          color: #667eea;
        }

        .amount {
          font-weight: 600;
          color: #059669;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .action-buttons button {
          padding: 6px 12px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
        }

        .btn-remind {
          background: #fef3c7;
          color: #92400e;
        }

        .btn-escalate {
          background: #fee2e2;
          color: #991b1b;
        }

        .btn-view {
          background: #e0e7ff;
          color: #3730a3;
        }

        .loading-cell,
        .empty-cell {
          text-align: center;
          padding: 40px;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}
