'use client';

import React, { useState, useEffect } from 'react';
import { SubfeaturePage } from '@/components/buyer/SubfeaturePage';
import { buyerFeatureService } from '@/services/buyerFeatureService';

export default function SecurityPage() {
  const [securityData, setSecurityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        setLoading(true);
        const data = await buyerFeatureService.security.getAccountSecurity();
        setSecurityData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load security data');
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityData();
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
  };

  return (
    <SubfeaturePage
      title="Security System"
      description="Account and transaction security management"
      backLink="/buyer/dashboard"
      loading={loading}
      error={error}
      onRetry={handleRetry}
    >
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        {securityData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Security Level</p>
                <p className="text-white font-semibold">{securityData.level || 'High'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">2FA Enabled</p>
                <p className="text-white font-semibold">{securityData.twoFAEnabled ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Last Login</p>
                <p className="text-white font-semibold">{securityData.lastLogin || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Active Sessions</p>
                <p className="text-white font-semibold">{securityData.activeSessions || 0}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-400">No security data available</p>
        )}
      </div>
    </SubfeaturePage>
  );
}
