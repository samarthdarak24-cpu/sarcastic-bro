'use client';

import React, { useState, useEffect } from 'react';
import { securityService } from '@/services/securityService';

export function SecurityDashboard() {
  const [securityData, setSecurityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    setLoading(true);
    try {
      const data = await securityService.getSecurityOverview();
      setSecurityData(data);
    } catch (error) {
      console.error('Failed to load security data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading security dashboard...</div>;

  return (
    <div className="security-dashboard">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Security Dashboard</h2>

      <div className="security-score-card">
        <div className="score-circle">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10"/>
            <circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="10"
              strokeDasharray={`${securityData.securityScore * 2.83} 283`}
              transform="rotate(-90 50 50)"/>
          </svg>
          <div className="score-text">
            <span className="score-value">{securityData.securityScore}</span>
            <span className="score-label">/100</span>
          </div>
        </div>
        <div className="score-info">
          <h3>Security Score</h3>
          <p className="score-status">{securityData.securityScore >= 80 ? 'Excellent' : securityData.securityScore >= 60 ? 'Good' : 'Needs Improvement'}</p>
          <p className="score-description">Your account security is {securityData.securityScore >= 80 ? 'strong' : 'moderate'}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card green">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <p className="stat-value">{securityData.activeProtections}</p>
            <p className="stat-label">Active Protections</p>
          </div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <p className="stat-value">{securityData.alerts}</p>
            <p className="stat-label">Security Alerts</p>
          </div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon">🔐</div>
          <div className="stat-content">
            <p className="stat-value">{securityData.blockedAttempts}</p>
            <p className="stat-label">Blocked Attempts</p>
          </div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon">📱</div>
          <div className="stat-content">
            <p className="stat-value">{securityData.trustedDevices}</p>
            <p className="stat-label">Trusted Devices</p>
          </div>
        </div>
      </div>

      <div className="security-features">
        <h3>Security Features</h3>
        <div className="features-grid">
          {securityData.features.map((feature: any) => (
            <div key={feature.id} className="feature-card">
              <div className="feature-header">
                <span className="feature-icon">{feature.icon}</span>
                <label className="toggle-switch">
                  <input type="checkbox" checked={feature.enabled} onChange={() => {}} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <h4>{feature.name}</h4>
              <p>{feature.description}</p>
              <span className={`feature-status ${feature.enabled ? 'active' : 'inactive'}`}>
                {feature.enabled ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Security Activity</h3>
        <div className="activity-list">
          {securityData.recentActivity.map((activity: any) => (
            <div key={activity.id} className="activity-item">
              <div className={`activity-icon ${activity.type}`}>{activity.icon}</div>
              <div className="activity-content">
                <p className="activity-title">{activity.title}</p>
                <p className="activity-description">{activity.description}</p>
                <p className="activity-time">{new Date(activity.timestamp).toLocaleString()}</p>
              </div>
              <span className={`activity-badge ${activity.severity}`}>{activity.severity}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .security-dashboard {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .security-score-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 40px;
          margin-bottom: 24px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }

        .score-circle {
          position: relative;
          width: 150px;
          height: 150px;
        }

        .score-circle svg {
          width: 100%;
          height: 100%;
        }

        .score-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .score-value {
          font-size: 48px;
          font-weight: bold;
          display: block;
        }

        .score-label {
          font-size: 20px;
          opacity: 0.8;
        }

        .score-info h3 {
          font-size: 28px;
          margin-bottom: 8px;
        }

        .score-status {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .score-description {
          opacity: 0.9;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .stat-card.green { border-left: 4px solid #10b981; }
        .stat-card.yellow { border-left: 4px solid #f59e0b; }
        .stat-card.blue { border-left: 4px solid #3b82f6; }
        .stat-card.purple { border-left: 4px solid #8b5cf6; }

        .stat-icon {
          font-size: 32px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: bold;
          color: #1f2937;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
        }

        .security-features,
        .recent-activity {
          background: white;
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .security-features h3,
        .recent-activity h3 {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #1f2937;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .feature-card {
          background: #f9fafb;
          padding: 20px;
          border-radius: 12px;
          border: 2px solid #e5e7eb;
        }

        .feature-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .feature-icon {
          font-size: 32px;
        }

        .toggle-switch {
          position: relative;
          width: 50px;
          height: 26px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 26px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }

        input:checked + .toggle-slider {
          background-color: #10b981;
        }

        input:checked + .toggle-slider:before {
          transform: translateX(24px);
        }

        .feature-card h4 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #1f2937;
        }

        .feature-card p {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 12px;
          line-height: 1.5;
        }

        .feature-status {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .feature-status.active {
          background: #d1fae5;
          color: #065f46;
        }

        .feature-status.inactive {
          background: #f3f4f6;
          color: #6b7280;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
          border-left: 4px solid #e5e7eb;
        }

        .activity-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .activity-icon.success { background: #d1fae5; }
        .activity-icon.warning { background: #fef3c7; }
        .activity-icon.error { background: #fee2e2; }
        .activity-icon.info { background: #dbeafe; }

        .activity-content {
          flex: 1;
        }

        .activity-title {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .activity-description {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .activity-time {
          font-size: 12px;
          color: #9ca3af;
        }

        .activity-badge {
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .activity-badge.low { background: #d1fae5; color: #065f46; }
        .activity-badge.medium { background: #fef3c7; color: #92400e; }
        .activity-badge.high { background: #fee2e2; color: #991b1b; }

        .loading {
          text-align: center;
          padding: 60px;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}
