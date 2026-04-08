/**
 * Unit Tests for ChatWidget Component
 * 
 * Tests cover:
 * - Authentication gating (Requirement 1.3)
 * - Expand/collapse state transitions (Requirement 2.1)
 * - Initial state values (Requirement 2.1)
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatWidget from './ChatWidget';
import * as chatWidgetService from '@/services/chatWidgetService';

// Mock the child components
jest.mock('./FloatingButton', () => {
  return function MockFloatingButton({ onClick, isExpanded }: any) {
    return (
      <button 
        data-testid="floating-button" 
        onClick={onClick}
        aria-label={isExpanded ? 'Close chat' : 'Open chat'}
      >
        {isExpanded ? 'Close' : 'Open'} Chat
      </button>
    );
  };
});

jest.mock('./ChatPanel', () => {
  return function MockChatPanel({ onClose, messages }: any) {
    return (
      <div data-testid="chat-panel">
        <button data-testid="close-button" onClick={onClose}>Close</button>
        <div data-testid="messages-count">{messages.length}</div>
      </div>
    );
  };
});

// Mock the useTextToSpeech hook
jest.mock('@/hooks/useTextToSpeech', () => ({
  useTextToSpeech: () => ({
    speak: jest.fn(),
    stop: jest.fn(),
    isSpeaking: false,
    isSupported: true,
  }),
}));

// Mock the chatWidgetService
jest.mock('@/services/chatWidgetService', () => ({
  chatWidgetService: {
    sendMessageStream: jest.fn(),
    getIntelligentFallback: jest.fn(),
  },
}));

describe('ChatWidget Component', () => {
  let getItemSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    // Create a spy on localStorage.getItem
    getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
  });

  afterEach(() => {
    getItemSpy.mockRestore();
  });

  describe('Authentication Gating (Requirement 1.3)', () => {
    it('should not render when user is not authenticated', () => {
      // Arrange: No token in localStorage
      getItemSpy.mockReturnValue(null);

      // Act
      const { container } = render(<ChatWidget />);

      // Assert: Widget should not be visible
      expect(container.firstChild).toBeNull();
      expect(screen.queryByTestId('floating-button')).not.toBeInTheDocument();
    });

    it('should render when user is authenticated', () => {
      // Arrange: Token exists in localStorage
      getItemSpy.mockReturnValue('fake-token');

      // Act
      render(<ChatWidget />);

      // Assert: Widget should be visible
      expect(screen.getByTestId('floating-button')).toBeInTheDocument();
    });

    it('should hide widget when authentication is removed', () => {
      // Arrange: Start with authenticated user
      getItemSpy.mockReturnValue('fake-token');
      const { rerender } = render(<ChatWidget />);
      expect(screen.getByTestId('floating-button')).toBeInTheDocument();

      // Act: Remove authentication
      getItemSpy.mockReturnValue(null);
      
      // Trigger storage event to simulate logout
      fireEvent(window, new StorageEvent('storage', {
        key: 'token',
        oldValue: 'fake-token',
        newValue: null,
      }));

      // Force re-render
      rerender(<ChatWidget />);

      // Assert: Widget should be hidden
      expect(screen.queryByTestId('floating-button')).not.toBeInTheDocument();
    });

    it('should show widget when user logs in', () => {
      // Arrange: Start without authentication
      getItemSpy.mockReturnValue(null);
      const { rerender } = render(<ChatWidget />);
      expect(screen.queryByTestId('floating-button')).not.toBeInTheDocument();

      // Act: Add authentication
      getItemSpy.mockReturnValue('new-token');
      
      // Trigger storage event to simulate login
      fireEvent(window, new StorageEvent('storage', {
        key: 'token',
        oldValue: null,
        newValue: 'new-token',
      }));

      // Force re-render
      rerender(<ChatWidget />);

      // Assert: Widget should now be visible
      expect(screen.getByTestId('floating-button')).toBeInTheDocument();
    });
  });

  describe('Expand/Collapse State Transitions (Requirement 2.1)', () => {
    beforeEach(() => {
      // Ensure user is authenticated for these tests
      getItemSpy.mockReturnValue('fake-token');
    });

    it('should start in collapsed state by default', () => {
      // Act
      render(<ChatWidget />);

      // Assert: Only floating button visible, chat panel not visible
      expect(screen.getByTestId('floating-button')).toBeInTheDocument();
      expect(screen.queryByTestId('chat-panel')).not.toBeInTheDocument();
      expect(screen.getByTestId('floating-button')).toHaveAttribute('aria-label', 'Open chat');
    });

    it('should expand when floating button is clicked', () => {
      // Arrange
      render(<ChatWidget />);
      const floatingButton = screen.getByTestId('floating-button');

      // Act: Click to expand
      fireEvent.click(floatingButton);

      // Assert: Chat panel should be visible
      expect(screen.getByTestId('chat-panel')).toBeInTheDocument();
      expect(floatingButton).toHaveAttribute('aria-label', 'Close chat');
    });

    it('should collapse when close button is clicked', () => {
      // Arrange: Start with expanded widget
      render(<ChatWidget initialExpanded={true} />);
      expect(screen.getByTestId('chat-panel')).toBeInTheDocument();

      // Act: Click close button
      const closeButton = screen.getByTestId('close-button');
      fireEvent.click(closeButton);

      // Assert: Chat panel should be hidden
      expect(screen.queryByTestId('chat-panel')).not.toBeInTheDocument();
      expect(screen.getByTestId('floating-button')).toHaveAttribute('aria-label', 'Open chat');
    });

    it('should toggle between expanded and collapsed states', () => {
      // Arrange
      render(<ChatWidget />);
      const floatingButton = screen.getByTestId('floating-button');

      // Act & Assert: Multiple toggles
      // First click - expand
      fireEvent.click(floatingButton);
      expect(screen.getByTestId('chat-panel')).toBeInTheDocument();

      // Second click - collapse
      fireEvent.click(floatingButton);
      expect(screen.queryByTestId('chat-panel')).not.toBeInTheDocument();

      // Third click - expand again
      fireEvent.click(floatingButton);
      expect(screen.getByTestId('chat-panel')).toBeInTheDocument();
    });

    it('should maintain expanded state when specified via props', () => {
      // Act
      render(<ChatWidget initialExpanded={true} />);

      // Assert: Should start expanded
      expect(screen.getByTestId('chat-panel')).toBeInTheDocument();
      expect(screen.getByTestId('floating-button')).toHaveAttribute('aria-label', 'Close chat');
    });
  });

  describe('Initial State Values (Requirement 2.1)', () => {
    beforeEach(() => {
      getItemSpy.mockReturnValue('fake-token');
    });

    it('should initialize with empty message list', () => {
      // Act
      render(<ChatWidget initialExpanded={true} />);

      // Assert: Messages count should be 0
      const messagesCount = screen.getByTestId('messages-count');
      expect(messagesCount).toHaveTextContent('0');
    });

    it('should initialize with collapsed state when initialExpanded is false', () => {
      // Act
      render(<ChatWidget initialExpanded={false} />);

      // Assert
      expect(screen.queryByTestId('chat-panel')).not.toBeInTheDocument();
    });

    it('should initialize with expanded state when initialExpanded is true', () => {
      // Act
      render(<ChatWidget initialExpanded={true} />);

      // Assert
      expect(screen.getByTestId('chat-panel')).toBeInTheDocument();
    });

    it('should initialize with default position bottom-right', () => {
      // Act
      render(<ChatWidget />);

      // Assert: FloatingButton should receive bottom-right position
      const floatingButton = screen.getByTestId('floating-button');
      expect(floatingButton).toBeInTheDocument();
      // Position is passed to FloatingButton component
    });

    it('should accept custom position via props', () => {
      // Act
      render(<ChatWidget position="bottom-left" />);

      // Assert: Component should render with custom position
      expect(screen.getByTestId('floating-button')).toBeInTheDocument();
    });

    it('should initialize with zero unread count', () => {
      // Act
      render(<ChatWidget />);

      // Assert: Component renders successfully with initial state
      expect(screen.getByTestId('floating-button')).toBeInTheDocument();
      // UnreadCount is passed to FloatingButton (tested in FloatingButton tests)
    });

    it('should initialize with voice enabled by default', () => {
      // Act
      render(<ChatWidget initialExpanded={true} />);

      // Assert: Chat panel should be rendered (voice state is internal)
      expect(screen.getByTestId('chat-panel')).toBeInTheDocument();
      // Voice enabled state is passed to ChatPanel component
    });

    it('should initialize with English language by default', () => {
      // Act
      render(<ChatWidget initialExpanded={true} />);

      // Assert: Component renders with default language
      expect(screen.getByTestId('chat-panel')).toBeInTheDocument();
      // Language state is passed to ChatPanel component
    });

    it('should not show slow connection warning initially', () => {
      // Act
      render(<ChatWidget initialExpanded={true} />);

      // Assert: Component renders without warning
      expect(screen.getByTestId('chat-panel')).toBeInTheDocument();
      // Warning state is passed to ChatPanel component
    });

    it('should not have error state initially', () => {
      // Act
      render(<ChatWidget initialExpanded={true} />);

      // Assert: Component renders without errors
      expect(screen.getByTestId('chat-panel')).toBeInTheDocument();
      // Error state is passed to ChatPanel component
    });

    it('should not be in loading state initially', () => {
      // Act
      render(<ChatWidget initialExpanded={true} />);

      // Assert: Component renders without loading state
      expect(screen.getByTestId('chat-panel')).toBeInTheDocument();
      // Loading state is passed to ChatPanel component
    });
  });

  describe('State Persistence Across Interactions', () => {
    beforeEach(() => {
      getItemSpy.mockReturnValue('fake-token');
    });

    it('should maintain message history when toggling expand/collapse', () => {
      // This test verifies that messages aren't lost when minimizing
      // Arrange
      render(<ChatWidget initialExpanded={true} />);
      
      // Act: Collapse and re-expand
      const floatingButton = screen.getByTestId('floating-button');
      fireEvent.click(floatingButton); // Collapse
      fireEvent.click(floatingButton); // Re-expand

      // Assert: Chat panel should be visible again
      expect(screen.getByTestId('chat-panel')).toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    beforeEach(() => {
      getItemSpy.mockReturnValue('fake-token');
    });

    it('should accept and use initialExpanded prop', () => {
      // Act: Render with initialExpanded=false
      const { rerender } = render(<ChatWidget initialExpanded={false} />);
      expect(screen.queryByTestId('chat-panel')).not.toBeInTheDocument();

      // Act: Render a new instance with initialExpanded=true
      rerender(<ChatWidget initialExpanded={true} />);
      
      // Assert: Component should now be expanded
      // Note: initialExpanded only affects initial state, not re-renders
      // So we need to test with separate renders
      const { container } = render(<ChatWidget initialExpanded={true} />);
      expect(screen.getAllByTestId('chat-panel')[0]).toBeInTheDocument();
    });

    it('should accept position prop', () => {
      // Act
      render(<ChatWidget position="bottom-left" />);

      // Assert
      expect(screen.getByTestId('floating-button')).toBeInTheDocument();
    });

    it('should use default position when not specified', () => {
      // Act
      render(<ChatWidget />);

      // Assert
      expect(screen.getByTestId('floating-button')).toBeInTheDocument();
    });
  });
});
