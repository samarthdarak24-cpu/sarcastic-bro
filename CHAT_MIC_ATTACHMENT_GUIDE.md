# 🎤 Chat with Mic & Attachment Features - Complete Guide

## Overview

Complete implementation of voice input (microphone) and file attachment features for the AgriVoice AI chat interface.

---

## Features Implemented

### ✅ Microphone (Voice Input)
- Real-time voice recording
- Recording timer display
- Stop/start controls
- Audio file attachment
- Browser Speech Recognition API support
- Multi-language support (20+ languages)
- Interim results display

### ✅ File Attachments
- Multiple file upload support
- File type validation
- File size display
- Remove attachment option
- Attachment preview
- Supported formats: Images, PDF, Office docs, CSV, Audio

### ✅ Chat Interface
- Message history
- Typing indicator
- Timestamp display
- Role-based responses (Farmer/Buyer/General)
- Session management
- Error handling
- Loading states

---

## File Structure

```
apps/web/src/
├── components/chat/
│   ├── ChatInput.tsx              # Input component with mic & attachment
│   ├── ChatInput.module.css       # Input styling
│   ├── ChatWindow.tsx             # Main chat window
│   └── ChatWindow.module.css      # Chat window styling
├── services/
│   └── voiceService.ts            # Voice recognition service
└── hooks/
    └── useChat.ts                 # Chat state management hook

apps/api/src/modules/chat/
└── chat-upload.controller.ts      # File upload API endpoints
```

---

## Installation & Setup

### 1. Install Dependencies

```bash
cd apps/web
npm install lucide-react
```

### 2. Backend Setup

Add multer to backend dependencies:

```bash
cd apps/api
npm install multer
npm install --save-dev @types/multer
```

### 3. Update Backend Routes

Add the upload controller to your main app.ts:

```typescript
import { chatUploadRouter } from './modules/chat/chat-upload.controller';

app.use('/api/chat', chatUploadRouter);
```

### 4. Create Uploads Directory

The backend will automatically create an `uploads` directory, but you can pre-create it:

```bash
mkdir -p apps/api/uploads
```

---

## Usage

### Basic Implementation

```tsx
import { ChatWindow } from '@/components/chat/ChatWindow';

export default function ChatPage() {
  return (
    <ChatWindow 
      userRole="farmer"
      onClose={() => console.log('Chat closed')}
    />
  );
}
```

### Using the Hook

```tsx
import { useChat } from '@/hooks/useChat';
import { ChatInput } from '@/components/chat/ChatInput';

export default function CustomChat() {
  const { messages, isLoading, sendMessage } = useChat({
    userRole: 'buyer',
    apiUrl: 'http://localhost:3001/api/chat',
  });

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      <ChatInput 
        onSendMessage={sendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}
```

---

## API Endpoints

### Chat Message
```bash
POST /api/chat
Content-Type: application/json

{
  "message": "Your question here",
  "userRole": "farmer|buyer|general",
  "sessionId": "session-123"
}

Response:
{
  "response": "AI response here...",
  "sessionId": "session-123",
  "model": "mistral"
}
```

### Upload File
```bash
POST /api/chat/upload
Content-Type: multipart/form-data

file: <binary file data>

Response:
{
  "success": true,
  "file": {
    "filename": "file-123456.pdf",
    "originalName": "document.pdf",
    "mimetype": "application/pdf",
    "size": 102400,
    "path": "/uploads/file-123456.pdf",
    "uploadedAt": "2024-04-08T10:30:00Z"
  }
}
```

### Upload Multiple Files
```bash
POST /api/chat/upload-multiple
Content-Type: multipart/form-data

files: <multiple binary files>

Response:
{
  "success": true,
  "files": [...],
  "count": 3
}
```

### Delete File
```bash
DELETE /api/chat/upload/:filename

Response:
{
  "success": true,
  "message": "File deleted successfully"
}
```

---

## Component Props

### ChatWindow

```typescript
interface ChatWindowProps {
  userRole?: 'farmer' | 'buyer' | 'general';  // Default: 'general'
  onClose?: () => void;                        // Close handler
}
```

### ChatInput

```typescript
interface ChatInputProps {
  onSendMessage: (message: string, attachments?: File[]) => void;
  disabled?: boolean;
  isLoading?: boolean;
}
```

### useChat Hook

```typescript
interface UseChatOptions {
  userRole?: 'farmer' | 'buyer' | 'general';
  apiUrl?: string;
}

Returns: {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string, attachments?: File[]) => Promise<void>;
  clearMessages: () => void;
  deleteMessage: (messageId: string) => void;
  updateMessage: (messageId: string, content: string) => void;
  sessionId: string;
}
```

---

## Voice Recognition

### Supported Languages

```typescript
VoiceService.getAvailableLanguages()
// Returns: ['en-US', 'en-GB', 'hi-IN', 'mr-IN', 'ta-IN', ...]
```

### Check Browser Support

```typescript
if (VoiceService.isSupported()) {
  // Browser supports Speech Recognition
}
```

### Manual Voice Service Usage

```typescript
import VoiceService from '@/services/voiceService';

const voiceService = new VoiceService({
  language: 'en-US',
  continuous: false,
  interimResults: true,
});

voiceService.startListening(
  (transcript, isFinal) => {
    console.log('Transcript:', transcript);
    console.log('Is Final:', isFinal);
  },
  (error) => {
    console.error('Error:', error);
  }
);

// Stop listening
voiceService.stopListening();
```

---

## File Upload Limits

- **Max file size**: 50MB
- **Max files per upload**: 10
- **Allowed types**:
  - Images: JPEG, PNG, GIF, WebP
  - Documents: PDF, DOC, DOCX, XLS, XLSX, CSV
  - Audio: WAV, MP3, OGG

---

## Styling Customization

### CSS Variables

Edit `ChatInput.module.css` and `ChatWindow.module.css` to customize:

```css
/* Primary color */
--primary: #4caf50;

/* Background */
--bg-dark: #0f1419;
--bg-light: #1a1f2e;

/* Text colors */
--text-primary: #fff;
--text-secondary: rgba(255, 255, 255, 0.6);
```

### Dark Mode

Already implemented with dark theme. For light mode, update CSS:

```css
.chatWindow {
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
  color: #333;
}
```

---

## Error Handling

### Common Issues

**Microphone not working:**
```typescript
// Check browser support
if (!VoiceService.isSupported()) {
  console.log('Speech Recognition not supported');
}

// Check permissions
navigator.permissions.query({ name: 'microphone' })
  .then(result => console.log(result.state));
```

**File upload fails:**
```typescript
// Check file size
if (file.size > 50 * 1024 * 1024) {
  console.error('File too large');
}

// Check file type
const allowedTypes = ['image/jpeg', 'application/pdf'];
if (!allowedTypes.includes(file.type)) {
  console.error('File type not allowed');
}
```

**Chat API error:**
```typescript
try {
  await sendMessage(message);
} catch (error) {
  console.error('Chat error:', error);
  // Show user-friendly error message
}
```

---

## Performance Optimization

### Message Virtualization

For large message lists, implement virtualization:

```tsx
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={400}
  itemCount={messages.length}
  itemSize={80}
>
  {({ index, style }) => (
    <div style={style}>
      {messages[index].content}
    </div>
  )}
</FixedSizeList>
```

### Lazy Loading

Load older messages on scroll:

```typescript
const handleScroll = (e) => {
  if (e.target.scrollTop === 0) {
    // Load older messages
    loadMoreMessages();
  }
};
```

---

## Security Considerations

### File Upload Security

✅ **Implemented:**
- File type validation
- File size limits
- Directory traversal prevention
- Unique filename generation

### Additional Recommendations

```typescript
// Validate file on client
const validateFile = (file: File) => {
  const maxSize = 50 * 1024 * 1024;
  const allowedTypes = ['image/jpeg', 'application/pdf'];
  
  if (file.size > maxSize) throw new Error('File too large');
  if (!allowedTypes.includes(file.type)) throw new Error('Invalid type');
};

// Sanitize user input
const sanitizeMessage = (message: string) => {
  return message
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trim();
};
```

---

## Testing

### Unit Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatInput } from '@/components/chat/ChatInput';

describe('ChatInput', () => {
  it('should send message on Enter key', () => {
    const onSend = jest.fn();
    render(<ChatInput onSendMessage={onSend} />);
    
    const input = screen.getByPlaceholderText(/Ask anything/);
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' });
    
    expect(onSend).toHaveBeenCalledWith('Test message', undefined);
  });

  it('should handle file attachment', () => {
    const onSend = jest.fn();
    render(<ChatInput onSendMessage={onSend} />);
    
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/Attach file/);
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
  });
});
```

---

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Microphone | ✅ | ✅ | ✅ | ✅ |
| File Upload | ✅ | ✅ | ✅ | ✅ |
| Speech Recognition | ✅ | ✅ | ⚠️ | ✅ |
| Web Audio API | ✅ | ✅ | ✅ | ✅ |

---

## Troubleshooting

### Microphone Permission Denied

```bash
# Chrome: Check chrome://settings/content/microphone
# Firefox: Check about:preferences#privacy
# Safari: System Preferences > Security & Privacy > Microphone
```

### File Upload Not Working

1. Check backend is running: `npm run dev` in `apps/api`
2. Verify uploads directory exists
3. Check file size limits
4. Check CORS settings if cross-origin

### Chat Not Responding

1. Verify Ollama is running: `ollama serve`
2. Check backend logs for errors
3. Verify API endpoint is correct
4. Check network tab in browser DevTools

---

## Next Steps

1. **Integrate with existing chat UI** - Replace current chat component
2. **Add message persistence** - Save to database
3. **Implement real-time sync** - Use WebSockets
4. **Add message search** - Search through history
5. **Add export functionality** - Export chat as PDF/JSON
6. **Implement user preferences** - Save language, theme, etc.

---

## Support

For issues or questions:
1. Check browser console for errors
2. Check backend logs
3. Verify all dependencies are installed
4. Test with simple message first
5. Check network requests in DevTools

---

## Summary

✅ Complete voice input (microphone) implementation
✅ Complete file attachment system
✅ Full chat interface with message history
✅ Role-based responses
✅ Error handling and validation
✅ Responsive design
✅ Production-ready code

Ready to use! 🚀
