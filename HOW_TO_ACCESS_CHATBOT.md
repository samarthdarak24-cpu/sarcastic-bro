# 🤖 How to Access Your Ollama Qwen Chatbot

## 🎯 Quick Access Guide

### Option 1: Dedicated Chat Page (Recommended)

**URL**: http://localhost:3000/ollama-chat

This is a full-featured chat interface with:
- ✅ Real-time streaming responses
- ✅ Quick action buttons
- ✅ Model selection
- ✅ Conversation history
- ✅ Multi-language support
- ✅ Setup instructions (if Ollama not installed)

**Perfect for**: Testing, demos, and standalone chat sessions

---

### Option 2: Farmer Dashboard Integration

**URL**: http://localhost:3000/farmer/dashboard

The chatbot can be integrated into the farmer dashboard:

```tsx
// In your farmer dashboard component
import OllamaChat from '@/components/ui/OllamaChat/OllamaChat';

function FarmerDashboard() {
  const userContext = {
    userId: user.id,
    role: 'FARMER',
    location: user.location,
    crops: user.crops,
    language: user.language || 'en',
    sessionId: `farmer_${user.id}_${Date.now()}`
  };

  return (
    <div className="dashboard">
      {/* Other dashboard components */}
      
      <div className="chat-section">
        <OllamaChat userContext={userContext} />
      </div>
    </div>
  );
}
```

**Perfect for**: Contextual help while managing farm operations

---

### Option 3: Buyer Dashboard Integration

**URL**: http://localhost:3000/buyer/dashboard

Similar integration for buyers:

```tsx
// In your buyer dashboard component
import OllamaChat from '@/components/ui/OllamaChat/OllamaChat';

function BuyerDashboard() {
  const userContext = {
    userId: user.id,
    role: 'BUYER',
    location: user.location,
    language: user.language || 'en',
    sessionId: `buyer_${user.id}_${Date.now()}`
  };

  return (
    <div className="dashboard">
      {/* Other dashboard components */}
      
      <div className="chat-section">
        <OllamaChat userContext={userContext} />
      </div>
    </div>
  );
}
```

**Perfect for**: Procurement assistance and supplier search

---

### Option 4: Floating Chat Widget

Add a floating chat button anywhere in your app:

```tsx
'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import OllamaChat from '@/components/ui/OllamaChat/OllamaChat';

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  
  const userContext = {
    userId: 'user123',
    role: 'FARMER',
    location: 'Maharashtra',
    language: 'en',
    sessionId: `floating_${Date.now()}`
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all z-50"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl z-50">
          <OllamaChat 
            userContext={userContext}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
    </>
  );
}
```

**Perfect for**: Always-available help across all pages

---

## 🚀 Step-by-Step Access

### Step 1: Ensure Services are Running

```bash
# Terminal 1 - Check Ollama
ollama list
# Should show qwen2.5:latest

# Terminal 2 - Start AI Service
cd apps/ai-service
python -m uvicorn app.main:app --reload --port 8000

# Terminal 3 - Start API Backend
cd apps/api
npm run dev

# Terminal 4 - Start Web Frontend
cd apps/web
npm run dev
```

### Step 2: Verify Health

Open these URLs in your browser:

1. **Ollama**: http://localhost:11434/api/tags
   - Should show list of models

2. **AI Service**: http://localhost:8000/ollama/health
   - Should show: `{"status": "healthy", "ollama_available": true}`

3. **API Backend**: http://localhost:3001/ollama-chat/health
   - Should show: `{"success": true, "data": {...}}`

### Step 3: Open Chat Interface

Navigate to: **http://localhost:3000/ollama-chat**

You should see:
- ✅ Green "Connected" indicator
- ✅ Welcome message from AI
- ✅ Quick action buttons
- ✅ Input field ready for messages

### Step 4: Start Chatting!

Try these example queries:

**For Farmers**:
- "What crops should I grow this season?"
- "Current market prices in Maharashtra"
- "How to control pests in wheat?"
- "Weather forecast for farming"
- "Government schemes for farmers"

**For Buyers**:
- "Find reliable wheat suppliers"
- "Compare rice prices across regions"
- "Quality standards for organic produce"
- "Bulk purchase opportunities"
- "Market trends for vegetables"

---

## 🎨 UI Features Guide

### Chat Interface Elements

```
┌─────────────────────────────────────────────────┐
│  🤖 AgriConnect AI        Connected • Local AI  │  ← Header
│  ⚙️ 🔄 ✕                                        │  ← Controls
├─────────────────────────────────────────────────┤
│  [Quick Actions]                                │  ← Quick Actions
│  • What crops should I grow?                    │
│  • Current market prices                        │
├─────────────────────────────────────────────────┤
│                                                  │
│  🤖 Hello! I'm your agricultural assistant...   │  ← AI Message
│                                                  │
│  👤 What crops should I grow?                   │  ← User Message
│                                                  │
│  🤖 Based on your location in Maharashtra...    │  ← AI Response
│                                                  │
├─────────────────────────────────────────────────┤
│  [Suggestions]                                  │  ← Suggestions
│  • Check soil health                            │
│  • View market prices                           │
├─────────────────────────────────────────────────┤
│  [Type your message here...]          [Send]    │  ← Input
└─────────────────────────────────────────────────┘
```

### Settings Panel

Click the ⚙️ icon to access:
- **Model Selection**: Choose from available models
- **Temperature**: Adjust response creativity
- **Language**: Select preferred language

### Quick Actions

Pre-defined queries based on your role:
- **Farmers**: Crop advice, prices, pest control
- **Buyers**: Supplier search, quality checks, market analysis

### Suggestions

Context-aware follow-up questions:
- Generated based on your last query
- Relevant to your role and location
- One-click to ask

---

## 📱 Mobile Access

The chat interface is responsive and works on mobile devices:

```
Mobile View:
┌─────────────────┐
│ 🤖 AgriConnect  │
│ Connected       │
├─────────────────┤
│                 │
│ [Messages]      │
│                 │
│                 │
│                 │
├─────────────────┤
│ [Input] [Send]  │
└─────────────────┘
```

Access from mobile browser:
- Same URL: http://localhost:3000/ollama-chat
- Or use your local IP: http://192.168.x.x:3000/ollama-chat

---

## 🔗 Direct API Access

### Using cURL

```bash
# Complete response
curl -X POST http://localhost:3001/ollama-chat/complete \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "message": "What crops should I grow?",
    "context": {
      "userId": "user123",
      "role": "FARMER",
      "location": "Maharashtra",
      "language": "en",
      "sessionId": "session123"
    }
  }'
```

### Using JavaScript

```javascript
// Complete response
const response = await fetch('/ollama-chat/complete', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    message: 'What crops should I grow?',
    context: {
      userId: 'user123',
      role: 'FARMER',
      location: 'Maharashtra',
      language: 'en',
      sessionId: 'session123'
    }
  })
});

const data = await response.json();
console.log(data.data.response);
```

### Using Python

```python
import requests

url = "http://localhost:3001/ollama-chat/complete"
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {token}"
}
data = {
    "message": "What crops should I grow?",
    "context": {
        "userId": "user123",
        "role": "FARMER",
        "location": "Maharashtra",
        "language": "en",
        "sessionId": "session123"
    }
}

response = requests.post(url, json=data, headers=headers)
print(response.json()["data"]["response"])
```

---

## 🎯 Use Cases

### 1. Crop Planning
```
User: "What crops should I grow in Maharashtra this season?"
AI: "Based on your location in Maharashtra and the current season..."
```

### 2. Market Prices
```
User: "Current wheat prices in my area"
AI: "Here are the current wheat prices in Maharashtra..."
```

### 3. Pest Control
```
User: "How to control aphids in my tomato crop?"
AI: "For aphid control in tomatoes, here are effective methods..."
```

### 4. Supplier Search
```
User: "Find organic rice suppliers in Punjab"
AI: "Here are reliable organic rice suppliers in Punjab..."
```

### 5. Quality Standards
```
User: "What are the quality standards for export-grade mangoes?"
AI: "Export-grade mangoes must meet these quality standards..."
```

---

## 🔍 Troubleshooting Access

### Can't Access Chat Page

**Check**:
1. Web frontend is running: http://localhost:3000
2. No port conflicts
3. Browser console for errors

**Solution**:
```bash
cd apps/web
npm run dev
```

### Chat Shows "Disconnected"

**Check**:
1. Ollama is running: `ollama list`
2. AI service is running: http://localhost:8000/health
3. API backend is running: http://localhost:3001/health

**Solution**:
```bash
# Start Ollama
ollama serve

# Start AI service
cd apps/ai-service
python -m uvicorn app.main:app --reload --port 8000

# Start API backend
cd apps/api
npm run dev
```

### "Model not found" Error

**Check**:
```bash
ollama list
```

**Solution**:
```bash
ollama pull qwen2.5:latest
```

### Authentication Error

**Check**:
- You're logged in
- Token is valid
- Token is in localStorage

**Solution**:
```javascript
// Check token in browser console
console.log(localStorage.getItem('token'));

// Login again if needed
```

---

## 📊 Monitoring Access

### Check Active Sessions

```bash
# View AI service logs
# Terminal running AI service

# View API backend logs
# Terminal running API backend

# View browser console
# F12 in browser
```

### Monitor Performance

```bash
# Check Ollama status
curl http://localhost:11434/api/tags

# Check AI service health
curl http://localhost:8000/ollama/health

# Check API backend health
curl http://localhost:3001/ollama-chat/health
```

---

## 🎉 You're Ready!

Your Ollama Qwen chatbot is accessible and ready to use!

**Quick Links**:
- 🌐 Chat Interface: http://localhost:3000/ollama-chat
- 📚 API Docs: http://localhost:8000/docs
- 🏥 Health Check: http://localhost:8000/ollama/health

**Need Help?**:
- Check QUICK_START_OLLAMA.md
- Review OLLAMA_QWEN_SETUP.md
- See OLLAMA_INTEGRATION_SUMMARY.md

Happy chatting! 🚀🌾🤖
