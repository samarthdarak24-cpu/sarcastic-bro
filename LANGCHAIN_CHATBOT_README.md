# LangChain Agricultural Chatbot

A sophisticated AI chatbot implementation similar to krishnaik06's LangChain chatbot, specifically tailored for agricultural applications with RAG (Retrieval Augmented Generation) capabilities.

## 🌟 Features

### Core Capabilities
- **RAG System**: Retrieval Augmented Generation with agricultural knowledge base
- **Multi-Model Support**: Ollama, OpenAI, and other LLM providers
- **Streaming Responses**: Real-time response streaming for better UX
- **Conversation Memory**: Context-aware conversations with history
- **Source Attribution**: Shows knowledge sources for transparency
- **Smart Suggestions**: Contextual follow-up questions

### Agricultural Focus
- **Crop Management**: Planting, cultivation, and harvesting advice
- **Soil Health**: pH management, fertilization, and soil improvement
- **Pest Control**: IPM strategies and organic solutions
- **Market Insights**: Pricing trends and marketing strategies
- **Sustainable Practices**: Eco-friendly farming techniques

## 🏗️ Architecture

### Backend Components
```
apps/ai-service/
├── app/services/langchain_chatbot.py    # Main chatbot service
├── app/routers/langchain_chat_router.py # FastAPI endpoints
├── app/data/agri-knowledge.json         # Knowledge base
└── requirements_langchain.txt           # Dependencies
```

### Frontend Components
```
apps/web/src/
├── components/ui/LangChainChat/         # React chat component
├── app/langchain-chat/page.tsx          # Demo page
└── services/langchainChatService.ts     # API service
```

### API Integration
```
apps/api/src/modules/ai/
├── langchain-chat.controller.ts         # Express controller
└── langchain-chat.routes.ts            # API routes
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Run the setup script
setup-langchain.bat

# Or manually install
cd apps/ai-service
pip install -r requirements_langchain.txt
```

### 2. Setup Ollama (Optional but Recommended)
```bash
# Install and start Ollama
setup-ollama.bat

# Pull a model
ollama pull llama2
```

### 3. Start Services
```bash
# Start AI Service
cd apps/ai-service
python -m app.main

# Start API (in another terminal)
cd apps/api
npm run dev

# Start Frontend (in another terminal)
cd apps/web
npm run dev
```

### 4. Access the Chatbot
- **Demo Page**: http://localhost:3000/langchain-chat
- **API Docs**: http://localhost:8000/docs#/LangChain%20Chatbot
- **Health Check**: http://localhost:8000/langchain-chat/health

## 📡 API Endpoints

### Session Management
```http
POST /langchain-chat/session
GET /langchain-chat/session/{session_id}/history
DELETE /langchain-chat/session/{session_id}
```

### Chat Operations
```http
POST /langchain-chat/chat
POST /langchain-chat/chat/stream
```

### Utilities
```http
GET /langchain-chat/suggestions?context={context}
GET /langchain-chat/health
GET /langchain-chat/knowledge-base/stats
```

## 💬 Usage Examples

### Basic Chat
```javascript
const response = await fetch('/api/ai/langchain-chat/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: "How do I improve my soil health?",
    user_id: "farmer-123",
    session_id: "session-abc"
  })
});
```

### Streaming Chat
```javascript
const response = await fetch('/api/ai/langchain-chat/chat/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: "Tell me about crop rotation",
    user_id: "farmer-123",
    stream: true
  })
});

const reader = response.body.getReader();
// Handle streaming data...
```

## 🧠 Knowledge Base

The chatbot uses a comprehensive agricultural knowledge base covering:

### Categories
- **Farming Practices**: Crop rotation, companion planting
- **Pest Management**: IPM strategies, organic controls
- **Soil Management**: pH, fertilization, amendments
- **Water Management**: Irrigation, conservation
- **Market Insights**: Pricing, marketing strategies
- **Sustainability**: Eco-friendly practices

### Data Format
```json
{
  "title": "Crop Rotation Principles",
  "content": "Detailed explanation...",
  "category": "farming_practices",
  "crops": ["wheat", "corn", "soybeans"],
  "benefits": ["pest_control", "soil_health"]
}
```

## 🔧 Configuration

### Environment Variables
```bash
# AI Service
OLLAMA_BASE_URL=http://localhost:11434
OPENAI_API_KEY=your_openai_key
HUGGINGFACE_API_TOKEN=your_hf_token

# Vector Store
VECTOR_STORE_TYPE=faiss  # or chromadb
EMBEDDING_MODEL=llama2

# Knowledge Base
KNOWLEDGE_BASE_PATH=app/data/agri-knowledge.json
```

### Model Configuration
```python
# In langchain_chatbot.py
self.llm = ChatOllama(
    model="llama2",
    temperature=0.7,
    base_url="http://localhost:11434"
)

self.embeddings = OllamaEmbeddings(
    model="llama2",
    base_url="http://localhost:11434"
)
```

## 🧪 Testing

### Run Tests
```bash
# Test API endpoints
test-langchain-chat.bat

# Manual testing
curl -X POST "http://localhost:8000/langchain-chat/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "How do I grow tomatoes?", "user_id": "test"}'
```

### Health Check
```bash
curl http://localhost:8000/langchain-chat/health
```

## 🎨 Frontend Integration

### React Component Usage
```jsx
import LangChainChat from '@/components/ui/LangChainChat/LangChainChat';

function MyPage() {
  return (
    <div className="h-96">
      <LangChainChat userId="farmer-123" />
    </div>
  );
}
```

### Custom Styling
The component uses Tailwind CSS and can be customized:
```jsx
<LangChainChat 
  userId="farmer-123" 
  className="custom-chat-styles"
/>
```

## 🔄 Comparison with krishnaik06's Implementation

### Similarities
- ✅ LangChain framework usage
- ✅ RAG implementation with vector stores
- ✅ Conversation memory
- ✅ Streaming responses
- ✅ Document-based knowledge retrieval

### Enhancements
- 🚀 **Agricultural Focus**: Specialized for farming use cases
- 🚀 **Production Ready**: Full-stack integration with React/FastAPI
- 🚀 **Multi-Model**: Support for Ollama, OpenAI, HuggingFace
- 🚀 **Session Management**: Persistent conversation sessions
- 🚀 **Source Attribution**: Transparent knowledge sourcing
- 🚀 **Smart Suggestions**: Context-aware follow-ups
- 🚀 **Scalable Architecture**: Microservices design

## 🛠️ Troubleshooting

### Common Issues

1. **Ollama Connection Failed**
   ```bash
   # Start Ollama service
   ollama serve
   
   # Pull required model
   ollama pull llama2
   ```

2. **Vector Store Errors**
   ```bash
   # Install FAISS
   pip install faiss-cpu
   
   # Or use ChromaDB
   pip install chromadb
   ```

3. **Memory Issues**
   ```python
   # Reduce chunk size in langchain_chatbot.py
   text_splitter = RecursiveCharacterTextSplitter(
       chunk_size=500,  # Reduced from 1000
       chunk_overlap=100
   )
   ```

### Performance Optimization

1. **Use Local Models**: Ollama for faster responses
2. **Optimize Chunks**: Smaller chunks for better retrieval
3. **Cache Embeddings**: Store computed embeddings
4. **Limit History**: Keep conversation memory bounded

## 📈 Future Enhancements

- [ ] **Multi-language Support**: Hindi, Marathi translations
- [ ] **Voice Integration**: Speech-to-text with Whisper
- [ ] **Image Analysis**: Crop disease detection
- [ ] **Weather Integration**: Real-time weather data
- [ ] **Market Data**: Live commodity prices
- [ ] **Expert System**: Rule-based recommendations

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/langchain-enhancement`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/langchain-enhancement`
5. Submit pull request

## 📄 License

This project is part of the ODOP Connect agricultural marketplace platform.

---

**Built with ❤️ for farmers and agricultural communities**