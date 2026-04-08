'use client';

import { useEffect, useState } from 'react';
import { N8nChatWidget } from './N8nChatWidget';

/**
 * ChatIntegration Component
 * 
 * This component integrates the n8n embedded chat interface into your application.
 * 
 * Usage:
 * - Add <ChatIntegration /> to any page or layout
 * - Set NEXT_PUBLIC_N8N_WEBHOOK_URL in your .env.local file
 * 
 * Example .env.local:
 * NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:3001/api/n8n/chat
 */
export function ChatIntegration() {
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Get webhook URL from environment variable at runtime
    const url = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '';
    setWebhookUrl(url);
    
    if (!url) {
      console.warn(
        'N8N Chat Widget: NEXT_PUBLIC_N8N_WEBHOOK_URL is not configured. ' +
        'Please set it in your .env.local file.'
      );
    }
  }, []);

  // Don't render until client-side and webhook URL is available
  if (!isClient || !webhookUrl) {
    return null;
  }

  return (
    <N8nChatWidget
      label="AgriVoice AI Assistant"
      description="Get instant help with your agricultural needs"
      hostname={webhookUrl}
      openOnStart={false}
      primaryColor="#10b981"
      secondaryColor="#64748b"
      backgroundColor="#f8fafc"
      textColor="#1e293b"
      accentColor="#059669"
      surfaceColor="#ffffff"
      borderColor="#e2e8f0"
      successColor="#16a34a"
      warningColor="#f59e0b"
      errorColor="#dc2626"
    />
  );
}
