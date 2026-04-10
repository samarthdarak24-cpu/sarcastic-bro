/**
 * N8N Chat Configuration
 * Configure your n8n webhook URL and chat appearance here
 */

export const n8nConfig = {
  // Required: Your n8n webhook URL
  // Format: https://your-n8n-instance.com/webhook/your-webhook-id
  webhookUrl: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '',

  // Chat appearance
  label: 'AgriVoice AI Assistant',
  description: 'Get instant help with your agricultural needs',
  openOnStart: false,

  // Color scheme (optional)
  colors: {
    primaryColor: '#10b981', // Emerald green for agriculture theme
    secondaryColor: '#64748b',
    backgroundColor: '#f8fafc',
    textColor: '#1e293b',
    accentColor: '#059669',
    surfaceColor: '#ffffff',
    borderColor: '#e2e8f0',
    successColor: '#16a34a',
    warningColor: '#f59e0b',
    errorColor: '#dc2626',
  },
};

export type N8nConfig = typeof n8nConfig;
