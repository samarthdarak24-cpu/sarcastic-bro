'use client';

import React, { useState, useEffect } from 'react';
import { refundService } from '@/services/refundService';

export function RefundManager() {
  const [refunds, setRefunds] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);

  useEffect(() => {
    loadRefunds();
  }, [filter]);

  const loadRefunds = async () => {
    setLoading(true);
    try {
      const data = await refundService.getRefunds(filter);
      setRefunds(data);
    } catch (error) {
      console.error('Failed to load refunds:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-500',
      approved: 'bg-green-500',
      rejected: 'bg-red-500',
      processing: 'bg-blue-500',
      completed: 'bg-purple-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="refund-manager">
      <div className="header-section">
        <h2 className="text-2xl font-bold text-gray-800">Refund Manager</h2>
        <button onClick={() => setShowRequestForm(true)} className="btn-primary">
          + Request Refund
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-yellow-100">⏳</div>
          <div className="stat-content">
            <p className="stat-label">Pending Refunds</p>
            <p className="stat-value">{refunds.filter(r => r.status === 'pending').length}</p>
            <p className="stat-amount">₹{refunds.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-green-100">✅</div>
          <div className="stat-content">
            <p className="stat-label">Approved</p>
            <p className="stat-value">{refunds.filter(r => r.status === 'approved' || r.status === 'completed').length}</p>
            <p className="stat-amount">₹{refunds.filter(r => r.status === 'approved' || r.status === 'completed').reduce((sum, r) => sum + r.amount, 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-red-100">❌</div>
          <div className="stat-content">
            <p className="stat-label">Rejected</p>
            <p className="stat-value">{refunds.filter(r => r.status === 'rejected').length}</p>
            <p className="stat-amount">₹{refunds.filter(r => r.status === 'rejected').reduce((sum, r) => sum + r.amount, 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-blue-100">💰</div>
          <div className="stat-content">
            <p className="stat-label">Total Refunded</p>
            <p className="stat-value">{refunds.filter(r => r.status === 'completed').length}</p>
            <p className="stat-amount">₹{refunds.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.amount, 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="filter-tabs">
        {['all', 'pending', 'approved', 'processing', 'completed', 'rejected'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`filter-tab ${filter === tab ? 'active' : ''}`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="refunds-grid">
        {loading ? (
          <div className="loading-state">Loading refunds...</div>
        ) : refunds.length === 0 ? (
          <div className="empty-state">
            <p>No refunds found</p>
          </div>
        ) : (
          refunds.map(refund => (
            <div key={refund.id} className="refund-card">
              <div className="refund-header">
                <span className={`status-badge ${getStatusColor(refund.status)}`}>
                  {refund.status}
                </span>
                <span className="refund-id">{refund.id}</span>
              </div>

              <div className="refund-amount">
                <span className="amount-label">Refund Amount</span>
                <span className="amount-value">₹{refund.amount.toLocaleString()}</span>
              </div>

              <div className="refund-info">
                <div className="info-row">
                  <span className="info-label">Order ID:</span>
                  <span className="info-value">{refund.orderId}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Reason:</span>
                  <span className="info-value">{refund.reason}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Requested:</span>
                  <span className="info-value">{new Date(refund.requestedAt).toLocaleDateString()}</span>
                </div>
                {refund.processedAt && (
                  <div className="info-row">
                    <span className="info-label">Processed:</span>
                    <span className="info-value">{new Date(refund.processedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="refund-description">
                <p>{refund.description}</p>
              </div>

              {refund.evidence && refund.evidence.length > 0 && (
                <div className="evidence-section">
                  <p className="evidence-label">Evidence Attached:</p>
                  <div className="evidence-list">
                    {refund.evidence.map((file: string, idx: number) => (
                      <span key={idx} className="evidence-item">📎 {file}</span>
                    ))}
                  </div>
                </div>
              )}

              {refund.adminNotes && (
                <div className="admin-notes">
                  <p className="notes-label">Admin Notes:</p>
                  <p className="notes-text">{refund.adminNotes}</p>
                </div>
              )}

              <div className="refund-actions">
                {refund.status === 'pending' && (
                  <button className="btn-cancel">Cancel Request</button>
                )}
                <button className="btn-view">View Details</button>
              </div>
            </div>
          ))
        )}
      </div>

      {showRequestForm && (
        <div className="modal-overlay" onClick={() => setShowRequestForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Request Refund</h3>
            <form className="refund-form">
              <div className="form-group">
                <label>Order ID</label>
                <input type="text" placeholder="Enter order ID" />
              </div>
              <div className="form-group">
                <label>Refund Amount</label>
                <input type="number" placeholder="Enter amount" />
              </div>
              <div className="form-group">
                <label>Reason</label>
                <select>
                  <option>Order Cancelled</option>
                  <option>Quality Issue</option>
                  <option>Payment Error</option>
                  <option>Delivery Failed</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows={4} placeholder="Provide detailed explanation"></textarea>
              </div>
              <div className="form-group">
                <label>Upload Evidence</label>
                <input type="file" multiple />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowRequestForm(false)} className="btn-cancel-form">
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .refund-manager {
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

        .stat-amount {
          font-size: 14px;
          color: #059669;
          font-weight: 600;
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

        .refunds-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
        }

        .refund-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .refund-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
        }

        .refund-id {
          font-size: 13px;
          color: #6b7280;
          font-weight: 600;
        }

        .refund-amount {
          background: #f3f4f6;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 16px;
          text-align: center;
        }

        .amount-label {
          display: block;
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .amount-value {
          display: block;
          font-size: 32px;
          font-weight: bold;
          color: #059669;
        }

        .refund-info {
          margin-bottom: 16px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .info-label {
          font-size: 13px;
          color: #6b7280;
        }

        .info-value {
          font-size: 13px;
          font-weight: 600;
          color: #1f2937;
        }

        .refund-description {
          background: #f9fafb;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .refund-description p {
          font-size: 14px;
          color: #4b5563;
          line-height: 1.5;
        }

        .evidence-section {
          margin-bottom: 16px;
        }

        .evidence-label {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .evidence-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .evidence-item {
          font-size: 12px;
          color: #4b5563;
        }

        .admin-notes {
          background: #fef3c7;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .notes-label {
          font-size: 13px;
          font-weight: 600;
          color: #92400e;
          margin-bottom: 4px;
        }

        .notes-text {
          font-size: 13px;
          color: #78350f;
        }

        .refund-actions {
          display: flex;
          gap: 12px;
        }

        .refund-actions button {
          flex: 1;
          padding: 10px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
        }

        .btn-cancel {
          background: #fee2e2;
          color: #991b1b;
        }

        .btn-view {
          background: #e0e7ff;
          color: #3730a3;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          padding: 32px;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-content h3 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 24px;
          color: #1f2937;
        }

        .refund-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-weight: 600;
          color: #4b5563;
          font-size: 14px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .form-actions button {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
        }

        .btn-cancel-form {
          background: #f3f4f6;
          color: #1f2937;
        }

        .btn-submit {
          background: #667eea;
          color: white;
        }

        .loading-state,
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}
