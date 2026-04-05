'use client';

import React, { useState, useEffect } from 'react';
import { transactionService } from '@/services/transactionService';

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filter, setFilter] = useState({ type: 'all', period: '30days' });
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<any>(null);

  useEffect(() => {
    loadTransactions();
  }, [filter]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const data = await transactionService.getTransactions(filter);
      setTransactions(data);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      credit: 'text-green-600',
      debit: 'text-red-600',
      refund: 'text-blue-600',
      fee: 'text-orange-600'
    };
    return colors[type as keyof typeof colors] || 'text-gray-600';
  };

  const totalCredit = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
  const totalDebit = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalCredit - totalDebit;

  return (
    <div className="transaction-history">
      <div className="header-section">
        <h2 className="text-2xl font-bold text-gray-800">Transaction History</h2>
        <div className="header-actions">
          <button className="btn-export">📥 Export CSV</button>
          <button className="btn-print">🖨️ Print</button>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card green">
          <div className="summary-icon">💰</div>
          <div className="summary-content">
            <p className="summary-label">Total Credits</p>
            <p className="summary-value">₹{totalCredit.toLocaleString()}</p>
          </div>
        </div>
        <div className="summary-card red">
          <div className="summary-icon">💸</div>
          <div className="summary-content">
            <p className="summary-label">Total Debits</p>
            <p className="summary-value">₹{totalDebit.toLocaleString()}</p>
          </div>
        </div>
        <div className="summary-card blue">
          <div className="summary-icon">📊</div>
          <div className="summary-content">
            <p className="summary-label">Net Balance</p>
            <p className="summary-value">₹{netBalance.toLocaleString()}</p>
          </div>
        </div>
        <div className="summary-card purple">
          <div className="summary-icon">📈</div>
          <div className="summary-content">
            <p className="summary-label">Total Transactions</p>
            <p className="summary-value">{transactions.length}</p>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>Type:</label>
          <select value={filter.type} onChange={(e) => setFilter({...filter, type: e.target.value})}>
            <option value="all">All Types</option>
            <option value="credit">Credits</option>
            <option value="debit">Debits</option>
            <option value="refund">Refunds</option>
            <option value="fee">Fees</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Period:</label>
          <select value={filter.period} onChange={(e) => setFilter({...filter, period: e.target.value})}>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      <div className="transactions-container">
        <div className="transactions-list">
          {loading ? (
            <div className="loading-state">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="empty-state">No transactions found</div>
          ) : (
            transactions.map(tx => (
              <div
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className={`transaction-item ${selectedTx?.id === tx.id ? 'selected' : ''}`}
              >
                <div className="tx-icon">{tx.icon}</div>
                <div className="tx-details">
                  <p className="tx-title">{tx.description}</p>
                  <p className="tx-meta">{tx.category} • {new Date(tx.timestamp).toLocaleDateString()}</p>
                </div>
                <div className="tx-amount">
                  <p className={`amount ${getTypeColor(tx.type)}`}>
                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </p>
                  <p className="tx-status">{tx.status}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedTx && (
          <div className="transaction-details">
            <h3>Transaction Details</h3>
            <div className="detail-card">
              <div className="detail-row">
                <span className="detail-label">Transaction ID:</span>
                <span className="detail-value">{selectedTx.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Type:</span>
                <span className={`detail-value ${getTypeColor(selectedTx.type)}`}>
                  {selectedTx.type.toUpperCase()}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Amount:</span>
                <span className={`detail-value ${getTypeColor(selectedTx.type)}`}>
                  ₹{selectedTx.amount.toLocaleString()}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className="detail-value">{selectedTx.status}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date:</span>
                <span className="detail-value">{new Date(selectedTx.timestamp).toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Category:</span>
                <span className="detail-value">{selectedTx.category}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Description:</span>
                <span className="detail-value">{selectedTx.description}</span>
              </div>
              {selectedTx.orderId && (
                <div className="detail-row">
                  <span className="detail-label">Order ID:</span>
                  <span className="detail-value">{selectedTx.orderId}</span>
                </div>
              )}
              {selectedTx.paymentMethod && (
                <div className="detail-row">
                  <span className="detail-label">Payment Method:</span>
                  <span className="detail-value">{selectedTx.paymentMethod}</span>
                </div>
              )}
              {selectedTx.referenceNumber && (
                <div className="detail-row">
                  <span className="detail-label">Reference Number:</span>
                  <span className="detail-value">{selectedTx.referenceNumber}</span>
                </div>
              )}
            </div>
            <div className="detail-actions">
              <button className="btn-download">Download Receipt</button>
              <button className="btn-share">Share</button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .transaction-history {
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

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .btn-export,
        .btn-print {
          background: #667eea;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .summary-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .summary-card.green { border-left: 4px solid #10b981; }
        .summary-card.red { border-left: 4px solid #ef4444; }
        .summary-card.blue { border-left: 4px solid #3b82f6; }
        .summary-card.purple { border-left: 4px solid #8b5cf6; }

        .summary-icon {
          font-size: 36px;
        }

        .summary-label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .summary-value {
          font-size: 28px;
          font-weight: bold;
          color: #1f2937;
        }

        .filters-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 24px;
          display: flex;
          gap: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .filter-group label {
          font-weight: 600;
          color: #4b5563;
        }

        .filter-group select {
          padding: 8px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
        }

        .transactions-container {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 24px;
        }

        .transactions-list {
          background: white;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          max-height: calc(100vh - 500px);
          overflow-y: auto;
        }

        .transaction-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 12px;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s;
        }

        .transaction-item:hover {
          background: #f9fafb;
          border-color: #667eea;
        }

        .transaction-item.selected {
          background: #f3f4f6;
          border-color: #667eea;
        }

        .tx-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .tx-details {
          flex: 1;
        }

        .tx-title {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .tx-meta {
          font-size: 13px;
          color: #6b7280;
        }

        .tx-amount {
          text-align: right;
        }

        .amount {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 4px;
        }

        .tx-status {
          font-size: 12px;
          color: #9ca3af;
        }

        .transaction-details {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          max-height: calc(100vh - 500px);
          overflow-y: auto;
        }

        .transaction-details h3 {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #1f2937;
        }

        .detail-card {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-label {
          font-weight: 500;
          color: #6b7280;
        }

        .detail-value {
          font-weight: 600;
          color: #1f2937;
          text-align: right;
        }

        .detail-actions {
          display: flex;
          gap: 12px;
        }

        .btn-download,
        .btn-share {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
        }

        .btn-download {
          background: #667eea;
          color: white;
        }

        .btn-share {
          background: #f3f4f6;
          color: #1f2937;
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
