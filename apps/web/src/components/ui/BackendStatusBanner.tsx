'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';

export default function BackendStatusBanner() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      await axios.get(`${API_URL}/health`, { timeout: 3000 });
      setStatus('online');
      setShowBanner(false);
    } catch (error) {
      setStatus('offline');
      setShowBanner(!USE_MOCK);
    }
  };

  if (!showBanner || status === 'checking') {
    return null;
  }

  if (status === 'offline') {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm text-yellow-700 font-medium">
              Backend API is not running - Using mock authentication
            </p>
            <p className="mt-1 text-xs text-yellow-600">
              To use real database authentication, start the backend server:
            </p>
            <div className="mt-2 bg-yellow-100 rounded px-3 py-2">
              <code className="text-xs text-yellow-800">
                cd apps/api && npm run dev
              </code>
            </div>
            <p className="mt-2 text-xs text-yellow-600">
              Or double-click: <span className="font-semibold">start-backend.bat</span>
            </p>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="ml-3 flex-shrink-0"
          >
            <XCircle className="h-5 w-5 text-yellow-400 hover:text-yellow-600" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border-l-4 border-green-400 p-4">
      <div className="flex items-center">
        <CheckCircle className="h-5 w-5 text-green-400" />
        <p className="ml-3 text-sm text-green-700 font-medium">
          Connected to backend API - Using database authentication
        </p>
        <button
          onClick={() => setShowBanner(false)}
          className="ml-auto"
        >
          <XCircle className="h-5 w-5 text-green-400 hover:text-green-600" />
        </button>
      </div>
    </div>
  );
}
