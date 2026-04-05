'use client';

import React, { useState, useEffect } from 'react';

interface TrustScore {
  overall: number;
  delivery: number;
  quality: number;
  communication: number;
  reviews: number;
}

interface Review {
  id: string;
  buyer: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export default function TrustIdentity() {
  const [trustScore, setTrustScore] = useState<TrustScore | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrustData();
  }, [filter]);

  const loadTrustData = async () => {
    setLoading(true);
    setTimeout(() => {
      setTrustScore({
        overall: 4.8,
        delivery: 4.9,
        quality: 4.7,
        communication: 4.8,
        reviews: 156
      });
      setReviews([
        { id: '1', buyer: 'Rajesh Kumar', rating: 5, comment: 'Excellent quality products!', date: '2024-01-15', verified: true },
        { id: '2', buyer: 'Priya Sharma', rating: 4, comment: 'Good service, timely delivery', date: '2024-01-14', verified: true },
        { id: '3', buyer: 'Amit Patel', rating: 5, comment: 'Very satisfied with the quality', date: '2024-01-13', verified: false },
        { id: '4', buyer: 'Sunita Devi', rating: 4, comment: 'Fresh products, will order again', date: '2024-01-12', verified: true },
      ]);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="trust-identity">
      <div className="header-section">
        <h2 className="text-2xl font-bold text-gray-800">Trust & Identity</h2>
        <button className="btn-primary">
          + Request Verification
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-green-100">⭐</div>
          <div className="stat-content">
            <p className="stat-label">Overall Rating</p>
            <p className="stat-value">{trustScore?.overall || 0}/5</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-blue-100">📦</div>
          <div className="stat-content">
            <p className="stat-label">Delivery Score</p>
            <p className="stat-value">{trustScore?.delivery || 0}/5</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-purple-100">✨</div>
          <div className="stat-content">
            <p className="stat-label">Quality Score</p>
            <p className="stat-value">{trustScore?.quality || 0}/5</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-orange-100">💬</div>
          <div className="stat-content">
            <p className="stat-label">Total Reviews</p>
            <p className="stat-value">{trustScore?.reviews || 0}</p>
          </div>
        </div>
      </div>

      <div className="filter-tabs">
        {['all', 'verified', 'recent', 'top_rated'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`filter-tab ${filter === tab ? 'active' : ''}`}
          >
            {tab.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      <div className="reviews-grid">
        {loading ? (
          <div className="loading-state">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="empty-state">
            <p>No reviews yet</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="buyer-info">
                  <h4>{review.buyer}</h4>
                  {review.verified && <span className="verified-badge">✓ Verified</span>}
                </div>
                <div className="rating">
                  {'⭐'.repeat(review.rating)}
                </div>
              </div>
              <p className="review-comment">{review.comment}</p>
              <p className="review-date">{new Date(review.date).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .trust-identity {
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

        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .review-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }

        .review-card:hover {
          transform: translateY(-4px);
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .buyer-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .buyer-info h4 {
          font-weight: 600;
          color: #1f2937;
        }

        .verified-badge {
          font-size: 12px;
          color: #059669;
          font-weight: 600;
        }

        .rating {
          font-size: 18px;
        }

        .review-comment {
          color: #4b5563;
          line-height: 1.6;
          margin-bottom: 12px;
        }

        .review-date {
          font-size: 12px;
          color: #9ca3af;
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
