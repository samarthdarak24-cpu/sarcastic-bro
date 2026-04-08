'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Failed to load Cluster Map</h2>
        <p className="text-slate-600 mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
