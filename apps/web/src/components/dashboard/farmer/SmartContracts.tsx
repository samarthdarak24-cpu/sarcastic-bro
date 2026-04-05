'use client';

import React, { useState, useEffect } from 'react';
import { smartContractService } from '@/services/smartContractService';

interface SmartContract {
  id: string;
  title: string;
  type: 'sale' | 'purchase' | 'partnership' | 'lease';
  status: 'draft' | 'pending' | 'active' | 'completed' | 'terminated';
  parties: ContractParty[];
  value: number;
  startDate: string;
  endDate: string;
  terms: ContractTerm[];
  milestones: Milestone[];
  autoExecute: boolean;
  blockchainHash?: string;
  createdAt: string;
}

interface ContractParty {
  name: string;
  role: string;
  address: string;
  signature?: string;
  signedAt?: string;
}

interface ContractTerm {
  id: string;
  title: string;
  description: string;
  condition: string;
  action: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  payment?: number;
  autoRelease: boolean;
}

export function SmartContracts() {
  const [contracts, setContracts] = useState<SmartContract[]>([]);
  const [selectedContract, setSelectedContract] = useState<SmartContract | null>(null);
  const [view, setView] = useState<'list' | 'details' | 'create'>('list');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContracts();
  }, [filter]);

  const loadContracts = async () => {
    setLoading(true);
    try {
      const data = await smartContractService.getContracts(filter);
      setContracts(data);
    } catch (error) {
      console.error('Failed to load contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-500',
      pending: 'bg-yellow-500',
      active: 'bg-green-500',
      completed: 'bg-blue-500',
      terminated: 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      sale: '💰',
      purchase: '🛒',
      partnership: '🤝',
      lease: '📋'
    };
    return icons[type as keyof typeof icons] || '📄';
  };

  return (
    <div className="smart-contracts">
      <div className="header-section">
        <h2 className="text-2xl font-bold text-gray-800">Smart Contracts</h2>
        <button onClick={() => setView('create')} className="btn-primary">
          + Create Contract
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-green-100">✅</div>
          <div className="stat-content">
            <p className="stat-label">Active Contracts</p>
            <p className="stat-value">{contracts.filter(c => c.status === 'active').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-yellow-100">⏳</div>
          <div className="stat-content">
            <p className="stat-label">Pending Signature</p>
            <p className="stat-value">{contracts.filter(c => c.status === 'pending').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-blue-100">💎</div>
          <div className="stat-content">
            <p className="stat-label">Total Value</p>
            <p className="stat-value">₹{contracts.reduce((sum, c) => sum + c.value, 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-purple-100">🔗</div>
          <div className="stat-content">
            <p className="stat-label">On Blockchain</p>
            <p className="stat-value">{contracts.filter(c => c.blockchainHash).length}</p>
          </div>
        </div>
      </div>

      <div className="filter-tabs">
        {['all', 'draft', 'pending', 'active', 'completed'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`filter-tab ${filter === tab ? 'active' : ''}`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {view === 'list' && (
        <div className="contracts-grid">
          {loading ? (
            <div className="loading-state">Loading contracts...</div>
          ) : contracts.length === 0 ? (
            <div className="empty-state">
              <p>No contracts found</p>
              <button onClick={() => setView('create')} className="btn-secondary">
                Create Your First Contract
              </button>
            </div>
          ) : (
            contracts.map(contract => (
              <div
                key={contract.id}
                onClick={() => {
                  setSelectedContract(contract);
                  setView('details');
                }}
                className="contract-card"
              >
                <div className="contract-header">
                  <span className="contract-icon">{getTypeIcon(contract.type)}</span>
                  <span className={`status-badge ${getStatusColor(contract.status)}`}>
                    {contract.status}
                  </span>
                </div>
                
                <h3 className="contract-title">{contract.title}</h3>
                <p className="contract-type">{contract.type.toUpperCase()}</p>
                
                <div className="contract-value">
                  <span className="value-label">Contract Value</span>
                  <span className="value-amount">₹{contract.value.toLocaleString()}</span>
                </div>

                <div className="contract-parties">
                  <p className="parties-label">Parties:</p>
                  {contract.parties.map((party, idx) => (
                    <div key={idx} className="party-item">
                      <span className="party-role">{party.role}:</span>
                      <span className="party-name">{party.name}</span>
                    </div>
                  ))}
                </div>

                <div className="contract-dates">
                  <div className="date-item">
                    <span className="date-label">Start:</span>
                    <span className="date-value">{new Date(contract.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="date-item">
                    <span className="date-label">End:</span>
                    <span className="date-value">{new Date(contract.endDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {contract.blockchainHash && (
                  <div className="blockchain-badge">
                    🔗 Blockchain Verified
                  </div>
                )}

                {contract.autoExecute && (
                  <div className="auto-execute-badge">
                    ⚡ Auto-Execute Enabled
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {view === 'details' && selectedContract && (
        <div className="contract-details">
          <button onClick={() => setView('list')} className="btn-back">
            ← Back to Contracts
          </button>

          <div className="details-header">
            <div>
              <h2>{selectedContract.title}</h2>
              <p className="contract-id">Contract ID: {selectedContract.id}</p>
            </div>
            <span className={`status-badge-large ${getStatusColor(selectedContract.status)}`}>
              {selectedContract.status.toUpperCase()}
            </span>
          </div>

          <div className="details-grid">
            <div className="details-section">
              <h3>Contract Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Type:</span>
                  <span className="info-value">{selectedContract.type}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Value:</span>
                  <span className="info-value">₹{selectedContract.value.toLocaleString()}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Start Date:</span>
                  <span className="info-value">{new Date(selectedContract.startDate).toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">End Date:</span>
                  <span className="info-value">{new Date(selectedContract.endDate).toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Auto-Execute:</span>
                  <span className="info-value">{selectedContract.autoExecute ? 'Yes' : 'No'}</span>
                </div>
                {selectedContract.blockchainHash && (
                  <div className="info-item full-width">
                    <span className="info-label">Blockchain Hash:</span>
                    <span className="info-value hash">{selectedContract.blockchainHash}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="details-section">
              <h3>Parties</h3>
              <div className="parties-list">
                {selectedContract.parties.map((party, idx) => (
                  <div key={idx} className="party-card">
                    <div className="party-header">
                      <strong>{party.role}</strong>
                      {party.signature && <span className="signed-badge">✓ Signed</span>}
                    </div>
                    <p className="party-name">{party.name}</p>
                    <p className="party-address">{party.address}</p>
                    {party.signedAt && (
                      <p className="signed-date">Signed: {new Date(party.signedAt).toLocaleString()}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="details-section">
              <h3>Contract Terms</h3>
              <div className="terms-list">
                {selectedContract.terms.map(term => (
                  <div key={term.id} className="term-card">
                    <h4>{term.title}</h4>
                    <p className="term-description">{term.description}</p>
                    <div className="term-logic">
                      <div className="logic-item">
                        <span className="logic-label">Condition:</span>
                        <code className="logic-code">{term.condition}</code>
                      </div>
                      <div className="logic-item">
                        <span className="logic-label">Action:</span>
                        <code className="logic-code">{term.action}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="details-section">
              <h3>Milestones</h3>
              <div className="milestones-list">
                {selectedContract.milestones.map(milestone => (
                  <div key={milestone.id} className={`milestone-card ${milestone.status}`}>
                    <div className="milestone-header">
                      <h4>{milestone.title}</h4>
                      <span className={`milestone-status ${milestone.status}`}>
                        {milestone.status === 'completed' && '✓'}
                        {milestone.status === 'pending' && '⏳'}
                        {milestone.status === 'overdue' && '⚠️'}
                        {milestone.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="milestone-description">{milestone.description}</p>
                    <div className="milestone-footer">
                      <span className="milestone-date">Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                      {milestone.payment && (
                        <span className="milestone-payment">₹{milestone.payment.toLocaleString()}</span>
                      )}
                      {milestone.autoRelease && (
                        <span className="auto-release-badge">⚡ Auto-Release</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="action-buttons">
            {selectedContract.status === 'pending' && (
              <button className="btn-sign">Sign Contract</button>
            )}
            {selectedContract.status === 'active' && (
              <>
                <button className="btn-view">View on Blockchain</button>
                <button className="btn-terminate">Terminate Contract</button>
              </>
            )}
            <button className="btn-download">Download PDF</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .smart-contracts {
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

        .contracts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
        }

        .contract-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .contract-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.15);
        }

        .contract-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .contract-icon {
          font-size: 32px;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
        }

        .contract-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 4px;
          color: #1f2937;
        }

        .contract-type {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 16px;
        }

        .contract-value {
          background: #f3f4f6;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .value-label {
          display: block;
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .value-amount {
          display: block;
          font-size: 24px;
          font-weight: bold;
          color: #059669;
        }

        .contract-parties {
          margin-bottom: 16px;
        }

        .parties-label {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .party-item {
          display: flex;
          gap: 8px;
          font-size: 13px;
          margin-bottom: 4px;
        }

        .party-role {
          color: #6b7280;
        }

        .party-name {
          color: #1f2937;
          font-weight: 500;
        }

        .contract-dates {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }

        .date-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .date-label {
          font-size: 12px;
          color: #6b7280;
        }

        .date-value {
          font-size: 13px;
          font-weight: 500;
          color: #1f2937;
        }

        .blockchain-badge,
        .auto-execute-badge {
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          text-align: center;
          margin-top: 8px;
        }

        .blockchain-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .auto-execute-badge {
          background: #fef3c7;
          color: #92400e;
        }

        .contract-details {
          background: white;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .btn-back {
          background: #f3f4f6;
          color: #1f2937;
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 500;
          margin-bottom: 24px;
        }

        .details-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 2px solid #e5e7eb;
        }

        .contract-id {
          color: #6b7280;
          font-size: 14px;
          margin-top: 4px;
        }

        .status-badge-large {
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          color: white;
        }

        .details-grid {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .details-section h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #1f2937;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-item.full-width {
          grid-column: 1 / -1;
        }

        .info-label {
          font-size: 13px;
          color: #6b7280;
        }

        .info-value {
          font-size: 15px;
          font-weight: 600;
          color: #1f2937;
        }

        .info-value.hash {
          font-family: monospace;
          font-size: 12px;
          word-break: break-all;
        }

        .parties-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .party-card {
          background: #f9fafb;
          padding: 16px;
          border-radius: 8px;
          border: 2px solid #e5e7eb;
        }

        .party-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .signed-badge {
          background: #10b981;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
        }

        .party-address {
          font-size: 13px;
          color: #6b7280;
          margin-top: 4px;
        }

        .signed-date {
          font-size: 12px;
          color: #9ca3af;
          margin-top: 8px;
        }

        .terms-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .term-card {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }

        .term-card h4 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #1f2937;
        }

        .term-description {
          color: #4b5563;
          margin-bottom: 12px;
          line-height: 1.5;
        }

        .term-logic {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .logic-item {
          display: flex;
          gap: 8px;
          align-items: flex-start;
        }

        .logic-label {
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          min-width: 80px;
        }

        .logic-code {
          background: #1f2937;
          color: #10b981;
          padding: 8px 12px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 12px;
          flex: 1;
        }

        .milestones-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .milestone-card {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #6b7280;
        }

        .milestone-card.completed {
          border-left-color: #10b981;
        }

        .milestone-card.pending {
          border-left-color: #f59e0b;
        }

        .milestone-card.overdue {
          border-left-color: #ef4444;
        }

        .milestone-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .milestone-header h4 {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .milestone-status {
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }

        .milestone-status.completed {
          background: #d1fae5;
          color: #065f46;
        }

        .milestone-status.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .milestone-status.overdue {
          background: #fee2e2;
          color: #991b1b;
        }

        .milestone-description {
          color: #4b5563;
          margin-bottom: 12px;
          line-height: 1.5;
        }

        .milestone-footer {
          display: flex;
          gap: 16px;
          align-items: center;
          flex-wrap: wrap;
        }

        .milestone-date {
          font-size: 13px;
          color: #6b7280;
        }

        .milestone-payment {
          font-size: 15px;
          font-weight: 600;
          color: #059669;
        }

        .auto-release-badge {
          background: #fef3c7;
          color: #92400e;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 2px solid #e5e7eb;
          flex-wrap: wrap;
        }

        .action-buttons button {
          padding: 12px 24px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .btn-sign {
          background: #10b981;
          color: white;
        }

        .btn-view {
          background: #667eea;
          color: white;
        }

        .btn-terminate {
          background: #ef4444;
          color: white;
        }

        .btn-download {
          background: #f3f4f6;
          color: #1f2937;
        }

        .loading-state,
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #9ca3af;
        }

        .btn-secondary {
          background: #667eea;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          margin-top: 16px;
        }
      `}</style>
    </div>
  );
}
