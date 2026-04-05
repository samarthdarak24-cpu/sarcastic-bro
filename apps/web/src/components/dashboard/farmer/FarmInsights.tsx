'use client';

import React, { useState, useEffect } from 'react';

interface FarmInsightsProps {
  compact?: boolean;
}

export default function FarmInsights({ compact = false }: FarmInsightsProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'weather', label: 'Weather', icon: '🌤️' },
    { id: 'soil', label: 'Soil Health', icon: '🌱' },
    { id: 'pest', label: 'Pest Control', icon: '🐛' },
    { id: 'irrigation', label: 'Irrigation', icon: '💧' },
    { id: 'fertilizer', label: 'Fertilizer', icon: '🧪' },
    { id: 'crop', label: 'Crop Health', icon: '🌾' },
    { id: 'yield', label: 'Yield Forecast', icon: '📈' },
    { id: 'financial', label: 'Financial', icon: '💰' },
    { id: 'market', label: 'Market Trends', icon: '📉' },
    { id: 'equipment', label: 'Equipment', icon: '🚜' },
    { id: 'alerts', label: 'Alerts', icon: '🔔' }
  ];

  return (
    <div className="farm-insights">
      <div className="header-section">
        <h2 className="text-2xl font-bold text-gray-800">Farm Insights</h2>
        <button className="btn-primary">
          📥 Export Report
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
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`filter-tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="insights-grid">
            <div className="insight-card">
              <div className="card-header">
                <h4>🌾 Total Crops</h4>
                <span className="status-badge bg-green-500">Active</span>
              </div>
              <div className="card-body">
                <p className="insight-value">12</p>
                <p className="insight-change">+2 this season</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>📏 Total Area</h4>
                <span className="status-badge bg-blue-500">Cultivated</span>
              </div>
              <div className="card-body">
                <p className="insight-value">25 Acres</p>
                <p className="insight-change">85% utilized</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>💧 Water Usage</h4>
                <span className="status-badge bg-cyan-500">Optimal</span>
              </div>
              <div className="card-body">
                <p className="insight-value">1200 L/day</p>
                <p className="insight-change">-15% vs last month</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>📊 Productivity</h4>
                <span className="status-badge bg-purple-500">High</span>
              </div>
              <div className="card-body">
                <p className="insight-value">92%</p>
                <p className="insight-change">+8% improvement</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'weather' && (
          <div className="insights-grid">
            <div className="insight-card">
              <div className="card-header">
                <h4>🌡️ Temperature</h4>
                <span className="status-badge bg-orange-500">Warm</span>
              </div>
              <div className="card-body">
                <p className="insight-value">28°C</p>
                <p className="insight-change">+2°C from yesterday</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>💨 Wind Speed</h4>
                <span className="status-badge bg-blue-500">Moderate</span>
              </div>
              <div className="card-body">
                <p className="insight-value">12 km/h</p>
                <p className="insight-change">NE direction</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>🌧️ Rainfall</h4>
                <span className="status-badge bg-cyan-500">Expected</span>
              </div>
              <div className="card-body">
                <p className="insight-value">15mm</p>
                <p className="insight-change">Next 3 days</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>☀️ UV Index</h4>
                <span className="status-badge bg-yellow-500">High</span>
              </div>
              <div className="card-body">
                <p className="insight-value">8/10</p>
                <p className="insight-change">Peak at 2 PM</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'soil' && (
          <div className="insights-grid">
            <div className="insight-card">
              <div className="card-header">
                <h4>💧 Moisture Level</h4>
                <span className="status-badge bg-blue-500">Good</span>
              </div>
              <div className="card-body">
                <p className="insight-value">65%</p>
                <p className="insight-change">Optimal range</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>🧪 pH Level</h4>
                <span className="status-badge bg-green-500">Balanced</span>
              </div>
              <div className="card-body">
                <p className="insight-value">6.8</p>
                <p className="insight-change">Ideal for crops</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>🌱 Nitrogen (N)</h4>
                <span className="status-badge bg-purple-500">High</span>
              </div>
              <div className="card-body">
                <p className="insight-value">85 ppm</p>
                <p className="insight-change">+10 ppm</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>🔬 Organic Matter</h4>
                <span className="status-badge bg-green-500">Rich</span>
              </div>
              <div className="card-body">
                <p className="insight-value">4.2%</p>
                <p className="insight-change">Excellent quality</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pest' && (
          <div className="insights-grid">
            <div className="insight-card">
              <div className="card-header">
                <h4>🐛 Pest Risk Level</h4>
                <span className="status-badge bg-green-500">Low</span>
              </div>
              <div className="card-body">
                <p className="insight-value">15%</p>
                <p className="insight-change">Safe zone</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>🦗 Detected Pests</h4>
                <span className="status-badge bg-yellow-500">Monitor</span>
              </div>
              <div className="card-body">
                <p className="insight-value">3 Types</p>
                <p className="insight-change">Aphids, Beetles</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>💊 Treatment Status</h4>
                <span className="status-badge bg-blue-500">Active</span>
              </div>
              <div className="card-body">
                <p className="insight-value">2 Areas</p>
                <p className="insight-change">Under treatment</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>🛡️ Prevention Score</h4>
                <span className="status-badge bg-green-500">Strong</span>
              </div>
              <div className="card-body">
                <p className="insight-value">88%</p>
                <p className="insight-change">Well protected</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'irrigation' && (
          <div className="insights-grid">
            <div className="insight-card">
              <div className="card-header">
                <h4>💧 Daily Water Usage</h4>
                <span className="status-badge bg-blue-500">Optimal</span>
              </div>
              <div className="card-body">
                <p className="insight-value">1200 L</p>
                <p className="insight-change">-15% efficient</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>⏰ Schedule Status</h4>
                <span className="status-badge bg-green-500">On Track</span>
              </div>
              <div className="card-body">
                <p className="insight-value">3x Daily</p>
                <p className="insight-change">6AM, 12PM, 6PM</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>🚰 System Efficiency</h4>
                <span className="status-badge bg-green-500">Excellent</span>
              </div>
              <div className="card-body">
                <p className="insight-value">94%</p>
                <p className="insight-change">No leaks detected</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>💰 Cost Savings</h4>
                <span className="status-badge bg-purple-500">High</span>
              </div>
              <div className="card-body">
                <p className="insight-value">₹2,400</p>
                <p className="insight-change">This month</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fertilizer' && (
          <div className="insights-grid">
            <div className="insight-card">
              <div className="card-header">
                <h4>🧪 NPK Ratio</h4>
                <span className="status-badge bg-green-500">Balanced</span>
              </div>
              <div className="card-body">
                <p className="insight-value">19:19:19</p>
                <p className="insight-change">Ideal mix</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>📦 Stock Level</h4>
                <span className="status-badge bg-yellow-500">Low</span>
              </div>
              <div className="card-body">
                <p className="insight-value">45 kg</p>
                <p className="insight-change">Reorder soon</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>📅 Last Application</h4>
                <span className="status-badge bg-blue-500">Recent</span>
              </div>
              <div className="card-body">
                <p className="insight-value">5 Days</p>
                <p className="insight-change">Next in 10 days</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>💵 Monthly Cost</h4>
                <span className="status-badge bg-purple-500">Budget</span>
              </div>
              <div className="card-body">
                <p className="insight-value">₹8,500</p>
                <p className="insight-change">Within limit</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'crop' && (
          <div className="insights-grid">
            <div className="insight-card">
              <div className="card-header">
                <h4>🌾 Overall Health</h4>
                <span className="status-badge bg-green-500">Excellent</span>
              </div>
              <div className="card-body">
                <p className="insight-value">92%</p>
                <p className="insight-change">+5% this week</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>📈 Growth Rate</h4>
                <span className="status-badge bg-green-500">Fast</span>
              </div>
              <div className="card-body">
                <p className="insight-value">8 cm/week</p>
                <p className="insight-change">Above average</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>🍃 Leaf Color</h4>
                <span className="status-badge bg-green-500">Healthy</span>
              </div>
              <div className="card-body">
                <p className="insight-value">Dark Green</p>
                <p className="insight-change">No deficiency</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>🌱 Germination</h4>
                <span className="status-badge bg-green-500">High</span>
              </div>
              <div className="card-body">
                <p className="insight-value">95%</p>
                <p className="insight-change">Excellent rate</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'yield' && (
          <div className="insights-grid">
            <div className="insight-card">
              <div className="card-header">
                <h4>📊 Predicted Yield</h4>
                <span className="status-badge bg-green-500">High</span>
              </div>
              <div className="card-body">
                <p className="insight-value">2,500 kg</p>
                <p className="insight-change">+12% vs last year</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>📅 Harvest Date</h4>
                <span className="status-badge bg-blue-500">Scheduled</span>
              </div>
              <div className="card-body">
                <p className="insight-value">45 Days</p>
                <p className="insight-change">May 20, 2024</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>💰 Expected Revenue</h4>
                <span className="status-badge bg-purple-500">Profit</span>
              </div>
              <div className="card-body">
                <p className="insight-value">₹1.2L</p>
                <p className="insight-change">Based on market</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>📈 Quality Grade</h4>
                <span className="status-badge bg-green-500">Grade A</span>
              </div>
              <div className="card-body">
                <p className="insight-value">Premium</p>
                <p className="insight-change">Top quality</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="insights-grid">
            <div className="insight-card">
              <div className="card-header">
                <h4>💰 Total Revenue</h4>
                <span className="status-badge bg-green-500">Profit</span>
              </div>
              <div className="card-body">
                <p className="insight-value">₹45,000</p>
                <p className="insight-change">+12% this month</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>💸 Expenses</h4>
                <span className="status-badge bg-orange-500">Moderate</span>
              </div>
              <div className="card-body">
                <p className="insight-value">₹18,500</p>
                <p className="insight-change">Within budget</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>📊 Profit Margin</h4>
                <span className="status-badge bg-green-500">Healthy</span>
              </div>
              <div className="card-body">
                <p className="insight-value">58%</p>
                <p className="insight-change">+5% improvement</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>💳 Pending Payments</h4>
                <span className="status-badge bg-yellow-500">Due</span>
              </div>
              <div className="card-body">
                <p className="insight-value">₹12,000</p>
                <p className="insight-change">3 invoices</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'market' && (
          <div className="insights-grid">
            <div className="insight-card">
              <div className="card-header">
                <h4>📈 Price Trend</h4>
                <span className="status-badge bg-green-500">Rising</span>
              </div>
              <div className="card-body">
                <p className="insight-value">₹42/kg</p>
                <p className="insight-change">+8% this week</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>📊 Demand Level</h4>
                <span className="status-badge bg-green-500">High</span>
              </div>
              <div className="card-body">
                <p className="insight-value">85%</p>
                <p className="insight-change">Strong demand</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>🏪 Best Market</h4>
                <span className="status-badge bg-blue-500">Local</span>
              </div>
              <div className="card-body">
                <p className="insight-value">Mumbai</p>
                <p className="insight-change">₹45/kg avg</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>📅 Best Sell Time</h4>
                <span className="status-badge bg-purple-500">Optimal</span>
              </div>
              <div className="card-body">
                <p className="insight-value">Next Week</p>
                <p className="insight-change">Peak prices</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="insights-grid">
            <div className="insight-card">
              <div className="card-header">
                <h4>🚜 Tractor Status</h4>
                <span className="status-badge bg-green-500">Operational</span>
              </div>
              <div className="card-body">
                <p className="insight-value">Good</p>
                <p className="insight-change">Last service: 15 days</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>⚙️ Maintenance Due</h4>
                <span className="status-badge bg-yellow-500">Soon</span>
              </div>
              <div className="card-body">
                <p className="insight-value">2 Items</p>
                <p className="insight-change">In 10 days</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>⛽ Fuel Level</h4>
                <span className="status-badge bg-orange-500">Low</span>
              </div>
              <div className="card-body">
                <p className="insight-value">35%</p>
                <p className="insight-change">Refill needed</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>🔧 Repair Cost</h4>
                <span className="status-badge bg-blue-500">Budget</span>
              </div>
              <div className="card-body">
                <p className="insight-value">₹5,200</p>
                <p className="insight-change">This month</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="insights-grid">
            <div className="insight-card">
              <div className="card-header">
                <h4>🔔 Active Alerts</h4>
                <span className="status-badge bg-red-500">Urgent</span>
              </div>
              <div className="card-body">
                <p className="insight-value">3</p>
                <p className="insight-change">Requires attention</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>⚠️ Weather Warning</h4>
                <span className="status-badge bg-orange-500">Alert</span>
              </div>
              <div className="card-body">
                <p className="insight-value">Heavy Rain</p>
                <p className="insight-change">Tomorrow 3PM</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>💧 Low Water</h4>
                <span className="status-badge bg-yellow-500">Warning</span>
              </div>
              <div className="card-body">
                <p className="insight-value">Tank 2</p>
                <p className="insight-change">25% remaining</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="card-header">
                <h4>📅 Task Reminder</h4>
                <span className="status-badge bg-blue-500">Info</span>
              </div>
              <div className="card-body">
                <p className="insight-value">5 Tasks</p>
                <p className="insight-change">Due today</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .farm-insights {
          padding: 24px;
          background: transparent;
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
