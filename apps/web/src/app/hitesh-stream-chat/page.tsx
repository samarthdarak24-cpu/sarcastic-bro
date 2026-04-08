'use client';

import React from 'react';
import HiteshStreamChat from '@/components/ui/HiteshStreamChat/HiteshStreamChat';

export default function HiteshStreamChatPage() {
  // Demo user data
  const userId = "farmer_hitesh_demo";
  const userName = "Hitesh Demo Farmer";
  const userRole = "farmer";
  const location = "Maharashtra, India";
  const crops = ["wheat", "rice", "cotton", "sugarcane"];
  const farmSize = "15 acres";

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Hitesh-style Stream AI Chat
              </h1>
              <p className="text-sm text-gray-600">
                Based on hiteshchoudhary/ai-chat-app-with-agents-getstream
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">{location} • {farmSize}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          <HiteshStreamChat
            userId={userId}
            userName={userName}
            userRole={userRole}
            location={location}
            crops={crops}
            farmSize={farmSize}
            className="h-full"
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">How to Use:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Click "Start" on any AI agent to activate it</li>
            <li>• Ask agricultural questions in the chat</li>
            <li>• Agents provide specialized advice based on their expertise</li>
            <li>• Multiple agents can be active simultaneously</li>
            <li>• Click "Stop" to deactivate an agent</li>
          </ul>
        </div>
      </div>
    </div>
  );
}