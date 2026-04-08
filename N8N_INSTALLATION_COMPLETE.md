# N8N Embedded Chat Interface - Installation Complete ✅

The n8n embedded chat interface has been successfully installed and integrated into your ODOP Connect project.

## What Was Done

### 1. Repository Cloned
- Cloned `https://github.com/symbiosika/n8n-embedded-chat-interface.git` to `apps/web/n8n-chat/`
- Fixed Tailwind CSS configuration issues
- Built the web component successfully

### 2. Built Files Deployed
- Built output files copied to `apps/web/public/n8n-chat/`
- Files ready to serve as static assets:
  - `index.js` - Main web component (235 KB)
  - `n8n-embedded-chat-interface.css` - Styles (5.5 KB)

### 3. React Integration Components Created
- **N8nChatWidget.tsx** - Low-level wrapper component
- **ChatIntegration.tsx** - High-level integration component with config
- **n8n.ts** - Centralized configuration file

### 4. Documentation Created
- **N8N_CHAT_SETUP.md** - Complete setup and usage guide
- **N8N_INTEGRATION_EXAMPLE.tsx** - Code examples for different use cases
- **.env.n8n.example** - Environment variable template

## Quick Start (3 Steps)

### Step 1: Set Environment Variable
Add to `apps/web/.env.local`:
```env
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
```

### Step 2: Create N8N Workflow
1. In n8n, create a new workflow
2. Add a **Webhook Trigger** node with:
   - HTTP Method: `POST`
   - Response Mode: `Response Node`
3. Add your chat logic (OpenAI, Claude, etc.)
4. Return response in format:
```json
{
  "output": "Your response",
  "sessionId": "session-id"
}
```

### Step 3: Add to Your Page
```tsx
import { ChatIntegration } from '@/components/chat/ChatIntegration';

export default function YourPage() {
  return (
    <div>
      <ChatIntegration />
    </div>
  );
}
```

## File Structure

```
project-root/
├── apps/web/
│   ├── n8n-chat/                    # Source repository
│   │   ├── src/                     # Vue source files
│   │   ├── output/                  # Built files (before copy)
│   │   └── package.json
│   ├── public/n8n-chat/             # ✅ Deployed built files
│   │   ├── index.js
│   │   └── n8n-embedded-chat-interface.css
│   ├── src/
│   │   ├── components/chat/
│   │   │   ├── N8nChatWidget.tsx    # ✅ Created
│   │   │   └── ChatIntegration.tsx  # ✅ Created
│   │   └── config/
│   │       └── n8n.ts              # ✅ Created
│   └── .env.n8n.example            # ✅ Created
├── N8N_CHAT_SETUP.md               # ✅ Created
├── N8N_INTEGRATION_EXAMPLE.tsx     # ✅ Created
└── N8N_INSTALLATION_COMPLETE.md    # ✅ This file
```

## Configuration

### Default Configuration (apps/web/src/config/n8n.ts)
```typescript
export const n8nConfig = {
  webhookUrl: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '',
  label: 'AgriVoice AI Assistant',
  description: 'Get instant help with your agricultural needs',
  openOnStart: false,
  colors: {
    primaryColor: '#10b981',        // Emerald green
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
```

### Customize Colors
Edit `apps/web/src/config/n8n.ts` to change the color scheme. Supports:
- Hex colors: `#2563eb`
- RGB/RGBA: `rgb(37,99,235)`
- HSL/HSLA: `hsl(0,100%,50%)`
- Named colors: `red`, `blue`, etc.

## Integration Points

### Option 1: Global Layout (Recommended)
Add to `apps/web/src/app/layout.tsx` to show chat on all pages:
```tsx
import { ChatIntegration } from '@/components/chat/ChatIntegration';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <ChatIntegration />
      </body>
    </html>
  );
}
```

### Option 2: Specific Pages
Add to individual pages:
```tsx
import { ChatIntegration } from '@/components/chat/ChatIntegration';

export default function FarmerDashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <ChatIntegration />
    </div>
  );
}
```

### Option 3: Custom Styling
Use `N8nChatWidget` directly for full control:
```tsx
import { N8nChatWidget } from '@/components/chat/N8nChatWidget';

export function CustomChat() {
  return (
    <N8nChatWidget
      label="My Bot"
      hostname="https://your-webhook.com"
      primaryColor="#2563eb"
      backgroundColor="#f8fafc"
    />
  );
}
```

## N8N Workflow Setup

### Request Format
The chat widget sends:
```json
{
  "chatInput": "User's message",
  "sessionId": "xxx"  // Present on subsequent messages
}
```

### Response Format
Your workflow must return:
```json
{
  "output": "Your response text",
  "sessionId": "session-id-for-context"
}
```

### Example Workflow Steps
1. **Webhook Trigger** - Receives chat input
2. **AI Node** (OpenAI/Claude) - Processes message
3. **Response Node** - Returns formatted response

## Troubleshooting

### Chat widget not showing?
- ✅ Check `NEXT_PUBLIC_N8N_WEBHOOK_URL` is set in `.env.local`
- ✅ Verify webhook URL is correct and accessible
- ✅ Check browser console for errors
- ✅ Ensure Next.js dev server is running

### Messages not sending?
- ✅ Verify n8n webhook is active
- ✅ Check webhook is set to `POST` method
- ✅ Verify response format matches expected JSON
- ✅ Check n8n workflow logs

### Styling issues?
- ✅ Verify color values are valid CSS
- ✅ Try hex format: `#2563eb`
- ✅ Check browser console for warnings

## Next Steps

1. **Set up your n8n instance** with a webhook workflow
2. **Add the webhook URL** to `.env.local`
3. **Choose integration point** (global layout or specific pages)
4. **Test the chat** in your browser
5. **Customize colors** in `apps/web/src/config/n8n.ts` if needed

## Support & Resources

- [N8N Documentation](https://docs.n8n.io/)
- [N8N Webhook Trigger Docs](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [N8N Embedded Chat GitHub](https://github.com/symbiosika/n8n-embedded-chat-interface)
- [Web Components MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components)

## Files Modified/Created

### Created Files
- ✅ `apps/web/src/components/chat/N8nChatWidget.tsx`
- ✅ `apps/web/src/components/chat/ChatIntegration.tsx`
- ✅ `apps/web/src/config/n8n.ts`
- ✅ `apps/web/.env.n8n.example`
- ✅ `apps/web/public/n8n-chat/index.js`
- ✅ `apps/web/public/n8n-chat/n8n-embedded-chat-interface.css`
- ✅ `N8N_CHAT_SETUP.md`
- ✅ `N8N_INTEGRATION_EXAMPLE.tsx`
- ✅ `N8N_INSTALLATION_COMPLETE.md`

### Modified Files
- ✅ `apps/web/n8n-chat/tailwind.config.ts` - Fixed Tailwind config
- ✅ `apps/web/n8n-chat/src/components/markdown/Renderer.vue` - Fixed dark mode styles

## Ready to Use! 🚀

The n8n embedded chat interface is now fully integrated and ready to use. Start by setting your webhook URL and adding the component to your pages.

For detailed setup instructions, see **N8N_CHAT_SETUP.md**.
For code examples, see **N8N_INTEGRATION_EXAMPLE.tsx**.
