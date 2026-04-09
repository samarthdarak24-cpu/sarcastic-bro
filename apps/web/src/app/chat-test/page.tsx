'use client';

import { useEffect, useState } from 'react';

export default function ChatTestPage() {
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const url = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '';
    setWebhookUrl(url);
    console.log('Webhook URL:', url);

    // Load the n8n chat script
    const script = document.createElement("script");
    script.src = '/n8n-chat/index.js';
    script.async = true;
    script.onload = () => {
      console.log('N8N chat script loaded');
    };
    script.onerror = () => {
      console.error('Failed to load N8N chat script');
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Chat Widget Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          <div className="space-y-2">
            <p><strong>Webhook URL:</strong> {webhookUrl || 'Not configured'}</p>
            <p><strong>Script Location:</strong> /n8n-chat/index.js</p>
            <p><strong>Status:</strong> {webhookUrl ? '✅ Ready' : '❌ Not configured'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Chat Widget</h2>
          <p className="text-gray-600 mb-4">The chat widget should appear below:</p>
          
          {webhookUrl && (
            <div
              dangerouslySetInnerHTML={{
                __html: `<n8n-embedded-chat-interface 
                  label="AgriVoice AI Assistant"
                  description="Get instant help with your agricultural needs"
                  hostname="${webhookUrl}"
                  open-on-start="false"
                  primary-color="#10b981"
                  secondary-color="#64748b"
                  background-color="#f8fafc"
                  text-color="#1e293b"
                  accent-color="#059669"
                  surface-color="#ffffff"
                  border-color="#e2e8f0"
                  success-color="#16a34a"
                  warning-color="#f59e0b"
                  error-color="#dc2626">
                </n8n-embedded-chat-interface>`,
              }}
            />
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Test Messages</h3>
          <ul className="text-blue-800 space-y-1">
            <li>• "Tell me about crop management"</li>
            <li>• "What's the weather forecast?"</li>
            <li>• "How do I check market prices?"</li>
            <li>• "Help with pest control"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
