'use client';

import React, { useState, useEffect } from 'react';
import { Truck, Clock, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'delayed';
  progress: number;
  eta: string;
  carrier: string;
  weight: string;
  cost: number;
}

export function LogisticsManager() {
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  useEffect(() => {
    loadShipments();
  }, [filter]);

  const loadShipments = async () => {
    setLoading(true);
    setTimeout(() => {
      setShipments([
        { id: 'SHP-001', origin: 'Nashik Farm', destination: 'Mumbai Market', status: 'in_transit', progress: 65, eta: '2 hours', carrier: 'BlueDart', weight: '1200 kg', cost: 8500 },
        { id: 'SHP-002', origin: 'Pune Warehouse', destination: 'Delhi Hub', status: 'pending', progress: 10, eta: '8 hours', carrier: 'Rivigo', weight: '2500 kg', cost: 15000 },
        { id: 'SHP-003', origin: 'Bangalore Center', destination: 'Chennai Port', status: 'delivered', progress: 100, eta: 'Completed', carrier: 'Snowman', weight: '800 kg', cost: 6200 },
        { id: 'SHP-004', origin: 'Hyderabad Hub', destination: 'Kolkata Market', status: 'delayed', progress: 45, eta: '12 hours', carrier: 'Delhivery', weight: '1500 kg', cost: 11000 },
      ]);
      setLoading(false);
    }, 500);
  };

  const statusCounts = {
    in_transit: shipments.filter(s => s.status === 'in_transit').length,
    pending: shipments.filter(s => s.status === 'pending').length,
    delivered: shipments.filter(s => s.status === 'delivered').length,
    delayed: shipments.filter(s => s.status === 'delayed').length,
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-500',
      in_transit: 'bg-blue-500',
      delivered: 'bg-green-500',
      delayed: 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="logistics-manager">
      {/* Ultra-Compact Navbar-Style Header */}
      <div className="navbar-header">
        <h2 className="title">Logistics</h2>
        
        <div className="status-badges">
          <div className="badge in-transit">
            <Truck size={14} />
            <span>{statusCounts.in_transit}</span>
          </div>
          
          <div className="badge pending">
            <Clock size={14} />
            <span>{statusCounts.pending}</span>
          </div>
          
          <div className="badge delivered">
            <CheckCircle size={14} />
            <span>{statusCounts.delivered}</span>
          </div>
          
          <div className="badge delayed">
            <AlertTriangle size={14} />
            <span>{statusCounts.delayed}</span>
          </div>
        </div>

        <button 
          className="refresh-icon" 
          onClick={loadShipments}
          disabled={loading}
          aria-label="Refresh"
        >
          <RefreshCw size={16} className={loading ? 'spinning' : ''} />
        </button>
      </div>

      <div className="filter-tabs">
        {['all', 'pending', 'in_transit', 'delivered', 'delayed'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`filter-tab ${filter === tab ? 'active' : ''}`}
          >
            {tab.toUpperCase().replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="shipments-layout">
        <div className="shipments-list">
          {loading ? (
            <div className="loading-state">Loading shipments...</div>
          ) : shipments.length === 0 ? (
            <div className="empty-state">
              <p>No shipments found</p>
            </div>
          ) : (
            shipments.map(shipment => (
              <div
                key={shipment.id}
                onClick={() => setSelectedShipment(shipment)}
                className={`shipment-item ${selectedShipment?.id === shipment.id ? 'selected' : ''}`}
              >
                <div className="shipment-header">
                  <h4>{shipment.id}</h4>
                  <span className={`status-badge ${getStatusColor(shipment.status)}`}>
                    {shipment.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="shipment-route">{shipment.origin} → {shipment.destination}</p>
                <p className="shipment-carrier">Carrier: {shipment.carrier}</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${shipment.progress}%` }}></div>
                </div>
                <p className="shipment-eta">ETA: {shipment.eta}</p>
              </div>
            ))
          )}
        </div>

        <div className="shipment-details">
          {selectedShipment ? (
            <>
              <div className="details-header">
                <h3>Shipment {selectedShipment.id}</h3>
                <span className={`status-badge ${getStatusColor(selectedShipment.status)}`}>
                  {selectedShipment.status.replace('_', ' ')}
                </span>
              </div>

              <div className="details-info">
                <div className="info-row">
                  <span className="label">Origin:</span>
                  <span className="value">{selectedShipment.origin}</span>
                </div>
                <div className="info-row">
                  <span className="label">Destination:</span>
                  <span className="value">{selectedShipment.destination}</span>
                </div>
                <div className="info-row">
                  <span className="label">Carrier:</span>
                  <span className="value">{selectedShipment.carrier}</span>
                </div>
                <div className="info-row">
                  <span className="label">Weight:</span>
                  <span className="value">{selectedShipment.weight}</span>
                </div>
                <div className="info-row">
                  <span className="label">Cost:</span>
                  <span className="value">₹{selectedShipment.cost.toLocaleString()}</span>
                </div>
                <div className="info-row">
                  <span className="label">ETA:</span>
                  <span className="value">{selectedShipment.eta}</span>
                </div>
                <div className="info-row">
                  <span className="label">Progress:</span>
                  <span className="value">{selectedShipment.progress}%</span>
                </div>
              </div>

              <div className="actions-section">
                <button className="btn-track">Track Shipment</button>
                <button className="btn-contact">Contact Carrier</button>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <p>Select a shipment to view details</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .logistics-manager {
          background: #f8f9fa;
          min-height: 100vh;
        }

        /* Ultra-Compact Navbar Header - Single Row, Left-Aligned */
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

        .badge.in-transit {
          background: #dbeafe;
          color: #1e40af;
        }

        .badge.in-transit svg {
          animation: pulse 2s ease-in-out infinite;
        }

        .badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .badge.pending svg {
          animation: pulse 2s ease-in-out infinite 0.5s;
        }

        .badge.delivered {
          background: #d1fae5;
          color: #065f46;
        }

        .badge.delayed {
          background: #fee2e2;
          color: #991b1b;
        }

        .badge.delayed svg {
          animation: pulse 2s ease-in-out infinite 1s;
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

        .shipments-layout {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 20px;
          height: calc(100vh - 200px);
          padding: 0 20px 20px 20px;
        }

        @media (max-width: 1024px) {
          .shipments-layout {
            grid-template-columns: 1fr;
            height: auto;
          }
        }

        @media (max-width: 640px) {
          .navbar-header {
            padding: 10px 16px;
            height: auto;
            flex-wrap: wrap;
          }

          .title {
            font-size: 15px;
          }

          .status-badges {
            gap: 6px;
          }

          .badge {
            padding: 3px 8px;
            font-size: 12px;
            gap: 4px;
          }

          .badge svg {
            width: 12px;
            height: 12px;
          }

          .refresh-icon {
            width: 28px;
            height: 28px;
          }

          .refresh-icon svg {
            width: 14px;
            height: 14px;
          }
        }

        .shipments-list {
          background: white;
          border-radius: 12px;
          padding: 16px;
          overflow-y: auto;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .shipment-item {
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 12px;
          cursor: pointer;
          border: 2px solid #e5e7eb;
          transition: all 0.2s;
        }

        .shipment-item:hover {
          border-color: #667eea;
          transform: translateX(4px);
        }

        .shipment-item.selected {
          background: #f3f4f6;
          border-color: #667eea;
        }

        .shipment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .shipment-header h4 {
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

        .shipment-route {
          font-size: 14px;
          color: #4b5563;
          margin-bottom: 4px;
        }

        .shipment-carrier {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          transition: width 0.3s;
        }

        .shipment-eta {
          font-size: 13px;
          font-weight: 600;
          color: #667eea;
        }

        .shipment-details {
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

        .btn-track,
        .btn-contact {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: transform 0.2s;
        }

        .btn-track {
          background: #667eea;
          color: white;
        }

        .btn-contact {
          background: #10b981;
          color: white;
        }

        .btn-track:hover,
        .btn-contact:hover {
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
