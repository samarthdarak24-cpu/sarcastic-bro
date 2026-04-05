# Implementation Plan: AI Chat Widget

## Overview

This implementation plan breaks down the AI Chat Widget feature into discrete, manageable tasks. The widget will be built using TypeScript and React, integrating with the existing authentication, i18n, and AI service infrastructure. The implementation follows a phased approach: core structure → API integration → persistence → mobile optimization → advanced features → testing and polish.

## Tasks

- [x] 1. Set up project structure and core types
  - Create directory structure for chat widget components
  - Define TypeScript interfaces for ChatMessage, ChatSession, QuickAction, and API types
  - Set up barrel exports for clean imports
  - _Requirements: 1.1, 2.1, 9.1_

- [ ] 2. Create ChatWidget root component
  - [x] 2.1 Implement ChatWidget component with state management
    - Create ChatWidget.tsx with expand/collapse state
    - Implement authentication gating (only show when user is authenticated)
    - Add conditional rendering for FloatingButton and ChatPanel
    - Set up initial state (isExpanded, messages, isLoading, quickActions)
    - _Requirements: 1.3, 2.1, 2.6_

  - [ ]* 2.2 Write unit tests for ChatWidget component
    - Test authentication gating (widget hidden when not authenticated)
    - Test expand/collapse state transitions
    - Test initial state values
    - _Requirements: 1.3, 2.1_

- [ ] 3. Implement FloatingButton component
  - [x] 3.1 Create FloatingButton component with styling
    - Build circular button with chat icon (using lucide-react MessageSquare)
    - Implement fixed positioning (24px from bottom-right on desktop, 16px on mobile)
    - Add hover effects and smooth transitions
    - Implement unread badge overlay for notification count
    - Add subtle pulse animation to indicate availability
    - _Requirements: 1.1, 1.2, 1.4, 1.5, 7.6_

  - [ ] 3.2 Add click handler and rotation animation
    - Connect onClick handler to toggle expanded state
    - Add rotation animation when expanding (180deg transform)
    - Ensure minimum touch target size (48px on mobile)
    - _Requirements: 2.1, 2.2, 7.6_

  - [ ]* 3.3 Write unit tests for FloatingButton
    - Test click handling
    - Test badge display with different unread counts
    - Test positioning and responsive behavior
    - _Requirements: 1.1, 2.1, 7.6_

- [ ] 4. Build ChatPanel component structure
  - [x] 4.1 Create ChatPanel layout with header, message area, and input
    - Build ChatPanel.tsx with three main sections (header, messages, input)
    - Implement responsive dimensions (400x600px desktop, full-screen mobile)
    - Add smooth expand/collapse animations using framer-motion
    - Position panel above FloatingButton on desktop
    - _Requirements: 2.3, 2.4, 10.1_

  - [ ] 4.2 Implement ChatHeader component
    - Create header with title "AI Assistant"
    - Add status indicator (online/offline)
    - Add close button with X icon
    - Connect close button to minimize handler
    - _Requirements: 2.5, 7.2_

  - [ ]* 4.3 Write unit tests for ChatPanel
    - Test responsive layout rendering
    - Test header close button functionality
    - Test animation states
    - _Requirements: 2.3, 2.4, 2.5_

- [ ] 5. Implement message display components
  - [ ] 5.1 Create MessageBubble component
    - Build message bubble with role-based styling (user: blue right-aligned, assistant: gray left-aligned)
    - Add avatar icon for assistant messages
    - Display timestamp below each message
    - Implement markdown support for formatted AI responses
    - Add proper spacing and padding
    - _Requirements: 7.2, 7.3_

  - [x] 5.2 Create MessageList component with auto-scroll
    - Build scrollable container for messages
    - Implement auto-scroll to newest message when added
    - Add WelcomeMessage component for first-time users
    - Create TypingIndicator component for loading state
    - Handle empty state (no messages yet)
    - _Requirements: 7.3, 7.4_

  - [ ]* 5.3 Write unit tests for message components
    - Test MessageBubble rendering for user and assistant roles
    - Test timestamp display
    - Test auto-scroll behavior
    - Test typing indicator display
    - _Requirements: 7.2, 7.3, 7.4_

- [ ] 6. Create ChatInput component
  - [x] 6.1 Implement text input with send button
    - Create auto-expanding textarea (max 4 lines)
    - Add Send button with icon (disabled when empty or loading)
    - Implement Enter to send, Shift+Enter for new line
    - Add input validation and character limit
    - Style with consistent platform design
    - _Requirements: 4.1, 7.5_

  - [ ] 6.2 Add input state management and handlers
    - Connect input value to component state
    - Implement onChange handler with debouncing
    - Implement onSend handler to trigger message submission
    - Disable input during loading state
    - Clear input after successful send
    - _Requirements: 4.2_

  - [ ]* 6.3 Write unit tests for ChatInput
    - Test Enter key sends message
    - Test Shift+Enter adds new line
    - Test send button disabled when empty
    - Test input clearing after send
    - _Requirements: 4.1, 7.5_

- [ ] 7. Checkpoint - Verify basic UI structure
  - Ensure all components render correctly
  - Test expand/collapse animations
  - Verify responsive layout on desktop and mobile
  - Ask the user if questions arise

- [x] 8. Integrate with AI chat API
  - [x] 8.1 Create chatWidgetService for API communication
    - Create service file with sendMessage function
    - Implement POST request to /api/ai/chat/message endpoint
    - Format request with message, conversationHistory, and userContext
    - Parse API response and extract response, suggestions, and actions
    - Include authentication token in requests
    - _Requirements: 9.1, 9.2, 9.6_

  - [x] 8.2 Implement error handling and retry logic
    - Add try-catch error handling for network failures
    - Implement exponential backoff retry (3 attempts: 1s, 2s, 4s)
    - Display appropriate error messages for different error types
    - Add manual retry button for failed messages
    - Show "slow connection" warning after 5 seconds
    - _Requirements: 8.1, 8.2, 8.3, 8.7_

  - [x] 8.3 Connect API service to ChatWidget component
    - Implement sendMessage handler in ChatWidget
    - Add user message to messages array immediately
    - Show typing indicator while waiting for response
    - Add AI response to messages array when received
    - Update quick actions based on API response suggestions
    - Handle loading state throughout the flow
    - _Requirements: 4.2, 4.6, 9.3_

  - [ ]* 8.4 Write unit tests for chatWidgetService
    - Test API request formatting with correct payload
    - Test retry logic with exponential backoff
    - Test error handling for different error types
    - Test response parsing
    - _Requirements: 8.1, 8.2, 9.1, 9.2_

  - [ ]* 8.5 Write integration tests for API flow
    - Test complete message send/receive flow
    - Test error recovery with retry
    - Test timeout handling
    - Test authentication token inclusion
    - _Requirements: 4.2, 8.1, 8.2, 9.6_

- [ ] 9. Implement QuickActions component
  - [ ] 9.1 Create QuickActions component with role-based actions
    - Build QuickActions.tsx with button grid layout
    - Define default quick actions for FARMER role (crop advice, prices, weather, quality)
    - Define default quick actions for BUYER role (sourcing, suppliers, orders, market trends)
    - Render action buttons with icons and labels
    - Implement click handler to send action query
    - _Requirements: 11.1, 11.2, 11.3_

  - [ ] 9.2 Add dynamic quick action updates
    - Update quick actions based on AI response suggestions
    - Maintain context-aware suggestions throughout conversation
    - Limit to 4-6 visible actions at a time
    - _Requirements: 11.4_

  - [ ]* 9.3 Write unit tests for QuickActions
    - Test role-based action rendering
    - Test click handling
    - Test dynamic updates from API responses
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [ ] 10. Set up state management with Zustand
  - [ ] 10.1 Create chatWidgetStore with Zustand
    - Create store file at apps/web/src/store/chatWidgetStore.ts
    - Define store interface with isExpanded, messages, unreadCount, preferences
    - Implement actions: setExpanded, addMessage, clearHistory, setPreferences
    - Add persist middleware for localStorage persistence
    - Configure partialize to persist only messages and preferences
    - _Requirements: 2.6, 2.7, 6.1_

  - [ ] 10.2 Integrate store with ChatWidget component
    - Replace local state with Zustand store
    - Use store actions for state updates
    - Ensure state persists across page navigations
    - Test state recovery after page refresh
    - _Requirements: 2.6, 2.7_

  - [ ]* 10.3 Write unit tests for chatWidgetStore
    - Test state initialization
    - Test all store actions
    - Test persistence configuration
    - _Requirements: 2.6, 6.1_

- [ ] 11. Implement chat history persistence
  - [ ] 11.1 Create history loading functionality
    - Load last 20 messages from store on widget open
    - Display loading state while fetching history
    - Handle empty history gracefully
    - _Requirements: 6.2_

  - [ ] 11.2 Implement message persistence
    - Save each message to store immediately after send/receive
    - Ensure messages persist across sessions
    - Implement 90-day retention policy (cleanup old messages)
    - _Requirements: 6.1, 6.3, 6.4_

  - [ ] 11.3 Add clear history functionality
    - Create "Clear History" button in chat header menu
    - Show confirmation dialog before clearing
    - Clear all messages from store and UI
    - Reset to welcome message after clearing
    - _Requirements: 6.5, 6.6_

  - [ ]* 11.4 Write unit tests for history management
    - Test history loading
    - Test message persistence
    - Test clear history with confirmation
    - Test retention policy
    - _Requirements: 6.2, 6.4, 6.5, 6.6_

- [ ] 12. Checkpoint - Verify core functionality
  - Test complete conversation flow (send message, receive response)
  - Verify history persistence across page refresh
  - Test quick actions functionality
  - Verify error handling and retry logic
  - Ask the user if questions arise

- [ ] 13. Implement role-based context awareness
  - [ ] 13.1 Build user context provider
    - Extract user role, name, location from useAuthStore
    - Create context object with userId, name, userType, location
    - Detect current page/route for page-specific context
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6_

  - [ ] 13.2 Include context in API requests
    - Add userContext to all API requests
    - Include current page information
    - Pass user's products/listings for farmers
    - _Requirements: 3.5, 9.2_

  - [ ] 13.3 Implement welcome message personalization
    - Display user's name in welcome message
    - Show role-specific greeting (farmer vs buyer)
    - Include location-based context when available
    - _Requirements: 3.3_

  - [ ]* 13.4 Write unit tests for context awareness
    - Test context building for different user roles
    - Test page detection
    - Test context inclusion in API requests
    - _Requirements: 3.1, 3.2, 3.6, 9.2_

- [ ] 14. Add multi-language support
  - [ ] 14.1 Create translation keys for chat widget
    - Add chat_widget section to translation files (en, hi, mr)
    - Define keys: title, placeholder, send, clear_history, welcome_message, etc.
    - Add role-specific quick action labels
    - Add error messages in all languages
    - _Requirements: 4.1_

  - [ ] 14.2 Integrate i18n with components
    - Use useTranslation hook in all components
    - Replace hardcoded strings with t() function calls
    - Ensure language switching updates widget text
    - Test all three languages (English, Hindi, Marathi)
    - _Requirements: 4.1_

  - [ ]* 14.3 Write tests for i18n integration
    - Test translation key usage
    - Test language switching
    - _Requirements: 4.1_

- [ ] 15. Implement mobile responsiveness
  - [ ] 15.1 Add responsive breakpoints and full-screen mode
    - Implement media queries for mobile (<768px), tablet, desktop
    - Make ChatPanel full-screen on mobile (100vw x 100vh)
    - Adjust FloatingButton size and position for mobile (48px, 16px margins)
    - Add slide-up animation for mobile panel
    - _Requirements: 10.1, 10.2_

  - [ ] 15.2 Implement mobile keyboard handling
    - Detect keyboard open/close events
    - Resize ChatPanel to remain visible above keyboard
    - Auto-scroll to keep input visible
    - Prevent body scroll when panel is open
    - _Requirements: 10.4_

  - [ ] 15.3 Add touch gesture support
    - Implement swipe-down gesture to close panel on mobile
    - Add smooth scrolling with momentum for message list
    - Ensure touch targets meet 48px minimum
    - Disable pull-to-refresh in chat area
    - _Requirements: 10.3, 10.6_

  - [ ]* 15.4 Write tests for mobile responsiveness
    - Test full-screen mode on mobile viewport
    - Test keyboard handling
    - Test touch gestures
    - _Requirements: 10.1, 10.2, 10.4, 10.6_

- [ ] 16. Add voice input for mobile
  - [ ] 16.1 Implement voice input button and functionality
    - Add microphone button to ChatInput on mobile devices
    - Request browser speech recognition permissions
    - Implement speech-to-text using Web Speech API
    - Show visual feedback during recording
    - Insert transcribed text into input field
    - Provide fallback message if API unavailable
    - _Requirements: 10.5_

  - [ ]* 16.2 Write tests for voice input
    - Test permission handling
    - Test speech recognition integration
    - Test fallback behavior
    - _Requirements: 10.5_

- [ ] 17. Implement proactive notifications
  - [ ] 17.1 Create ProactiveNotification component
    - Build notification bubble that appears above FloatingButton
    - Add dismiss button
    - Add accept button that opens widget with context
    - Implement auto-dismiss after 10 seconds
    - Style consistently with platform design
    - _Requirements: 12.1, 12.2_

  - [ ] 17.2 Implement notification trigger logic
    - Detect user inactivity (30 seconds on page without interaction)
    - Detect error events on platform
    - Detect significant action completions
    - Throttle notifications to max once per 10 minutes
    - Respect user preference setting (enable/disable)
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

  - [ ] 17.3 Add notification preferences
    - Add proactiveNotificationsEnabled to user preferences
    - Create settings UI to toggle notifications
    - Persist preference in store
    - _Requirements: 12.5, 12.6_

  - [ ]* 17.4 Write tests for proactive notifications
    - Test notification triggering logic
    - Test throttling behavior
    - Test auto-dismiss
    - Test preference handling
    - _Requirements: 12.1, 12.3, 12.4, 12.5, 12.6_

- [ ] 18. Checkpoint - Verify advanced features
  - Test mobile full-screen mode and gestures
  - Test voice input on mobile devices
  - Test proactive notifications
  - Verify multi-language support
  - Ask the user if questions arise

- [ ] 19. Integrate with existing platform components
  - [x] 19.1 Add ChatWidget to DashboardLayout
    - Import ChatWidget in DashboardLayout.tsx
    - Render ChatWidget at the end of layout (after children)
    - Ensure widget appears on all dashboard pages
    - Test z-index doesn't conflict with modals or dropdowns
    - _Requirements: 1.1_

  - [ ] 19.2 Add ChatWidget to authenticated pages
    - Add ChatWidget to buyer dashboard layout
    - Add ChatWidget to profile page
    - Ensure widget doesn't appear on login/register pages
    - Test widget state persists across page navigations
    - _Requirements: 1.1, 2.7_

  - [ ] 19.3 Coordinate with existing notification system
    - Ensure ChatWidget doesn't conflict with LiveNotificationBell
    - Share unread count logic if applicable
    - Test both components work together
    - _Requirements: 1.7_

  - [ ]* 19.4 Write integration tests for platform integration
    - Test widget appears on all authenticated pages
    - Test widget hidden on unauthenticated pages
    - Test state persistence across navigation
    - _Requirements: 1.1, 1.3, 2.7_

- [ ] 20. Implement performance optimizations
  - [ ] 20.1 Add code splitting and lazy loading
    - Lazy load ChatWidget component using dynamic import
    - Set ssr: false for client-only rendering
    - Add loading placeholder (null or skeleton)
    - _Requirements: 8.4_

  - [ ] 20.2 Optimize rendering with memoization
    - Memoize expensive computations (message sorting, filtering)
    - Memoize callback functions with useCallback
    - Memoize child components with React.memo
    - _Requirements: 8.5_

  - [ ] 20.3 Implement virtual scrolling for long histories
    - Add @tanstack/react-virtual for message list
    - Configure virtualizer with estimated message size
    - Test with 100+ messages
    - _Requirements: 8.5_

  - [ ]* 20.4 Write performance tests
    - Test widget loads within 500ms
    - Test memory usage under 5MB when minimized
    - Test no memory leaks after multiple open/close cycles
    - _Requirements: 8.4, 8.5_

- [ ] 21. Add accessibility features
  - [ ] 21.1 Implement keyboard navigation
    - Add Tab navigation through all interactive elements
    - Add Escape key to close panel
    - Add proper focus management (trap focus in panel when open)
    - Add visible focus indicators
    - _Requirements: 7.5_

  - [ ] 21.2 Add ARIA labels and roles
    - Add role="dialog" to ChatPanel
    - Add aria-label to all buttons
    - Add aria-live region for new messages
    - Add aria-expanded to FloatingButton
    - Add proper heading hierarchy
    - _Requirements: 7.5_

  - [ ] 21.3 Ensure color contrast and reduced motion
    - Verify all text meets WCAG AA contrast ratios (4.5:1)
    - Add prefers-reduced-motion media query support
    - Disable animations for users with motion sensitivity
    - _Requirements: 7.7_

  - [ ]* 21.4 Write accessibility tests
    - Test keyboard navigation
    - Test screen reader compatibility with jest-axe
    - Test focus management
    - Test color contrast ratios
    - _Requirements: 7.5, 7.7_

- [ ] 22. Add analytics and logging
  - [ ] 22.1 Implement interaction tracking
    - Log widget open/close events
    - Log messages sent and received
    - Log quick action clicks
    - Log proactive notification interactions
    - Track error occurrences
    - _Requirements: 9.7_

  - [ ] 22.2 Add performance monitoring
    - Track widget load time
    - Track API response times
    - Track animation frame rates
    - Log performance metrics to analytics service
    - _Requirements: 9.7_

  - [ ]* 22.3 Write tests for analytics
    - Test event logging
    - Test metric tracking
    - _Requirements: 9.7_

- [ ] 23. Implement graceful degradation and fallbacks
  - [x] 23.1 Add fallback responses for service unavailability
    - Define pre-written helpful responses for common questions
    - Show fallback when AI service returns 500/503
    - Display service status in header
    - Provide link to help documentation
    - _Requirements: 8.1, 5.7_

  - [ ] 23.2 Handle edge cases and error states
    - Handle empty response from AI
    - Handle malformed API responses
    - Handle network timeout (>30 seconds)
    - Handle rate limiting (429 errors)
    - _Requirements: 8.1, 8.2_

  - [ ]* 23.3 Write tests for error scenarios
    - Test all error types and fallbacks
    - Test graceful degradation
    - _Requirements: 8.1, 8.2_

- [ ] 24. Checkpoint - Verify production readiness
  - Test all features end-to-end
  - Verify performance meets requirements
  - Verify accessibility compliance
  - Test error handling and edge cases
  - Ask the user if questions arise

- [ ] 25. Write comprehensive test suite
  - [ ]* 25.1 Write unit tests for all components
    - Test ChatWidget, FloatingButton, ChatPanel, MessageBubble, ChatInput, QuickActions
    - Test all hooks and services
    - Achieve 80%+ code coverage
    - _Requirements: All_

  - [ ]* 25.2 Write integration tests for user flows
    - Test basic conversation flow
    - Test history management flow
    - Test quick actions flow
    - Test error recovery flow
    - Test mobile interaction flow
    - _Requirements: All_

  - [ ]* 25.3 Write E2E tests with Playwright
    - Test farmer conversation flow
    - Test buyer conversation flow
    - Test mobile experience
    - Test slow network handling
    - Test cross-browser compatibility
    - _Requirements: All_

  - [ ]* 25.4 Run visual regression tests
    - Capture screenshots of all widget states
    - Test on multiple viewports
    - Verify no unintended visual changes
    - _Requirements: 7.1, 7.2, 7.3_

- [ ] 26. Create documentation
  - [ ] 26.1 Write component documentation
    - Document all component props and usage
    - Add JSDoc comments to all public functions
    - Create usage examples
    - _Requirements: All_

  - [ ] 26.2 Write integration guide
    - Document how to add widget to new pages
    - Document API integration requirements
    - Document customization options
    - _Requirements: 9.1, 9.2_

- [ ] 27. Final checkpoint and deployment preparation
  - Run full test suite and verify all tests pass
  - Perform manual testing on all devices and browsers
  - Verify all acceptance criteria are met
  - Review code for security issues
  - Ensure all documentation is complete
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and user feedback
- The implementation uses TypeScript throughout
- All components integrate with existing platform infrastructure (auth, i18n, API, styling)
- Mobile-first approach ensures excellent experience on all devices
- Comprehensive testing strategy covers unit, integration, E2E, and accessibility tests
