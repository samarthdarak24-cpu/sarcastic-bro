# N8N Embedded Chat Interface Setup Guide

This guide walks you through integrating the n8n embedded chat interface into your ODOP Connect project.

## Quick Start

### 1. Configure Your N8N Webhook URL

Add the following to your `.env.local` file in the `apps/web` directory:

```env
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
```

### 2. Add Chat Widget to Your Page

Import and use the `ChatIntegration` component in any page or layout:

```tsx
import { ChatIntegration } from '@/components/chat/ChatIntegration';

export default function YourPage() {
  return (
    <div>
      {/* Your page content */}
      <ChatIntegration />
    </div>
  );
}
```

### 3. Customize Appearance (Optional)

Edit `apps/web/src/config/n8n.ts` to customize:
- Chat label and description
- Color scheme
- Whether chat opens on page load

```typescript
export const n8nConfig = {
  webhookUrl: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '',
  label: 'Your Custom Label',
  description: 'Your custom description',
  openOnStart: false,
  colors: {
    primaryColor: '#10b981',
    // ... other colors
  },
};
```

## N8N Workflow Setup

### 1. Create a Webhook Trigger

In your n8n workflow:
1. Add a **Webhook Trigger** node
2. Configure it with:
   - HTTP Method: `POST`
   - Response Mode: `Response Node`

### 2. Implement Chat Logic

Add your chat logic between the webhook trigger and response:
- Connect to OpenAI, Claude, or your preferred AI service
- Process the incoming `chatInput`
- Maintain conversation context using `sessionId`

### 3. Format Response

Your workflow must return this JSON format:

```json
{
  "output": "Your chatbot response here",
  "sessionId": "session-id-for-context"
}
```

### 4. Get Your Webhook URL

After creating the workflow:
1. Click the Webhook Trigger node
2. Copy the webhook URL
3. Use it in your `.env.local` file

## Request/Response Format

### Incoming Request Body
```json
{
  "chatInput": "User's message here",
  "sessionId": "xxx" // Present on subsequent messages
}
```

### Expected Response
```json
{
  "output": "Chatbot response",
  "sessionId": "session-id"
}
```

## Advanced Usage

### Using N8nChatWidget Directly

For more control, use the `N8nChatWidget` component directly:

```tsx
import { N8nChatWidget } from '@/components/chat/N8nChatWidget';

export function CustomChat() {
  return (
    <N8nChatWidget
      label="My Custom Bot"
      hostname="https://your-n8n-webhook.com"
      primaryColor="#2563eb"
      backgroundColor="#f8fafc"
      openOnStart={false}
    />
  );
}
```

### Available Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | string | "AI Assistant" | Chat window title |
| `description` | string | "" | Bot description |
| `hostname` | string | "" | **Required**: N8N webhook URL |
| `openOnStart` | boolean | false | Open chat on page load |
| `primaryColor` | string | - | Primary brand color |
| `secondaryColor` | string | - | Secondary accent color |
| `backgroundColor` | string | - | Main background color |
| `textColor` | string | - | Primary text color |
| `accentColor` | string | - | Highlight color |
| `surfaceColor` | string | - | Card background color |
| `borderColor` | string | - | Border color |
| `successColor` | string | - | Success indicator color |
| `warningColor` | string | - | Warning indicator color |
| `errorColor` | string | - | Error indicator color |

## Color Format Support

All color properties support:
- Hex: `#2563eb`, `#f00`
- RGB/RGBA: `rgb(37,99,235)`, `rgba(255,0,0,0.5)`
- HSL/HSLA: `hsl(0,100%,50%)`, `hsla(0,100%,50%,0.5)`
- Named colors: `red`, `blue`, `transparent`

## Example Themes

### Agriculture Green Theme
```typescript
colors: {
  primaryColor: '#10b981',
  secondaryColor: '#059669',
  backgroundColor: '#f0fdf4',
  textColor: '#065f46',
  accentColor: '#047857',
}
```

### Dark Theme
```typescript
colors: {
  primaryColor: '#3b82f6',
  backgroundColor: '#111827',
  textColor: '#f9fafb',
  surfaceColor: '#1f2937',
}
```

## Project Structure

The n8n chat interface has been integrated as follows:

```
apps/web/
├── n8n-chat/                    # Cloned repository (source)
├── public/n8n-chat/             # Built output files
│   ├── index.js                 # Main web component
│   └── n8n-embedded-chat-interface.css
├── src/
│   ├── components/chat/
│   │   ├── N8nChatWidget.tsx    # Low-level wrapper component
│   │   └── ChatIntegration.tsx  # High-level integration component
│   └── config/
│       └── n8n.ts              # Configuration file
└── .env.n8n.example            # Environment template
```

## Troubleshooting

### Chat widget not appearing
- Check that `NEXT_PUBLIC_N8N_WEBHOOK_URL` is set in `.env.local`
- Verify the webhook URL is correct and accessible
- Check browser console for errors
- Ensure the script is loading from `/n8n-chat/index.js`

### Messages not being sent
- Verify your n8n workflow webhook is active
- Check that the webhook is configured with `POST` method
- Ensure response format matches the expected JSON structure
- Check n8n workflow logs for errors

### Styling issues
- Verify color values are valid CSS colors
- Check browser console for color validation warnings
- Try using hex color format if other formats don't work

## Integration Points

The chat widget can be added to:
- Global layout for site-wide availability
- Specific pages (farmer dashboard, buyer dashboard, etc.)
- Modal or drawer components
- Floating action button

Example: Add to global layout for all pages:

```tsx
// apps/web/src/app/layout.tsx
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

## Building and Deployment

### Local Development
The n8n chat widget is already built and available in `apps/web/public/n8n-chat/`. No additional build steps needed.

### Production Deployment
1. The built files in `apps/web/public/n8n-chat/` will be served as static assets
2. Ensure your production environment has `NEXT_PUBLIC_N8N_WEBHOOK_URL` set
3. The webhook URL should point to your production n8n instance

### Updating the Widget
If you need to update the n8n chat widget:

```bash
cd apps/web/n8n-chat
npm install
npm run build
# Files are automatically copied to public/n8n-chat/
```

## Resources

- [N8N Documentation](https://docs.n8n.io/)
- [N8N Webhook Trigger](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [N8N Embedded Chat GitHub](https://github.com/symbiosika/n8n-embedded-chat-interface)
- [Web Components Documentation](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
