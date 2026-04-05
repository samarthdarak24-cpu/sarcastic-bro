'use client';

import React, { useState, useEffect } from 'react';
import { complianceService } from '@/services/complianceService';

export function ComplianceTracking() {
  const [complianceData, setComplianceData] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = async () => {
    setLoading(true);
    try {
      const data = await complianceService.getComplianceOverview();
      setComplianceData(data);
    } catch (error) {
      console.error('Failed to load compliance data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading compliance data...</div>;

  const getStatusColor = (status: string) => {
    const colors = {
      compliant: 'bg-green-500',
      'partially-compliant': 'bg-yellow-500',
      'non-compliant': 'bg-red-500',
      pending: 'bg-blue-500',
      expired: 'bg-gray-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="compliance-tracking">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Compliance Tracking</h2>

      <div className="compliance-score-section">
        <div className="score-card-main">
          <div className="score-visual">
            <svg viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="#e5e7eb" strokeWidth="20"/>
              <circle cx="100" cy="100" r="90" fill="none" stroke="#10b981" strokeWidth="20"
                strokeDasharray={`${complianceData.overallScore * 5.65} 565`}
                transform="rotate(-90 100 100)"/>
            </svg>
            <div className="score-center">
              <span className="score-number">{complianceData.overallScore}%</span>
              <span className="score-text">Compliant</span>
            </div>
          </div>
          <div className="score-details">
            <h3>Overall Compliance Score</h3>
            <p className="score-status">
              {complianceData.overallScore >= 90 ? 'Excellent' : 
               complianceData.overallScore >= 70 ? 'Good' : 
               complianceData.overallScore >= 50 ? 'Fair' : 'Needs Attention'}
            </p>
            <div className="score-breakdown">
              <div className="breakdown-item">
                <span className="breakdown-label">Compliant:</span>
                <span className="breakdown-value">{complianceData.compliantCount}</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Pending:</span>
                <span className="breakdown-value">{complianceData.pendingCount}</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Non-Compliant:</span>
                <span className="breakdown-value">{complianceData.nonCompliantCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card green">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <p className="stat-value">{complianceData.activeCertificates}</p>
            <p className="stat-label">Active Certificates</p>
          </div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <p className="stat-value">{complianceData.expiringCount}</p>
            <p className="stat-label">Expiring Soon</p>
          </div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <p className="stat-value">{complianceData.violations}</p>
            <p className="stat-label">Violations</p>
          </div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <p className="stat-value">{complianceData.auditsCompleted}</p>
            <p className="stat-label">Audits Completed</p>
          </div>
        </div>
      </div>

      <div className="compliance-categories">
        <h3>Compliance Categories</h3>
        <div className="categories-grid">
          {complianceData.categories.map((category: any) => (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`category-card ${selectedCategory === category.id ? 'selected' : ''}`}
            >
              <div className="category-header">
                <span className="category-icon">{category.icon}</span>
                <span className={`category-status ${getStatusColor(category.status)}`}>
                  {category.status.replace('-', ' ')}
                </span>
              </div>
              <h4>{category.name}</h4>
              <div className="category-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${category.completionRate}%` }}
                  ></div>
                </div>
                <span className="progress-text">{category.completionRate}%</span>
              </div>
              <div className="category-stats">
                <span>{category.compliantItems}/{category.totalItems} items</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedCategory && (
        <div className="category-details">
          <h3>
            {complianceData.categories.find((c: any) => c.id === selectedCategory)?.name} Details
          </h3>
          <div className="requirements-list">
            {complianceData.categories
              .find((c: any) => c.id === selectedCategory)
              ?.requirements.map((req: any) => (
                <div key={req.id} className="requirement-card">
                  <div className="requirement-header">
                    <div className="requirement-title">
                      <span className={`requirement-status ${getStatusColor(req.status)}`}>
                        {req.status === 'compliant' && '✓'}
                        {req.status === 'pending' && '⏳'}
                        {req.status === 'non-compliant' && '✗'}
                      </span>
                      <h4>{req.title}</h4>
                    </div>
                    <span className={`priority-badge ${req.priority}`}>
                      {req.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="requirement-description">{req.description}</p>
                  <div className="requirement-meta">
                    <div className="meta-item">
                      <span className="meta-label">Last Updated:</span>
                      <span className="meta-value">{new Date(req.lastUpdated).toLocaleDateString()}</span>
                    </div>
                    {req.expiryDate && (
                      <div className="meta-item">
                        <span className="meta-label">Expires:</span>
                        <span className="meta-value">{new Date(req.expiryDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  {req.documents && req.documents.length > 0 && (
                    <div className="requirement-documents">
                      <p className="documents-label">Documents:</p>
                      {req.documents.map((doc: string, idx: number) => (
                        <span key={idx} className="document-item">📄 {doc}</span>
                      ))}
                    </div>
                  )}
                  <div className="requirement-actions">
                    {req.status === 'pending' && (
                      <button className="btn-upload">Upload Documents</button>
                    )}
                    {req.status === 'non-compliant' && (
                      <button className="btn-resolve">Resolve Issue</button>
                    )}
                    <button className="btn-view-details">View Details</button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="upcoming-deadlines">
        <h3>Upcoming Deadlines</h3>
        <div className="deadlines-list">
          {complianceData.upcomingDeadlines.map((deadline: any) => (
            <div key={deadline.id} className="deadline-item">
              <div className="deadline-date">
                <span className="date-day">{new Date(deadline.date).getDate()}</span>
                <span className="date-month">{new Date(deadline.date).toLocaleDateString('en-US', { month: 'short' })}</span>
              </div>
              <div className="deadline-content">
                <h4>{deadline.title}</h4>
                <p>{deadline.description}</p>
                <span className={`deadline-urgency ${deadline.urgency}`}>
                  {deadline.urgency.toUpperCase()}
                </span>
              </div>
              <button className="btn-action">Take Action</button>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .compliance-tracking {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .compliance-score-section {
          margin-bottom: 32px;
        }

        .score-card-main {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 40px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }

        .score-visual {
          position: relative;
          width: 200px;
          height: 200px;
        }

        .score-visual svg {
          width: 100%;
          height: 100%;
        }

        .score-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .score-number {
          display: block;
          font-size: 56px;
          font-weight: bold;
        }

        .score-text {
          display: block;
          font-size: 18px;
          opacity: 0.9;
        }

        .score-details h3 {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .score-status {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 20px;
          opacity: 0.95;
        }

        .score-breakdown {
          display: flex;
          gap: 24px;
        }

        .breakdown-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .breakdown-label {
          font-size: 14px;
          opacity: 0.9;
        }

        .breakdown-value {
          font-size: 24px;
          font-weight: bold;
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
        .stat-card.red { border-left: 4px solid #ef4444; }
        .stat-card.blue { border-left: 4px solid #3b82f6; }

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

        .compliance-categories,
        .category-details,
        .upcoming-deadlines {
          background: white;
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .compliance-categories h3,
        .category-details h3,
        .upcoming-deadlines h3 {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #1f2937;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .category-card {
          background: #f9fafb;
          padding: 20px;
          border-radius: 12px;
          border: 2px solid #e5e7eb;
          cursor: pointer;
          transition: all 0.2s;
        }

        .category-card:hover,
        .category-card.selected {
          border-color: #667eea;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .category-icon {
          font-size: 32px;
        }

        .category-status {
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
        }

        .category-card h4 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #1f2937;
        }

        .category-progress {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981 0%, #059669 100%);
          transition: width 0.3s;
        }

        .progress-text {
          font-size: 14px;
          font-weight: 600;
          color: #059669;
        }

        .category-stats {
          font-size: 13px;
          color: #6b7280;
        }

        .requirements-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .requirement-card {
          background: #f9fafb;
          padding: 20px;
          border-radius: 12px;
          border-left: 4px solid #e5e7eb;
        }

        .requirement-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .requirement-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .requirement-status {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        }

        .requirement-title h4 {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .priority-badge {
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }

        .priority-badge.high {
          background: #fee2e2;
          color: #991b1b;
        }

        .priority-badge.medium {
          background: #fef3c7;
          color: #92400e;
        }

        .priority-badge.low {
          background: #d1fae5;
          color: #065f46;
        }

        .requirement-description {
          color: #4b5563;
          margin-bottom: 12px;
          line-height: 1.5;
        }

        .requirement-meta {
          display: flex;
          gap: 24px;
          margin-bottom: 12px;
        }

        .meta-item {
          display: flex;
          gap: 8px;
          font-size: 13px;
        }

        .meta-label {
          color: #6b7280;
        }

        .meta-value {
          font-weight: 600;
          color: #1f2937;
        }

        .requirement-documents {
          margin-bottom: 12px;
        }

        .documents-label {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .document-item {
          display: block;
          font-size: 12px;
          color: #4b5563;
          margin-bottom: 4px;
        }

        .requirement-actions {
          display: flex;
          gap: 12px;
        }

        .requirement-actions button {
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
        }

        .btn-upload {
          background: #667eea;
          color: white;
        }

        .btn-resolve {
          background: #f59e0b;
          color: white;
        }

        .btn-view-details {
          background: #f3f4f6;
          color: #1f2937;
        }

        .deadlines-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .deadline-item {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          background: #f9fafb;
          border-radius: 12px;
          border-left: 4px solid #667eea;
        }

        .deadline-date {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 70px;
          height: 70px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .date-day {
          font-size: 28px;
          font-weight: bold;
          color: #1f2937;
        }

        .date-month {
          font-size: 14px;
          color: #6b7280;
          text-transform: uppercase;
        }

        .deadline-content {
          flex: 1;
        }

        .deadline-content h4 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 4px;
          color: #1f2937;
        }

        .deadline-content p {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .deadline-urgency {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }

        .deadline-urgency.high {
          background: #fee2e2;
          color: #991b1b;
        }

        .deadline-urgency.medium {
          background: #fef3c7;
          color: #92400e;
        }

        .deadline-urgency.low {
          background: #d1fae5;
          color: #065f46;
        }

        .btn-action {
          background: #667eea;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          white-space: nowrap;
        }

        .loading {
          text-align: center;
          padding: 60px;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}
