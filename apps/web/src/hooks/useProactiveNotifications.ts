import { useState, useEffect, useCallback, useRef } from 'react';
import { useChatWidgetStore } from '@/store/chatWidgetStore';

interface UseProactiveNotificationsOptions {
  inactivityThreshold?: number; // milliseconds
  throttleInterval?: number; // milliseconds
  enabled?: boolean;
}

interface ProactiveNotification {
  message: string;
  context?: string;
}

export function useProactiveNotifications({
  inactivityThreshold = 30000, // 30 seconds
  throttleInterval = 600000, // 10 minutes
  enabled = true,
}: UseProactiveNotificationsOptions = {}) {
  const [notification, setNotification] = useState<ProactiveNotification | null>(null);
  const lastNotificationTime = useRef<number>(0);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const lastActivityTime = useRef<number>(Date.now());
  
  const preferences = useChatWidgetStore((state) => state.preferences);
  const isExpanded = useChatWidgetStore((state) => state.isExpanded);

  const isThrottled = useCallback(() => {
    const now = Date.now();
    return now - lastNotificationTime.current < throttleInterval;
  }, [throttleInterval]);

  const showNotification = useCallback((message: string, context?: string) => {
    if (!enabled || !preferences.proactiveNotificationsEnabled || isExpanded || isThrottled()) {
      return;
    }

    setNotification({ message, context });
    lastNotificationTime.current = Date.now();
  }, [enabled, preferences.proactiveNotificationsEnabled, isExpanded, isThrottled]);

  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const resetInactivityTimer = useCallback(() => {
    lastActivityTime.current = Date.now();
    
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    if (!enabled || !preferences.proactiveNotificationsEnabled || isExpanded) {
      return;
    }

    inactivityTimer.current = setTimeout(() => {
      const messages = getContextualMessages();
      if (messages.length > 0) {
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        showNotification(randomMessage);
      }
    }, inactivityThreshold);
  }, [enabled, preferences.proactiveNotificationsEnabled, isExpanded, inactivityThreshold, showNotification]);

  // Track user activity
  useEffect(() => {
    const handleActivity = () => {
      resetInactivityTimer();
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    resetInactivityTimer();

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, [resetInactivityTimer]);

  // Clear notification when widget is expanded
  useEffect(() => {
    if (isExpanded) {
      dismissNotification();
    }
  }, [isExpanded, dismissNotification]);

  return {
    notification,
    showNotification,
    dismissNotification,
  };
}

// Helper function to get contextual messages based on current page
function getContextualMessages(): string[] {
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  
  if (path.includes('/dashboard')) {
    return [
      'Need help navigating your dashboard?',
      'Want to learn about new features?',
      'Have questions about your products or orders?',
    ];
  }
  
  if (path.includes('/products')) {
    return [
      'Need help creating a product listing?',
      'Want tips on pricing your products?',
      'Questions about product quality standards?',
    ];
  }
  
  if (path.includes('/orders')) {
    return [
      'Need help managing your orders?',
      'Questions about order fulfillment?',
      'Want to track your shipments?',
    ];
  }
  
  if (path.includes('/profile')) {
    return [
      'Need help updating your profile?',
      'Questions about account settings?',
      'Want to improve your seller rating?',
    ];
  }
  
  // Default messages
  return [
    'Need help with anything?',
    'Have questions about the platform?',
    'Want to learn about farming best practices?',
    'Looking for market insights?',
  ];
}
