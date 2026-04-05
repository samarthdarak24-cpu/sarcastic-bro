'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface Tender {
  id: string;
  title: string;
  buyer: string;
  product: string;
  quantity: number;
  budget: number;
  deadline: string;
  status: 'open' | 'closing_soon' | 'closed';
  bidsCount: number;
  matchScore: number;
}

interface Bid {
  id: string;
  tenderTitle: string;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected';
  submittedAt: string;
  winProbability: number;
}

export default function TenderBidsHub() {
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [myBids, setMyBids] = useState<Bid[]>([]);
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [activeView, setActiveView] = useState<'tenders' | 'mybids'>('tenders');

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    setLoading(true);
    setTimeout(() => {
      setTenders([
        { id: 'TND-001', title: 'Bulk Wheat Purchase', buyer: 'ABC Traders', product: 'Wheat', quantity: 5000, budget: 250000, deadline: '2024-04-10', status: 'open', bidsCount: 12, matchScore: 95 },
        { id: 'TND-002', title: 'Rice Export Order', buyer: 'XYZ Corp', product: 'Rice', quantity: 3000, budget: 180000, deadline: '2024-04-08', status: 'closing_soon', bidsCount: 8, matchScore: 88 },
        { id: 'TND-003', title: 'Corn Supply Contract', buyer: 'PQR Ltd', product: 'Corn', quantity: 4000, budget: 120000, deadline: '2024-04-05', status: 'closed', bidsCount: 15, matchScore: 72 },
      ]);
      setMyBids([
        { id: 'BID-001', tenderTitle: 'Bulk Wheat Purchase', amount: 245000, status: 'pending', submittedAt: '2024-04-01', winProbability: 78 },
        { id: 'BID-002', tenderTitle: 'Rice Export Order', amount: 175000, status: 'accepted', submittedAt: '2024-03-30', winProbability: 92 },
        { id: 'BID-003', tenderTitle: 'Corn Supply Contract', amount: 118000, status: 'rejected', submittedAt: '2024-03-28', winProbability: 45 },
      ]);
      setLoading(false);
    }, 500);
  };

  const statusCounts = {
    open: tenders.filter(t => t.status === 'open').length,
    closing_soon: tenders.filter(t => t.status === 'closing_soon').length,
    mybids_pending: myBids.filter(b => b.status === 'pending').length,
    mybids_accepted: myBids.filter(b => b.status === 'accepted').length,
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-green-500',
      closing_soon: 'bg-orange-500',
      closed: 'bg-gray-500',
      pending: 'bg-yellow-500',
      accepted: 'bg-green-500',
      rejected: 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="tender-bids-hub">
      {/* Ultra-Compact Navbar Header */}
      <div className="navbar-header">
        <h2 className="title">Tenders</h2>
        
        <div className="status-badges">
          <div className="badge open">
            <FileText size={14} />
            <span>{statusCounts.open}</span>
          </div>
          
          <div className="badge closing">
            <Clock size={14} />
            <span>{statusCounts.closing_soon}</span>
          </div>
          
          <div className="badge pending">
            <Clock size={14} />
            <span>{statusCounts.mybids_pending}</span>
          </div>
          
          <div className="badge accepted">
            <CheckCircle size={14} />
            <span>{statusCounts.mybids_accepted}</span>
          </div>
        </div>

        <button 
          className="refresh-icon" 
          onClick={loadData}
          disabled={loading}
          aria-label="Refresh"
        >
          <RefreshCw size={16} className={loading ? 'spinning' : ''} />
        </button>
      </div>

      <div className="filter-tabs">
        {['tenders', 'mybids'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveView(tab as any)}
            className={`filter-tab ${activeView === tab ? 'active' : ''}`}
          >
            {tab === 'tenders' ? 'AVAILABLE TENDERS' : 'MY BIDS'}
          </button>
        ))}
      </div>

      <div className="content-area">
        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : activeView === 'tenders' ? (
          <div className="tenders-grid">
            {tenders.map(tender => (
              <div key={tender.id} className="tender-card">
                <div className="tender-header">
                  <h4>{tender.title}</h4>
                  <span className={`status-badge ${getStatusColor(tender.status)}`}>
                    {tender.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="tender-buyer">Buyer: {tender.buyer}</p>
                <p className="tender-product">{tender.product} - {tender.quantity} kg</p>
                <p className="tender-budget">Budget: ₹{tender.budget.toLocaleString()}</p>
                <p className="tender-deadline">Deadline: {new Date(tender.deadline).toLocaleDateString()}</p>
                <div className="tender-footer">
                  <span className="bids-count">{tender.bidsCount} bids</span>
                  <span className="match-score">{tender.matchScore}% match</span>
                </div>
                <button className="btn-bid">Place Bid</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bids-list">
            {myBids.map(bid => (
              <div key={bid.id} className="bid-item">
                <div className="bid-header">
                  <h4>{bid.tenderTitle}</h4>
                  <span className={`status-badge ${getStatusColor(bid.status)}`}>
                    {bid.status}
                  </span>
                </div>
                <p className="bid-amount">Bid Amount: ₹{bid.amount.toLocaleString()}</p>
                <p className="bid-date">Submitted: {new Date(bid.submittedAt).toLocaleDateString()}</p>
                <div className="bid-footer">
                  <span className="win-probability">Win Probability: {bid.winProbability}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .tender-bids-hub {
          background: #f8f9fa;
          min-height: 100vh;
        }

        /* Ultra-Compact Navbar Header */
        .navbar-header {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          height: 48px;
        }

        .title {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
          line-height: 1;
        }

        .status-badges {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: 4px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          line-height: 1;
          transition: all 0.2s;
        }

        .badge span {
          min-width: 16px;
          text-align: center;
        }

        .badge.open {
          background: #d1fae5;
          color: #065f46;
        }

        .badge.open svg {
          animation: pulse 2s ease-in-out infinite;
        }

        .badge.closing {
          background: #fed7aa;
          color: #9a3412;
        }

        .badge.closing svg {
          animation: pulse 2s ease-in-out infinite 0.5s;
        }

        .badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .badge.accepted {
          background: #d1fae5;
          color: #065f46;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .refresh-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid #e5e7eb;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          margin-left: auto;
          padding: 0;
        }

        .refresh-icon:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .refresh-icon:active {
          transform: scale(0.95);
        }

        .refresh-icon:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .refresh-icon svg {
          color: #6b7280;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .filter-tabs {
          display: flex;
          gap: 8px;
          padding: 12px 20px;
          flex-wrap: wrap;
        }

        .filter-tab {
          padding: 6px 14px;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
          background: white;
          cursor: pointer;
          font-weight: 500;
          font-size: 13px;
          transition: all 0.2s;
        }

        .filter-tab.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .content-area {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin: 0 20px 20px 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .tenders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 16px;
        }

        .tender-card {
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
          transition: all 0.2s;
        }

        .tender-card:hover {
          border-color: #667eea;
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }

        .tender-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .tender-header h4 {
          font-weight: 600;
          color: #1f2937;
          font-size: 16px;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
        }

        .tender-buyer {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .tender-product {
          font-size: 14px;
          color: #4b5563;
          margin-bottom: 8px;
        }

        .tender-budget {
          font-size: 16px;
          font-weight: 600;
          color: #059669;
          margin-bottom: 8px;
        }

        .tender-deadline {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 12px;
        }

        .tender-footer {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-top: 1px solid #e5e7eb;
          margin-bottom: 12px;
        }

        .bids-count {
          font-size: 13px;
          color: #6b7280;
        }

        .match-score {
          font-size: 13px;
          font-weight: 600;
          color: #667eea;
        }

        .btn-bid {
          width: 100%;
          background: #667eea;
          color: white;
          padding: 10px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .btn-bid:hover {
          background: #5568d3;
        }

        .bids-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .bid-item {
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          transition: all 0.2s;
        }

        .bid-item:hover {
          border-color: #667eea;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
        }

        .bid-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .bid-header h4 {
          font-weight: 600;
          color: #1f2937;
        }

        .bid-amount {
          font-size: 16px;
          font-weight: 600;
          color: #059669;
          margin-bottom: 8px;
        }

        .bid-date {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 12px;
        }

        .bid-footer {
          padding-top: 12px;
          border-top: 1px solid #e5e7eb;
        }

        .win-probability {
          font-size: 14px;
          font-weight: 600;
          color: #667eea;
        }

        .loading-state {
          text-align: center;
          padding: 40px;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}
