'use client';

import React, { useState, useEffect } from 'react';

interface InsightData {
  id: string;
  type: 'weather' | 'soil' | 'pest' | 'financial';
  title: string;
  value: string;
  change: string;
  status: 'good' | 'warning' | 'critical';
}

export function FarmInsightsModern() {
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, [filter]);

  const loadInsights = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setInsights([
        { id: '1', type: 'weather', title: 'Weather Forecast', value: '28°C', change: '+2°C', status: 'good' },
        { id: '2', type: 'soil', title: 'Soil Moisture', value: '65%', change: '-5%', status: 'warning' },
        { id: '3', type: 'pest', title: 'Pest Risk', value: 'Low', change: 'Stable', status: 'good' },
        { id: '4', type: 'financial', title: 'Revenue', value: '₹45,000', change: '+12%', status: 'good' },
      ]);
      setLoading(false);
    }, 500);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      good: 'bg-green-500',
      warning: 'bg-yellow-500',
      critical: 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="farm-insights">
      <div className="header-section">
        <h2 className="text-2xl font-bold text-gray-800">Farm Insights</h2>
        <button className="btn-primary">
          + Add Insight
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-blue-100">🌤️</div>
          <div className="stat-content">
            <p className="stat-label">Weather Score</p>
            <p className="stat-value">85/100</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-green-100">🌱</div>
          <div className="stat-content">
            <p className="stat-label">Soil Health</p>
            <p className="stat-value">Good</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-yellow-100">🐛</div>
          <div className="stat-content">
            <p className="stat-label">Pest Risk</p>
            <p className="stat-value">Low</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-purple-100">💰</div>
          <div className="stat-content">
            <p className="stat-label">Revenue</p>
            <p className="stat-value">₹45K</p>
          </div>
        </div>
      </div>

      <div className="filter-tabs">
        {['all', 'weather', 'soil', 'pest', 'financial'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`filter-tab ${filter === tab ? 'active' : ''}`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="insights-grid">
        {loading ? (
          <div className="loading-state">Loading insights...</div>
        ) : insights.length === 0 ? (
          <div className="empty-state">
            <p>No insights available</p>
          </div>
        ) : (
          insights.map(insight => (
            <div key={insight.id} className="insight-card">
              <div className="card-header">
                <h4>{insight.title}</h4>
                <span className={`status-badge ${getStatusColor(insight.status)}`}>
                  {insight.status}
                </span>
              </div>
              <div className="card-body">
                <p className="insight-value">{insight.value}</p>
                <p className="insight-change">{insight.change}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .farm-insights {
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

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .insight-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }

        .insight-card:hover {
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
          gap: 8px;
        }

        .insight-value {
          font-size: 32px;
          font-weight: bold;
          color: #1f2937;
        }

        .insight-change {
          font-size: 14px;
          color: #059669;
          font-weight: 600;
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
