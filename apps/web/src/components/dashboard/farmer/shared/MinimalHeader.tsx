'use client';

import React from 'react';

interface MinimalHeaderProps {
  title: string;
  loading?: boolean;
}

export function MinimalHeader({ title, loading = false }: MinimalHeaderProps) {
  return (
    <div className="minimal-header">
      <h2 className="feature-title">{title}</h2>
      {loading && <span className="loading-text">Loading...</span>}
      
      <style jsx>{`
        .minimal-header {
          padding: 16px 24px;
          border-bottom: 1px solid #e5e7eb;
          background: white;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .feature-title {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .loading-text {
          font-size: 12px;
          color: #9ca3af;
          font-style: italic;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
