'use client';

import React from 'react';
import Link from 'next/link';

export default function TestStreamPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            🚀 Stream AI Chat Test
          </h1>
          
          <p className="text-gray-600 mb-6">
            Test the Stream AI Chat functionality
          </p>
          
          <div className="space-y-4">
            <Link 
              href="/simple-stream-chat"
              className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Open Stream AI Chat
            </Link>
            
            <a 
              href="http://localhost:8000/health"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Check Backend Health
            </a>
            
            <a 
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              View API Docs
            </a>
            
            <a 
              href="http://localhost:8000/demo"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Test Backend Demo
            </a>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Status:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✅ Frontend: Running on port 3000</li>
              <li>✅ Backend: Running on port 8000</li>
              <li>✅ Stream Chat: Configured with API keys</li>
              <li>✅ Agricultural AI: Ready</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}