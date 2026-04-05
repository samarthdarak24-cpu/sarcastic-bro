'use client';

import React from 'react';

interface FeatureWrapperProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper component that applies unified dashboard styling to any feature
 * This ensures consistent styling across all dashboard features
 */
export function FeatureWrapper({ children, className = '' }: FeatureWrapperProps) {
  return (
    <div className={`feature-container ${className}`}>
      {children}
    </div>
  );
}

export default FeatureWrapper;
