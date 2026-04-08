# Stream AI Chat with Agricultural Agents

A modern AI-powered chat application built with GetStream, OpenAI, and specialized agricultural agents. Similar to hiteshchoudhary's implementation but tailored for agricultural use cases.

## 🚀 Features

### Core Capabilities
- **Real-time Chat**: Powered by GetStream.io for seamless messaging
- **AI Agricultural Agents**: Specialized experts for different farming needs
- **Knowledge Base Integration**: Comprehensive agricultural information
- **Agent Management**: Dynamic agent lifecycle with auto-cleanup
- **Modern UI**: Beautiful React interface with Stream Chat components
- **Multi-Agent Support**: Run multiple specialized agents simultaneously

### Agricultural Agents
- 🌱 **Crop Advisor**: Expert in crop selection, planting, and cultivation
- 📈 **Market Analyst**: Specialist in market trends and pricing
- 🐛 **Pest & Disease Expert**: Expert in pest control and disease management
- 🧪 **Soil Scientist**: Specialist in soil health and fertility
- 🧠 **General Advisor**: All-round agricultural consultant

## 🏗️ Architecture

### Backend Components
```
apps/ai-service/
├── app/services/stream_chat_service.py     # Main Stream Chat service
├── app/services/agricultural_knowledge.py  # Knowledge base
├── app/routers/stream_chat_router.py       # FastAPI endpoints
└── requirements_stream.txt                 # Dependencies
```

### Frontend Components
```
apps/web/src/
├── components/ui/StreamAIChat/             # React chat component
├── app/stream-chat/page.tsx                # Demo page
└── services/streamChatService.ts           # API service
```

### API Integration
```
apps/api/src/modules/ai/
├── stream-chat.controller.ts               # Express controller
└── stream-chat.routes.ts                   # API routes
```

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
# Run the setup script
setup-stream-chat.bat

# Or manually install
cd apps/ai-service
pip install -r requirements_stream.txt

cd ../web
npm install stream-chat stream-chat-react
```

### 2. Get API Keys

#### GetStream.io Setup
1. Sign up at [GetStream.io](https://getstream.io/dashboard)
2. Create a new Chat application
3. Copy your API Key and API Secret

#### OpenAI API Setup
1. Sign up at [OpenAI Platform](https://platform.openai.com)
2. Navigate to API Keys section
3. Create a new API key

### 3. Configure Environment Variables

#### Backend (.env in apps/ai-service)
```bash
STREAM_API_KEY=your_stream_api_key_here
STREAM_API_SECRET=your_stream_api_secret_here
OPENAI_API_KEY=your_openai_api_key_here
```

#### Frontend (.env.local in apps/web)
```bash
NEXT_PUBLIC_STREAM_API_KEY=your_stream_api_key_here
```

### 4. Start Services
```bash
# AI Service
cd apps/ai-service && python -m app.main

# API Service
cd apps/api && npm run dev

# Frontend
cd apps/web && npm run dev
```

### 5. Access the Application
- **Demo Page**: http://localhost:3000/stream-chat
- **API Docs**: http://localhost:8000/docs#/Stream%20AI%20Chat
- **Health Check**: http://localhost:8000/stream-chat/health

## 📡 API Endpoints

### Authentication
```http
POST /stream-chat/token
```

### User Management
```http
POST /stream-chat/users
```

### Channel Management
```http
POST /stream-chat/channels
```

### Agent Management
```http
POST /stream-chat/agents/start
POST /stream-chat/agents/stop
POST /stream-chat/agents/message
GET /stream-chat/agents/status/{channel_id}
GET /stream-chat/agents/types
```

### Utilities
```http
GET /stream-chat/health
GET /stream-chat/demo
GET /stream-chat/stats
```

## 💬 Usage Examples

### Starting an Agent
```javascript
const response = await fetch('/api/stream-chat/agents/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    channel_id: 'agricultural_chat_123',
    agent_type: 'crop_advisor',
    user_id: 'farmer_123'
  })
});
```

### Processing Messages
```javascript
const response = await fetch('/api/stream-chat/agents/message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    channel_id: 'agricultural_chat_123',
    message: 'What is the best time to plant wheat?',
    user_context: {
      location: 'Maharashtra, India',
      farm_size: '5 acres'
    }
  })
});
```

## 🧠 Agricultural Knowledge Base

The system includes comprehensive agricultural knowledge covering:

### Categories
- **Crop Cultivation**: Planting, growing, and harvesting techniques
- **Pest Management**: IPM strategies and treatment options
- **Soil Management**: Testing, fertility, and health improvement
- **Market Analysis**: Pricing trends and selling strategies
- **Irrigation**: Water management and conservation
- **Organic Farming**: Sustainable and organic practices
- **Climate Smart**: Adaptation and resilience strategies
- **Precision Agriculture**: Technology-driven farming
- **Integrated Farming**: Livestock and crop integration

### Knowledge Search
The knowledge base supports intelligent search with:
- Keyword matching
- Content relevance scoring
- Category-based filtering
- Crop-specific information
- Contextual recommendations

## 🎨 UI Components

### Stream Chat Integration
- **Real-time messaging** with Stream Chat React components
- **Custom message rendering** for AI agent responses
- **Agent status indicators** showing active/inactive states
- **Specialized agent cards** with descriptions and specialties
- **Source attribution** for AI responses

### Agent Management Panel
- **Available agents list** with descriptions
- **Active agents display** with stop controls
- **Agent specialties** and capabilities
- **Start/stop controls** for each agent type

## 🔧 Agent Lifecycle Management

### Automatic Features
- **Agent Creation**: On-demand agent instantiation
- **Activity Tracking**: Monitor agent usage and responses
- **Auto Cleanup**: Remove inactive agents after timeout
- **Resource Management**: Efficient memory and processing usage
- **Error Handling**: Graceful failure recovery

### Manual Controls
- **Start Agent**: Activate specific agent types
- **Stop Agent**: Deactivate agents when done
- **Status Check**: Monitor agent health and activity
- **Message Processing**: Route messages to active agents

## 🧪 Testing

### Run Tests
```bash
# Test all endpoints
test-stream-chat.bat

# Manual testing
curl -X GET "http://localhost:8000/stream-chat/health"
curl -X GET "http://localhost:8000/stream-chat/demo"
```

### Health Checks
```bash
# Service health
GET /stream-chat/health

# Agent status
GET /stream-chat/agents/status/{channel_id}

# Service statistics
GET /stream-chat/stats
```

## 🔄 Comparison with Original

### Similarities to hiteshchoudhary's Implementation
- ✅ **GetStream Integration**: Real-time messaging platform
- ✅ **AI Agent System**: Dynamic agent lifecycle management
- ✅ **OpenAI Integration**: GPT-4 for intelligent responses
- ✅ **Modern UI**: React with Stream Chat components
- ✅ **Agent Management**: Start/stop agent controls
- ✅ **Real-time Updates**: Live message streaming

### Agricultural Enhancements
- 🌱 **Specialized Agents**: Agricultural domain experts
- 🌱 **Knowledge Base**: Comprehensive farming information
- 🌱 **Contextual Responses**: Location and crop-specific advice
- 🌱 **Source Attribution**: Knowledge source citations
- 🌱 **Agricultural UI**: Farming-focused interface design
- 🌱 **Multi-Agent Support**: Multiple simultaneous agents

## 🚀 Deployment

### Environment Setup
```bash
# Production environment variables
STREAM_API_KEY=prod_stream_key
STREAM_API_SECRET=prod_stream_secret
OPENAI_API_KEY=prod_openai_key
NODE_ENV=production
```

### Docker Deployment
```dockerfile
# Backend
FROM python:3.11
COPY requirements_stream.txt .
RUN pip install -r requirements_stream.txt
COPY . .
CMD ["python", "-m", "app.main"]

# Frontend
FROM node:18
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## 📈 Performance Features

### Optimization
- **Efficient Agent Management**: Resource-conscious agent lifecycle
- **Knowledge Base Caching**: Fast information retrieval
- **Stream Chat CDN**: Global message delivery
- **Async Processing**: Non-blocking AI responses
- **Auto Cleanup**: Prevent resource leaks

### Scalability
- **Horizontal Scaling**: Multiple AI service instances
- **Load Balancing**: Distribute agent workload
- **Database Integration**: Persistent knowledge storage
- **Caching Layer**: Redis for fast responses
- **Monitoring**: Health checks and metrics

## 🛡️ Security Features

### Authentication
- **JWT Tokens**: Secure Stream Chat authentication
- **User Validation**: Verified user sessions
- **API Key Management**: Secure credential handling
- **Rate Limiting**: Prevent abuse and overuse

### Data Protection
- **Input Sanitization**: Clean user messages
- **Output Filtering**: Safe AI responses
- **Privacy Controls**: User data protection
- **Audit Logging**: Track agent interactions

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/stream-enhancement`
3. Commit changes: `git commit -am 'Add new agent type'`
4. Push to branch: `git push origin feature/stream-enhancement`
5. Submit pull request

## 📄 License

This project is part of the ODOP Connect agricultural marketplace platform.

---

**Built with ❤️ using GetStream.io, OpenAI, and modern agricultural expertise** 🌱