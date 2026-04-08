# N8N Chat Widget - Quick Reference Card

## 🚀 Installation Status: ✅ COMPLETE

The n8n embedded chat interface is fully installed and ready to use.

## ⚡ Quick Setup (2 minutes)

### 1. Add Environment Variable
```bash
# apps/web/.env.local
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
```

### 2. Add to Your Page
```tsx
import { ChatIntegration } from '@/components/chat/ChatIntegration';

export default function Page() {
  return <ChatIntegration />;
}
```

That's it! 🎉

## 📁 Key Files

| File | Purpose |
|------|---------|
| `apps/web/src/components/chat/ChatIntegration.tsx` | Main component to use |
| `apps/web/src/components/chat/N8nChatWidget.tsx` | Low-level wrapper |
| `apps/web/src/config/n8n.ts` | Configuration & colors |
| `apps/web/public/n8n-chat/index.js` | Built web component |
| `N8N_CHAT_SETUP.md` | Full documentation |

## 🎨 Customize Colors

Edit `apps/web/src/config/n8n.ts`:
```typescript
colors: {
  primaryColor: '#10b981',      // Main color
  backgroundColor: '#f8fafc',   // Background
  textColor: '#1e293b',         // Text
  // ... more colors
}
```

## 🔧 N8N Workflow

### Webhook Configuration
- Method: `POST`
- Response Mode: `Response Node`

### Request Body
```json
{
  "chatInput": "User message",
  "sessionId": "xxx"
}
```

### Response Format
```json
{
  "output": "Bot response",
  "sessionId": "session-id"
}
```

## 📍 Where to Add

### Global (All Pages)
```tsx
// apps/web/src/app/layout.tsx
<ChatIntegration />
```

### Specific Page
```tsx
// apps/web/src/app/farmer/dashboard/page.tsx
<ChatIntegration />
```

### Custom Styling
```tsx
import { N8nChatWidget } from '@/components/chat/N8nChatWidget';

<N8nChatWidget
  label="My Bot"
  hostname="https://webhook-url"
  primaryColor="#2563eb"
/>
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Widget not showing | Check `.env.local` has `NEXT_PUBLIC_N8N_WEBHOOK_URL` |
| Messages not sending | Verify n8n webhook is active and returns correct JSON |
| Wrong colors | Verify hex format: `#2563eb` |
| Script not loading | Check `/n8n-chat/index.js` exists in public folder |

## 📚 Documentation

- **Full Setup**: `N8N_CHAT_SETUP.md`
- **Code Examples**: `N8N_INTEGRATION_EXAMPLE.tsx`
- **Installation Details**: `N8N_INSTALLATION_COMPLETE.md`

## 🔗 Resources

- [N8N Docs](https://docs.n8n.io/)
- [GitHub Repo](https://github.com/symbiosika/n8n-embedded-chat-interface)

## ✨ Features

- ✅ Web component (works with any framework)
- ✅ Customizable colors
- ✅ Session management
- ✅ Markdown support
- ✅ Dark mode support
- ✅ Responsive design
- ✅ No external dependencies

## 🎯 Next Steps

1. Set `NEXT_PUBLIC_N8N_WEBHOOK_URL` in `.env.local`
2. Create n8n workflow with webhook trigger
3. Add `<ChatIntegration />` to your page
4. Test in browser
5. Customize colors if needed

---

**Ready to go!** Start by setting your webhook URL. 🚀
