# Design Document: AI Chat Widget

## Overview

The AI Chat Widget is a floating conversational assistant that provides contextual help to users across the entire agricultural platform. The widget appears as a persistent chat icon in the bottom-right corner of all authenticated pages, allowing farmers and buyers to access AI-powered assistance without navigating away from their current task.

### Design Goals

1. **Ubiquitous Access**: Provide instant AI assistance from any page in the platform
2. **Context Awareness**: Deliver role-specific and page-specific responses based on user type and current location
3. **Seamless Integration**: Leverage existing AI infrastructure and maintain visual consistency with the platform
4. **Performance**: Ensure minimal impact on page load times and runtime performance
5. **Mobile-First**: Deliver an excellent experience on both desktop and mobile devices

### Key Features

- Floating button with smooth expand/collapse animations
- Full-screen chat panel on mobile, fixed-size panel on desktop
- Role-based contextual responses (Farmer vs Buyer)
- Multi-language support (English, Hindi, Marathi)
- Persistent chat history across sessions
- Quick action suggestions based on user role and context
- Proactive assistance notifications
- Integration with existing `/api/ai/chat/message` endpoint

## Architecture

### Component Hierarchy

```
ChatWidget (Root Component)
├── FloatingButton
│   ├── ChatIcon
│   └── UnreadBadge
├── ChatPanel
│   ├── ChatHeader
│   │   ├── Title
│   │   ├── StatusIndicator
│   │   └── CloseButton
│   ├── MessageList
│   │   ├── WelcomeMessage
│   │   ├── MessageBubble (User)
│   │   ├── MessageBubble (Assistant)
│   │   └── TypingIndicator
│   ├── QuickActions
│   │   └── ActionButton[]
│   └── ChatInput
│       ├── TextArea
│       ├── SendButton
│       └── VoiceInputButton (mobile)
└── ProactiveNotification
    ├── NotificationBubble
    └── DismissButton
```

### State Management

The widget uses a combination of local component state and global state management:

**Local State (React useState/useReducer)**:
- `isExpanded`: Boolean indicating if chat panel is open
- `messages`: Array of chat messages in current session
- `inputValue`: Current text in input field
- `isLoading`: Boolean indicating if AI is processing
- `quickActions`: Array of suggested quick actions

**Global State (Zustand/Context)**:
- `chatHistory`: Persistent message history across sessions
- `unreadCount`: Number of unread AI suggestions
- `userPreferences`: Widget settings (notifications enabled, etc.)
- `widgetState`: Widget state persisted across page navigations

**Session Storage**:
- Temporary widget state during single session
- Used to maintain expanded state across page navigations

**Database (via API)**:
- Long-term chat history (90 days retention)
- User preferences and settings
- Analytics and interaction logs

### Integration Points

1. **Authentication System**: Uses existing `useAuthStore` to access user context
2. **AI Service**: Connects to `/api/ai/chat/message` endpoint
3. **i18n System**: Integrates with existing translation infrastructure
4. **Notification System**: Coordinates with `LiveNotificationBell` component
5. **Analytics**: Logs interactions for improvement and monitoring

## Components and Interfaces

### 1. ChatWidget Component

**Purpose**: Root component that manages widget lifecycle and state

**Props**:
```typescript
interface ChatWidgetProps {
  initialExpanded?: boolean;
  enableProactiveNotifications?: boolean;
  position?: 'bottom-right' | 'bottom-left';
  zIndex?: number;
}
```

**State**:
```typescript
interface ChatWidgetState {
  isExpanded: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  quickActions: QuickAction[];
  unreadCount: number;
  showProactiveNotification: boolean;
  proactiveMessage: string | null;
}
```

**Key Methods**:
- `toggleExpanded()`: Toggle between minimized and expanded states
- `sendMessage(text: string)`: Send user message to AI
- `loadHistory()`: Load chat history from storage
- `clearHistory()`: Clear all chat history
- `showProactiveHelp(message: string)`: Display proactive notification

### 2. FloatingButton Component

**Purpose**: Minimized chat icon that users click to open the widget

**Props**:
```typescript
interface FloatingButtonProps {
  onClick: () => void;
  unreadCount: number;
  isExpanded: boolean;
  position: { bottom: number; right: number };
}
```

**Styling**:
- Fixed positioning at bottom-right (24px from edges)
- 56px × 56px circular button on desktop
- 48px × 48px on mobile (minimum touch target)
- Subtle pulse animation to indicate availability
- Badge overlay for unread count
- Smooth rotation animation when expanding

### 3. ChatPanel Component

**Purpose**: Expanded chat interface showing conversation and input

**Props**:
```typescript
interface ChatPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  quickActions: QuickAction[];
  onSendMessage: (text: string) => void;
  onClose: () => void;
  userRole: 'FARMER' | 'BUYER';
}
```

**Responsive Behavior**:
- Desktop (≥768px): 400px × 600px fixed panel
- Mobile (<768px): Full-screen overlay
- Smooth slide-up animation on mobile
- Smooth scale animation on desktop

### 4. MessageBubble Component

**Purpose**: Display individual chat messages

**Props**:
```typescript
interface MessageBubbleProps {
  message: ChatMessage;
  role: 'user' | 'assistant';
  timestamp: Date;
  isLatest: boolean;
}
```

**Styling**:
- User messages: Blue background, right-aligned
- Assistant messages: Light gray background, left-aligned
- Avatar icon for assistant messages
- Timestamp in small text below message
- Markdown support for formatted responses

### 5. ChatInput Component

**Purpose**: Text input area with send button

**Props**:
```typescript
interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
  placeholder: string;
}
```

**Features**:
- Auto-expanding textarea (max 4 lines)
- Enter to send, Shift+Enter for new line
- Send button disabled when empty or loading
- Character count indicator (optional)
- Voice input button on mobile devices

### 6. QuickActions Component

**Purpose**: Display suggested quick action buttons

**Props**:
```typescript
interface QuickActionsProps {
  actions: QuickAction[];
  onActionClick: (action: QuickAction) => void;
  disabled: boolean;
}
```

**QuickAction Interface**:
```typescript
interface QuickAction {
  id: string;
  label: string;
  query: string;
  icon?: string;
  category?: 'price' | 'quality' | 'market' | 'help';
}
```

### 7. ProactiveNotification Component

**Purpose**: Display proactive help suggestions

**Props**:
```typescript
interface ProactiveNotificationProps {
  message: string;
  onDismiss: () => void;
  onAccept: () => void;
}
```

**Behavior**:
- Appears above floating button
- Auto-dismisses after 10 seconds
- Throttled to max once per 10 minutes
- Respects user preference settings

## Data Models

### ChatMessage

```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    intent?: string;
    confidence?: number;
    suggestions?: string[];
    actions?: QuickAction[];
  };
}
```

### ChatSession

```typescript
interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  startedAt: Date;
  lastActivityAt: Date;
  context: {
    userRole: 'FARMER' | 'BUYER';
    currentPage?: string;
    userLocation?: string;
  };
}
```

### UserChatPreferences

```typescript
interface UserChatPreferences {
  userId: string;
  proactiveNotificationsEnabled: boolean;
  preferredLanguage: 'en' | 'hi' | 'mr';
  soundEnabled: boolean;
  historyRetentionDays: number;
}
```

### API Request/Response

**Request to `/api/ai/chat/message`**:
```typescript
interface ChatAPIRequest {
  message: string;
  conversationHistory: ChatMessage[];
  userContext: {
    userId: string;
    name: string;
    userType: 'FARMER' | 'BUYER';
    location?: string;
    currentPage?: string;
    products?: string[];
  };
}
```

**Response from `/api/ai/chat/message`**:
```typescript
interface ChatAPIResponse {
  response: string;
  suggestions: string[];
  intent: string;
  confidence: number;
  actions: QuickAction[];
  metadata?: {
    processingTime: number;
    model: string;
  };
}
```

## Error Handling

### Error Categories

1. **Network Errors**: Connection failures, timeouts
2. **API Errors**: 4xx/5xx responses from backend
3. **Validation Errors**: Invalid input or malformed data
4. **State Errors**: Inconsistent component state

### Error Handling Strategy

**Network Failures**:
- Retry up to 3 times with exponential backoff (1s, 2s, 4s)
- Display "slow connection" warning after 5 seconds
- Show fallback message if all retries fail
- Provide manual retry button

**API Errors**:
- 401/403: Redirect to login page
- 429: Display rate limit message, suggest waiting
- 500/503: Show service unavailable message with fallback
- Other: Generic error message with support contact

**Graceful Degradation**:
- If AI service unavailable, show pre-defined helpful responses
- If history loading fails, start with empty conversation
- If quick actions fail to load, show default role-based actions

**Error Messages**:
```typescript
const ERROR_MESSAGES = {
  NETWORK_ERROR: "Connection issue. Retrying...",
  SERVICE_UNAVAILABLE: "AI assistant is temporarily unavailable. Please try again in a moment.",
  RATE_LIMIT: "Too many requests. Please wait a moment before trying again.",
  GENERIC: "Something went wrong. Please try again.",
  SLOW_CONNECTION: "Your connection seems slow. The response may take longer than usual.",
};
```

**Error UI Components**:
- Inline error message in chat panel
- Retry button for failed messages
- Status indicator showing connection state
- Toast notifications for critical errors

## Testing Strategy

### Why Property-Based Testing Is Not Applicable

Property-based testing (PBT) is not appropriate for this feature because:

1. **UI Component Focus**: The chat widget is primarily a UI component with rendering, animations, and user interactions. PBT is designed for testing pure functions and business logic, not UI rendering.

2. **External Service Integration**: The core functionality depends on external AI service responses, which are non-deterministic and context-dependent. PBT requires predictable, testable properties.

3. **Side-Effect Heavy**: The widget involves many side effects (API calls, DOM manipulation, localStorage, animations) that don't fit the PBT model of pure input/output relationships.

4. **State Management Complexity**: The widget manages complex UI state (expanded/collapsed, loading, error states) that is better tested with example-based tests and user flow simulations.

Instead, we will use a comprehensive testing strategy combining unit tests, integration tests, and end-to-end tests.

### Unit Tests

**Component Tests** (React Testing Library):
- **ChatWidget**: Render, expand/collapse, state management, authentication gating
- **FloatingButton**: Click handling, badge display, animations, positioning
- **ChatPanel**: Message display, scrolling, input handling, responsive behavior
- **MessageBubble**: Rendering different message types, timestamps, markdown support
- **ChatInput**: Text input, send on Enter, character limits, disabled states
- **QuickActions**: Button rendering, click handling, disabled state, role-specific actions
- **ProactiveNotification**: Display, auto-dismiss, throttling, user preferences

**Hook Tests**:
- **useChatWidget**: State management, message handling, expand/collapse logic
- **useChatHistory**: Loading from storage, saving to storage, clearing history
- **useProactiveNotifications**: Throttling logic, user preferences, timing
- **useChatAPI**: API call handling, retry logic, error handling

**Service Tests**:
- **chatWidgetService**: API calls, request formatting, response parsing, error handling, retries
- **storageService**: LocalStorage operations, data persistence, serialization
- **contextService**: User context building, role detection, page context

**Example Test Cases**:
```typescript
describe('ChatWidget', () => {
  it('should not render when user is not authenticated', () => {
    // Test authentication gating
  });

  it('should expand when floating button is clicked', () => {
    // Test expand/collapse interaction
  });

  it('should persist expanded state across page navigation', () => {
    // Test state persistence
  });

  it('should display welcome message on first open', () => {
    // Test initial state
  });
});

describe('ChatInput', () => {
  it('should send message on Enter key', () => {
    // Test keyboard interaction
  });

  it('should add new line on Shift+Enter', () => {
    // Test multi-line input
  });

  it('should disable send button when input is empty', () => {
    // Test validation
  });
});

describe('chatWidgetService', () => {
  it('should retry failed requests up to 3 times', () => {
    // Test retry logic
  });

  it('should use exponential backoff for retries', () => {
    // Test backoff timing
  });

  it('should return fallback response when service unavailable', () => {
    // Test graceful degradation
  });
});
```

### Integration Tests

**User Flows**:
1. **Basic Conversation Flow**: Open widget → Send message → Receive response → Close widget
2. **History Management**: Load existing history → Continue conversation → Clear history → Confirm
3. **Quick Actions**: Click quick action → Receive contextual response → See updated suggestions
4. **Proactive Notifications**: Receive proactive notification → Accept → Open widget with context
5. **Error Recovery**: Network failure → Retry → Success → Continue conversation
6. **Mobile Interaction**: Open full-screen → Send message → Swipe to close

**API Integration**:
- Mock `/api/ai/chat/message` endpoint with various response scenarios
- Test request format includes all required context (user, role, history)
- Test authentication token is included in requests
- Test response parsing handles all expected formats
- Test retry logic with simulated network failures
- Test timeout handling with delayed responses

**State Persistence**:
- Test widget state persists across page navigations
- Test chat history saves to localStorage
- Test preferences persist across sessions
- Test state recovery after browser refresh

**Cross-Browser Testing**:
- Chrome, Firefox, Safari, Edge (desktop)
- iOS Safari, Android Chrome (mobile)
- Test animations, positioning, touch interactions
- Test responsive breakpoints

**Example Integration Tests**:
```typescript
describe('Chat Widget Integration', () => {
  it('should complete full conversation flow', async () => {
    // 1. Open widget
    // 2. Send message
    // 3. Wait for AI response
    // 4. Verify response displayed
    // 5. Verify suggestions updated
    // 6. Close widget
  });

  it('should handle API errors gracefully', async () => {
    // 1. Mock API error
    // 2. Send message
    // 3. Verify error message displayed
    // 4. Verify retry button appears
    // 5. Click retry
    // 6. Verify success
  });

  it('should maintain context across page navigation', async () => {
    // 1. Open widget and send message
    // 2. Navigate to different page
    // 3. Verify widget remains expanded
    // 4. Verify conversation history preserved
  });
});
```

### End-to-End Tests (Playwright/Cypress)

**Critical Paths**:
1. **First-Time User**: User opens widget for first time → Sees welcome message → Sends question → Receives response
2. **Returning User**: User opens widget → Sees previous conversation → Continues conversation
3. **Quick Actions**: User clicks quick action → Receives contextual response → Clicks another action
4. **History Management**: User clears history → Confirms → Starts new conversation
5. **Mobile Experience**: Mobile user opens widget → Full-screen panel appears → Sends message → Swipes to close
6. **Proactive Help**: User stays on page → Proactive notification appears → User accepts → Widget opens with context
7. **Error Recovery**: Network disconnects → User sends message → Error appears → Network reconnects → Retry succeeds

**Performance Tests**:
- Widget loads within 500ms of page load
- Floating button renders immediately
- Message send/receive completes within 3 seconds
- Animations run at 60fps
- Memory usage under 5MB when minimized
- No memory leaks after multiple open/close cycles

**Accessibility Tests**:
- Keyboard navigation (Tab, Enter, Escape)
- Screen reader compatibility (ARIA labels, roles, live regions)
- Color contrast ratios meet WCAG AA standards
- Focus management and visible focus indicators
- Touch target sizes minimum 48px on mobile
- Reduced motion support for users with motion sensitivity

**Example E2E Tests**:
```typescript
describe('Chat Widget E2E', () => {
  it('should allow farmer to get price information', async () => {
    // 1. Login as farmer
    // 2. Navigate to dashboard
    // 3. Click chat widget
    // 4. Type "What is the current price for wheat?"
    // 5. Press Enter
    // 6. Wait for response
    // 7. Verify response contains price information
    // 8. Verify quick actions are farmer-specific
  });

  it('should work on mobile devices', async () => {
    // 1. Set mobile viewport
    // 2. Login
    // 3. Click floating button
    // 4. Verify full-screen panel
    // 5. Send message
    // 6. Verify keyboard handling
    // 7. Swipe down to close
    // 8. Verify panel closes
  });

  it('should handle slow network gracefully', async () => {
    // 1. Throttle network to 3G
    // 2. Open widget
    // 3. Send message
    // 4. Verify "slow connection" warning appears
    // 5. Wait for response
    // 6. Verify response eventually arrives
  });
});
```

### Visual Regression Tests

Use tools like Percy or Chromatic to catch unintended visual changes:
- Floating button appearance (normal, hover, with badge)
- Chat panel layout (desktop and mobile)
- Message bubbles (user and assistant)
- Quick actions display
- Error states
- Loading states
- Proactive notifications

### Testing Tools and Frameworks

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Jest + MSW (Mock Service Worker)
- **E2E Tests**: Playwright or Cypress
- **Visual Regression**: Percy or Chromatic
- **Accessibility**: axe-core, jest-axe
- **Performance**: Lighthouse CI, Web Vitals

### Test Coverage Goals

- **Unit Tests**: 80%+ code coverage
- **Integration Tests**: All critical user flows
- **E2E Tests**: All acceptance criteria from requirements
- **Accessibility**: 100% WCAG AA compliance
- **Performance**: All performance budgets met

### Continuous Integration

All tests run automatically on:
- Pull request creation
- Commits to main branch
- Scheduled nightly runs for E2E tests
- Pre-deployment verification

### Manual Testing Checklist

Before release, manually verify:
- [ ] Widget appears on all authenticated pages
- [ ] Animations are smooth on all devices
- [ ] Touch interactions work on mobile
- [ ] Voice input works on supported devices
- [ ] All translations display correctly
- [ ] Widget works with screen readers
- [ ] Performance is acceptable on slow devices
- [ ] Widget doesn't interfere with other UI elements

## Mobile Responsiveness Strategy

### Breakpoints

```css
/* Mobile: < 768px */
@media (max-width: 767px) {
  /* Full-screen chat panel */
  /* Larger touch targets */
  /* Simplified UI */
}

/* Tablet: 768px - 1023px */
@media (min-width: 768px) and (max-width: 1023px) {
  /* Slightly larger panel */
  /* Optimized for touch */
}

/* Desktop: ≥ 1024px */
@media (min-width: 1024px) {
  /* Fixed-size panel */
  /* Hover interactions */
}
```

### Mobile-Specific Features

**Full-Screen Mode**:
- Chat panel expands to 100vw × 100vh on mobile
- Header with close button at top
- Input fixed at bottom with keyboard handling
- Smooth slide-up animation from bottom

**Touch Gestures**:
- Swipe down from top to close panel
- Pull-to-refresh disabled in chat area
- Smooth scrolling with momentum
- Touch-friendly button sizes (min 48px)

**Keyboard Handling**:
- Panel resizes when keyboard appears
- Input remains visible above keyboard
- Auto-scroll to latest message
- Keyboard dismiss on scroll

**Voice Input**:
- Microphone button in input area
- Browser speech recognition API
- Visual feedback during recording
- Fallback to text input if unavailable

**Performance Optimizations**:
- Lazy load chat history (virtualized list)
- Debounced input handling
- Optimized animations (transform/opacity only)
- Reduced motion for accessibility

### Responsive Layout

**Floating Button**:
- Desktop: 56px × 56px, 24px from edges
- Mobile: 48px × 48px, 16px from edges
- Z-index: 1000 (above most content, below modals)

**Chat Panel**:
- Desktop: 400px × 600px, positioned above button
- Tablet: 360px × 550px
- Mobile: 100vw × 100vh (full screen)

**Typography**:
- Desktop: 14px base, 16px input
- Mobile: 16px base, 16px input (prevent zoom)

## Integration with Existing Codebase

### 1. Authentication Integration

```typescript
import { useAuthStore } from '@/store/authStore';

// Access user context
const { user, isAuthenticated } = useAuthStore();

// Only render widget if authenticated
if (!isAuthenticated) return null;

// Pass user context to AI
const userContext = {
  userId: user.id,
  name: user.name,
  userType: user.role,
  location: user.district || user.state,
};
```

### 2. i18n Integration

```typescript
import { useTranslation } from 'react-i18next';

const { t, i18n } = useTranslation();

// Use translations
<input placeholder={t('chat.placeholder')} />

// Add new translation keys
// apps/web/public/locales/en/translation.json
{
  "chat_widget": {
    "title": "AI Assistant",
    "placeholder": "Ask me anything...",
    "send": "Send",
    "clear_history": "Clear History",
    "proactive_help": "Need help with this page?",
    "connection_slow": "Connection is slow...",
    "service_unavailable": "AI temporarily unavailable"
  }
}
```

### 3. API Integration

```typescript
import api from '@/services/api';

// Use existing API client with authentication
const sendMessage = async (message: string, context: any) => {
  const response = await api.post('/ai/chat/message', {
    message,
    conversationHistory: messages,
    userContext: context,
  });
  return response.data;
};
```

### 4. Styling Integration

```typescript
// Use existing Tailwind classes
<div className="fixed bottom-6 right-6 z-[1000]">
  <button className="h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all">
    <MessageSquare size={24} />
  </button>
</div>

// Follow existing design patterns
// - Rounded corners (rounded-2xl, rounded-3xl)
// - Shadow styles (shadow-lg, shadow-2xl)
// - Color palette (blue-600, slate-900, etc.)
// - Font weights (font-medium, font-bold, font-black)
```

### 5. Animation Integration

```typescript
import { motion, AnimatePresence } from 'framer-motion';

// Use existing animation patterns
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ duration: 0.2 }}
>
  {/* Chat panel content */}
</motion.div>
```

### 6. Icon Integration

```typescript
import { MessageSquare, Send, X, Mic, Sparkles } from 'lucide-react';

// Use lucide-react icons consistently
<MessageSquare size={20} className="text-blue-600" />
```

### 7. Global Layout Integration

```typescript
// Add to DashboardLayout or root layout
// apps/web/src/components/dashboard/DashboardLayout.tsx

import { ChatWidget } from '@/components/ui/ChatWidget';

export function DashboardLayout({ children }) {
  return (
    <div>
      {/* Existing layout */}
      {children}
      
      {/* Add chat widget */}
      <ChatWidget />
    </div>
  );
}
```

### 8. State Management Integration

```typescript
// Create chat widget store
// apps/web/src/store/chatWidgetStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatWidgetStore {
  isExpanded: boolean;
  messages: ChatMessage[];
  unreadCount: number;
  preferences: UserChatPreferences;
  setExpanded: (expanded: boolean) => void;
  addMessage: (message: ChatMessage) => void;
  clearHistory: () => void;
}

export const useChatWidgetStore = create<ChatWidgetStore>()(
  persist(
    (set) => ({
      isExpanded: false,
      messages: [],
      unreadCount: 0,
      preferences: {
        proactiveNotificationsEnabled: true,
        preferredLanguage: 'en',
        soundEnabled: false,
        historyRetentionDays: 90,
      },
      setExpanded: (expanded) => set({ isExpanded: expanded }),
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message],
      })),
      clearHistory: () => set({ messages: [], unreadCount: 0 }),
    }),
    {
      name: 'chat-widget-storage',
      partialize: (state) => ({
        messages: state.messages,
        preferences: state.preferences,
      }),
    }
  )
);
```

### 9. Coordination with Existing Chat Components

The platform already has `AgriChatAI.tsx` in the dashboard. The widget should:

- **Share the same AI service**: Use `/api/ai/chat/message` endpoint
- **Separate history**: Widget has its own conversation thread
- **Consistent UX**: Similar message styling and interaction patterns
- **No conflicts**: Widget is global, dashboard chat is page-specific
- **Cross-reference**: Widget can suggest "Open full chat in dashboard"

### 10. Performance Considerations

**Code Splitting**:
```typescript
// Lazy load widget to reduce initial bundle
const ChatWidget = dynamic(() => import('@/components/ui/ChatWidget'), {
  ssr: false,
  loading: () => null,
});
```

**Memoization**:
```typescript
// Memoize expensive computations
const sortedMessages = useMemo(
  () => messages.sort((a, b) => a.timestamp - b.timestamp),
  [messages]
);

// Memoize callbacks
const handleSend = useCallback((text: string) => {
  sendMessage(text);
}, [sendMessage]);
```

**Virtualization**:
```typescript
// For long chat histories, use virtual scrolling
import { useVirtualizer } from '@tanstack/react-virtual';

const virtualizer = useVirtualizer({
  count: messages.length,
  getScrollElement: () => scrollRef.current,
  estimateSize: () => 80,
});
```

## Implementation Phases

### Phase 1: Core Widget Structure (Week 1)
- Create ChatWidget component with basic UI
- Implement FloatingButton with expand/collapse
- Build ChatPanel with message display
- Add ChatInput with send functionality
- Set up basic state management

### Phase 2: AI Integration (Week 1-2)
- Connect to `/api/ai/chat/message` endpoint
- Implement message sending and receiving
- Add loading states and error handling
- Implement retry logic
- Add quick actions display

### Phase 3: History & Persistence (Week 2)
- Implement chat history storage
- Add history loading on widget open
- Create clear history functionality
- Persist widget state across navigation
- Add database integration for long-term storage

### Phase 4: Mobile Optimization (Week 2-3)
- Implement responsive layouts
- Add full-screen mode for mobile
- Implement touch gestures
- Add keyboard handling
- Optimize performance for mobile

### Phase 5: Advanced Features (Week 3)
- Add proactive notifications
- Implement voice input for mobile
- Add role-based quick actions
- Implement context awareness
- Add analytics tracking

### Phase 6: Polish & Testing (Week 3-4)
- Comprehensive testing (unit, integration, e2e)
- Accessibility improvements
- Performance optimization
- Cross-browser testing
- Documentation

## Security Considerations

1. **Authentication**: All API calls include authentication tokens
2. **Input Sanitization**: Sanitize user input before sending to AI
3. **XSS Prevention**: Escape HTML in AI responses
4. **Rate Limiting**: Respect API rate limits, implement client-side throttling
5. **Data Privacy**: Don't log sensitive information in chat history
6. **CORS**: Ensure proper CORS configuration for API calls
7. **Content Security Policy**: Widget complies with CSP headers

## Monitoring and Analytics

**Metrics to Track**:
- Widget open rate
- Messages sent per session
- Average response time
- Error rate and types
- Quick action click rate
- Proactive notification acceptance rate
- User satisfaction (implicit: conversation length, explicit: feedback)

**Logging**:
- All interactions logged for improvement
- Error logs with context for debugging
- Performance metrics (load time, response time)
- User feedback and ratings

## Future Enhancements

1. **Multi-turn Context**: Maintain deeper conversation context
2. **File Attachments**: Allow users to upload images for quality analysis
3. **Voice Output**: Text-to-speech for AI responses
4. **Suggested Replies**: Quick reply buttons for common responses
5. **Chat Export**: Allow users to export conversation history
6. **Collaborative Chat**: Share chat sessions with support team
7. **Advanced Analytics**: Sentiment analysis, topic modeling
8. **Personalization**: Learn user preferences over time
9. **Integration with Other Features**: Deep links to relevant platform features
10. **Offline Mode**: Basic functionality when offline

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Author**: AI Chat Widget Team  
**Status**: Ready for Implementation
