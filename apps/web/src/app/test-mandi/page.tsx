'use client';

import { LivePriceTicker } from '@/components/ui/LivePriceTicker';

export default function TestMandiPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-center py-8">Live Mandi Ticker Test</h1>
      
      {/* Test the ticker standalone */}
      <div className="mb-8">
        <LivePriceTicker />
      </div>

      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Test Status</h2>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span>If you see the green "LIVE MANDI" bar above, the ticker is working!</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span>Prices should be scrolling from right to left</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
            <span>Prices update every 8 seconds with flash animations</span>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">Troubleshooting:</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Open browser console (F12) to check for errors</li>
            <li>Make sure you're running: <code className="bg-gray-200 px-2 py-1 rounded">npm run dev</code></li>
            <li>Check if RealtimeProvider is working in console logs</li>
            <li>Try refreshing the page (Ctrl+R or Cmd+R)</li>
          </ul>
        </div>

        <div className="mt-6">
          <a 
            href="/farmer/dashboard" 
            className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            Go to Farmer Dashboard
          </a>
          <a 
            href="/buyer/dashboard" 
            className="inline-block ml-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Buyer Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
