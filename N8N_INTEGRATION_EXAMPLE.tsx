/**
 * N8N Chat Integration Examples
 * 
 * Copy these examples into your pages to integrate the n8n chat widget
 */

// Example 1: Add to a page
import { ChatIntegration } from '@/components/chat/ChatIntegration';

export default function FarmerDashboard() {
  return (
    <div>
      {/* Your dashboard content */}
      <h1>Farmer Dashboard</h1>
      
      {/* Add the chat widget */}
      <ChatIntegration />
    </div>
  );
}

// Example 2: Add to global layout (appears on all pages)
// File: apps/web/src/app/layout.tsx
import { ChatIntegration } from '@/components/chat/ChatIntegration';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <ChatIntegration />
      </body>
    </html>
  );
}

// Example 3: Custom styling with N8nChatWidget directly
import { N8nChatWidget } from '@/components/chat/N8nChatWidget';

export function CustomChatPage() {
  return (
    <N8nChatWidget
      label="AgriVoice Support"
      description="Get help with your farming operations"
      hostname="https://your-n8n-instance.com/webhook/your-webhook-id"
      primaryColor="#10b981"
      backgroundColor="#f0fdf4"
      textColor="#065f46"
      openOnStart={false}
    />
  );
}

// Example 4: Conditional rendering
import { ChatIntegration } from '@/components/chat/ChatIntegration';
import { useAuth } from '@/hooks/useAuth';

export function ConditionalChat() {
  const { user } = useAuth();

  // Only show chat for authenticated users
  if (!user) return null;

  return <ChatIntegration />;
}

// Example 5: In a modal or drawer
import { ChatIntegration } from '@/components/chat/ChatIntegration';
import { useState } from 'react';

export function ChatModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Open Chat
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-96 h-96 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-500"
            >
              ✕
            </button>
            <ChatIntegration />
          </div>
        </div>
      )}
    </>
  );
}
