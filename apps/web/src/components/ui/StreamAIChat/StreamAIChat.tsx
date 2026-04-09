"use client";

import React from "react";

interface StreamAIChatProps {
  userId: string;
  userName: string;
  userRole: string;
  className?: string;
}

export default function StreamAIChat({ userId, userName, userRole, className }: StreamAIChatProps) {
  return (
    <div className={`flex flex-col items-center justify-center h-full bg-gradient-to-br from-green-50 to-purple-50 ${className || ""}`}>
      <div className="text-center space-y-4 p-8">
        <div className="text-6xl">🌾</div>
        <h2 className="text-2xl font-bold text-gray-800">Stream AI Agents</h2>
        <p className="text-gray-500 max-w-md">
          The GetStream AI agent service is not yet connected. Please configure the Stream backend to enable multi-agent chat.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          Service Offline
        </div>
      </div>
    </div>
  );
}
