'use client';

import React, { useState, useEffect } from 'react';
import { disputeService } from '@/services/disputeService';

interface Dispute {
  id: string;
  orderId: string;
  type: 'quality' | 'payment' | 'delivery' | 'contract';
  status: 'open' | 'in_review' | 'resolved' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'critical';
  amount: number;
  description: string;
  createdAt: string;
  resolvedAt?: string;
  evidence: string[];
  messages: DisputeMessage[];
  resolution?: string;
}

interface DisputeMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  attachments?: string[];
}

export function DisputeCenter() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadDisputes();
  }, [filter]);

  const loadDisputes = async () => {
    setLoading(true);
    try {
      const data = await disputeService.getDisputes(filter);
      setDisputes(data);
    } catch (error) {
      console.error('Failed to load disputes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDispute = async () => {
    // Open modal for creating new dispute
    const newDispute = await disputeService.createDispute({
      orderId: 'ORD-001',
      type: 'quality',
      description: 'Product quality does not match description',
      amount: 5000,
      evidence: []
    });
    setDisputes([newDispute, ...disputes]);
  };

  const handleSendMessage = async () => {
    if (!selectedDispute || !newMessage.trim()) return;
    
    const message = await disputeService.sendMessage(selectedDispute.id, newMessage);
    setSelectedDispute({
      ...selectedDispute,
      messages: [...selectedDispute.messages, message]
    });
    setNewMessage('');
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-yellow-500',
      in_review: 'bg-blue-500',
      resolved: 'bg-green-500',
      escalated: 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-orange-600',
      critical: 'text-red-600'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600';
  };

  return (
    <div className="dispute-center">
      <div className="header-section">
        <h2 className="text-2xl font-bold text-gray-800">Dispute Center</h2>
        <button onClick={handleCreateDispute} className="btn-primary">
          + File New Dispute
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-yellow-100">⚠️</div>
          <div className="stat-content">
            <p className="stat-label">Open Disputes</p>
            <p className="stat-value">{disputes.filter(d => d.status === 'open').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-blue-100">🔍</div>
          <div className="stat-content">
            <p className="stat-label">Under Review</p>
            <p className="stat-value">{disputes.filter(d => d.status === 'in_review').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-green-100">✅</div>
          <div className="stat-content">
            <p className="stat-label">Resolved</p>
            <p className="stat-value">{disputes.filter(d => d.status === 'resolved').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-red-100">🚨</div>
          <div className="stat-content">
            <p className="stat-label">Escalated</p>
            <p className="stat-value">{disputes.filter(d => d.status === 'escalated').length}</p>
          </div>
        </div>
      </div>

      <div className="filter-tabs">
        {['all', 'open', 'in_review', 'resolved', 'escalated'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`filter-tab ${filter === tab ? 'active' : ''}`}
          >
            {tab.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      <div className="disputes-layout">
        <div className="disputes-list">
          {loading ? (
            <div className="loading-state">Loading disputes...</div>
          ) : disputes.length === 0 ? (
            <div className="empty-state">
              <p>No disputes found</p>
            </div>
          ) : (
            disputes.map(dispute => (
              <div
                key={dispute.id}
                onClick={() => setSelectedDispute(dispute)}
                className={`dispute-item ${selectedDispute?.id === dispute.id ? 'selected' : ''}`}
              >
                <div className="dispute-header">
                  <span className={`status-badge ${getStatusColor(dispute.status)}`}>
                    {dispute.status.replace('_', ' ')}
                  </span>
                  <span className={`priority-badge ${getPriorityColor(dispute.priority)}`}>
                    {dispute.priority.toUpperCase()}
                  </span>
                </div>
                <h4 className="dispute-title">Dispute #{dispute.id}</h4>
                <p className="dispute-type">{dispute.type.toUpperCase()} - Order {dispute.orderId}</p>
                <p className="dispute-amount">₹{dispute.amount.toLocaleString()}</p>
                <p className="dispute-date">{new Date(dispute.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>

        <div className="dispute-details">
          {selectedDispute ? (
            <>
              <div className="details-header">
                <h3>Dispute #{selectedDispute.id}</h3>
                <span className={`status-badge ${getStatusColor(selectedDispute.status)}`}>
                  {selectedDispute.status.replace('_', ' ')}
                </span>
              </div>

              <div className="details-info">
                <div className="info-row">
                  <span className="label">Order ID:</span>
                  <span className="value">{selectedDispute.orderId}</span>
                </div>
                <div className="info-row">
                  <span className="label">Type:</span>
                  <span className="value">{selectedDispute.type}</span>
                </div>
                <div className="info-row">
                  <span className="label">Amount:</span>
                  <span className="value">₹{selectedDispute.amount.toLocaleString()}</span>
                </div>
                <div className="info-row">
                  <span className="label">Priority:</span>
                  <span className={`value ${getPriorityColor(selectedDispute.priority)}`}>
                    {selectedDispute.priority.toUpperCase()}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Created:</span>
                  <span className="value">{new Date(selectedDispute.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="description-section">
                <h4>Description</h4>
                <p>{selectedDispute.description}</p>
              </div>

              {selectedDispute.evidence.length > 0 && (
                <div className="evidence-section">
                  <h4>Evidence</h4>
                  <div className="evidence-list">
                    {selectedDispute.evidence.map((file, idx) => (
                      <div key={idx} className="evidence-item">
                        📎 {file}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="messages-section">
                <h4>Communication</h4>
                <div className="messages-list">
                  {selectedDispute.messages.map(msg => (
                    <div key={msg.id} className="message-item">
                      <div className="message-header">
                        <strong>{msg.sender}</strong>
                        <span className="message-time">
                          {new Date(msg.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="message-text">{msg.message}</p>
                    </div>
                  ))}
                </div>

                {selectedDispute.status !== 'resolved' && (
                  <div className="message-input">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      rows={3}
                    />
                    <button onClick={handleSendMessage} className="btn-send">
                      Send Message
                    </button>
                  </div>
                )}
              </div>

              {selectedDispute.resolution && (
                <div className="resolution-section">
                  <h4>Resolution</h4>
                  <p>{selectedDispute.resolution}</p>
                </div>
              )}
            </>
          ) : (
            <div className="no-selection">
              <p>Select a dispute to view details</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .dispute-center {
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

        .disputes-layout {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 24px;
          height: calc(100vh - 400px);
        }

        .disputes-list {
          background: white;
          border-radius: 12px;
          padding: 16px;
          overflow-y: auto;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .dispute-item {
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 12px;
          cursor: pointer;
          border: 2px solid #e5e7eb;
          transition: all 0.2s;
        }

        .dispute-item:hover {
          border-color: #667eea;
          transform: translateX(4px);
        }

        .dispute-item.selected {
          background: #f3f4f6;
          border-color: #667eea;
        }

        .dispute-header {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
        }

        .priority-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          background: #f3f4f6;
        }

        .dispute-title {
          font-weight: 600;
          margin-bottom: 4px;
          color: #1f2937;
        }

        .dispute-type {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .dispute-amount {
          font-weight: 600;
          color: #059669;
          margin-bottom: 4px;
        }

        .dispute-date {
          font-size: 12px;
          color: #9ca3af;
        }

        .dispute-details {
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

        .description-section,
        .evidence-section,
        .messages-section,
        .resolution-section {
          margin-bottom: 24px;
        }

        .description-section h4,
        .evidence-section h4,
        .messages-section h4,
        .resolution-section h4 {
          font-weight: 600;
          margin-bottom: 12px;
          color: #1f2937;
        }

        .evidence-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .evidence-item {
          padding: 12px;
          background: #f3f4f6;
          border-radius: 8px;
          font-size: 14px;
        }

        .messages-list {
          max-height: 300px;
          overflow-y: auto;
          margin-bottom: 16px;
        }

        .message-item {
          padding: 12px;
          background: #f9fafb;
          border-radius: 8px;
          margin-bottom: 12px;
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .message-time {
          font-size: 12px;
          color: #9ca3af;
        }

        .message-text {
          color: #4b5563;
          line-height: 1.5;
        }

        .message-input {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .message-input textarea {
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          resize: vertical;
          font-family: inherit;
        }

        .btn-send {
          align-self: flex-end;
          background: #667eea;
          color: white;
          padding: 10px 24px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
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
