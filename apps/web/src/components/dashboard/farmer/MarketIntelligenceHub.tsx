'use client';

import React, { useState, useEffect } from 'react';

interface MarketData {
  id: string;
  product: string;
  currentPrice: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  demand: 'high' | 'medium' | 'low';
  forecast: string;
}

export default function MarketIntelligenceHub() {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarketData();
  }, [filter]);

  const loadMarketData = async () => {
    setLoading(true);
    setTimeout(() => {
      setMarketData([
        { id: '1', product: 'Wheat', currentPrice: 2800, change: 5.2, trend: 'up', demand: 'high', forecast: 'Rising' },
        { id: '2', product: 'Rice', currentPrice: 3500, change: -2.1, trend: 'down', demand: 'medium', forecast: 'Stable' },
        { id: '3', product: 'Corn', currentPrice: 2200, change: 0.5, trend: 'stable', demand: 'high', forecast: 'Rising' },
        { id: '4', product: 'Soybeans', currentPrice: 4500, change: 8.3, trend: 'up', demand: 'high', forecast: 'Rising' },
      ]);
      setLoading(false);
    }, 500);
  };

  const getTrendColor = (trend: string) => {
    const colors = {
      up: 'text-green-600',
      down: 'text-red-600',
      stable: 'text-gray-600'
    };
    return colors[trend as keyof typeof colors] || 'text-gray-600';
  };

  const getDemandColor = (demand: string) => {
    const colors = {
      high: 'bg-green-500',
      medium: 'bg-yellow-500',
      low: 'bg-red-500'
    };
    return colors[demand as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="market-intelligence">
      <div className="header-section">
        <h2 className="text-2xl font-bold text-gray-800">Market Intelligence Hub</h2>
        <button className="btn-primary">
          + Add Alert
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-green-100">📈</div>
          <div className="stat-content">
            <p className="stat-label">Trending Up</p>
            <p className="stat-value">{marketData.filter(m => m.trend === 'up').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-red-100">📉</div>
          <div className="stat-content">
            <p className="stat-label">Trending Down</p>
            <p className="stat-value">{marketData.filter(m => m.trend === 'down').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-blue-100">🔥</div>
          <div className="stat-content">
            <p className="stat-label">High Demand</p>
            <p className="stat-value">{marketData.filter(m => m.demand === 'high').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-purple-100">💰</div>
          <div className="stat-content">
            <p className="stat-label">Avg Price</p>
            <p className="stat-value">₹{Math.round(marketData.reduce((sum, m) => sum + m.currentPrice, 0) / marketData.length)}</p>
          </div>
        </div>
      </div>

      <div className="filter-tabs">
        {['all', 'trending', 'high_demand', 'stable'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`filter-tab ${filter === tab ? 'active' : ''}`}
          >
            {tab.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      <div className="market-grid">
        {loading ? (
          <div className="loading-state">Loading market data...</div>
        ) : marketData.length === 0 ? (
          <div className="empty-state">
            <p>No market data available</p>
          </div>
        ) : (
          marketData.map(item => (
            <div key={item.id} className="market-card">
              <div className="card-header">
                <h4>{item.product}</h4>
                <span className={`status-badge ${getDemandColor(item.demand)}`}>
                  {item.demand} demand
                </span>
              </div>
              <div className="card-body">
                <div className="price-section">
                  <span className="price-label">Current Price</span>
                  <span className="price-value">₹{item.currentPrice}</span>
                </div>
                <div className="change-section">
                  <span className={`change-value ${getTrendColor(item.trend)}`}>
                    {item.change > 0 ? '+' : ''}{item.change}%
                  </span>
                  <span className="trend-icon">{item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'}</span>
                </div>
                <div className="forecast-section">
                  <span className="forecast-label">Forecast:</span>
                  <span className="forecast-value">{item.forecast}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .market-intelligence {
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

        .market-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .market-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }

        .market-card:hover {
          transform: translateY(-4px);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .card-header h4 {
          font-weight: 600;
          color: #1f2937;
          font-size: 18px;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
        }

        .card-body {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .price-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price-label {
          color: #6b7280;
          font-size: 14px;
        }

        .price-value {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
        }

        .change-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .change-value {
          font-size: 18px;
          font-weight: 600;
        }

        .trend-icon {
          font-size: 24px;
        }

        .forecast-section {
          display: flex;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid #f3f4f6;
        }

        .forecast-label {
          color: #6b7280;
          font-size: 14px;
        }

        .forecast-value {
          font-weight: 600;
          color: #059669;
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
