'use client';

import { useEffect, useState } from 'react';
import syncManager from '@/services/offlineSyncService';

/**
 * Hook for Service Worker registration and PWA setup
 */

interface ServiceWorkerStatus {
  isSupported: boolean;
  isRegistered: boolean;
  isOnline: boolean;
  updateAvailable: boolean;
  pendingUpdates: number;
}

export function useServiceWorker() {
  const [status, setStatus] = useState<ServiceWorkerStatus>({
    isSupported: false,
    isRegistered: false,
    isOnline: true,
    updateAvailable: false,
    pendingUpdates: 0
  });

  useEffect(() => {
    // Check browser support
    const isSupported = 'serviceWorker' in navigator;
    setStatus(prev => ({ ...prev, isSupported }));

    if (!isSupported) {
      console.warn('Service Workers are not supported in this browser');
      return;
    }

    // Register service worker
    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none'
        });

        console.log('✅ Service Worker registered', registration);
        setStatus(prev => ({ ...prev, isRegistered: true }));

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('🔄 New Service Worker update available');
                setStatus(prev => ({ ...prev, updateAvailable: true }));
              }
            });
          }
        });

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute

      } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
      }
    };

    registerServiceWorker();

    // Set up offline status listener
    const unsubscribe = syncManager.subscribe((event) => {
      if (event.type === 'sync-start' || event.type === 'sync-complete') {
        setStatus(prev => ({ ...prev, isOnline: syncManager.getIsOnline() }));
      }
    });

    // Handle online/offline events
    const handleOnline = () => {
      setStatus(prev => ({ ...prev, isOnline: true }));
    };
    const handleOffline = () => {
      setStatus(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /**
   * Install pending updates (reload to activate new SW)
   */
  const installUpdates = () => {
    if (status.updateAvailable) {
      window.location.reload();
    }
  };

  /**
   * Unregister service worker
   */
  const unregister = async () => {
    if (!status.isRegistered) return;
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.unregister();
        setStatus(prev => ({ ...prev, isRegistered: false }));
        console.log('🗑️ Service Worker unregistered');
      }
    } catch (error) {
      console.error('Failed to unregister Service Worker:', error);
    }
  };

  return {
    ...status,
    installUpdates,
    unregister
  };
}

/**
 * Hook for checking and managing PWA installation
 */
export function usePWAInstall() {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  let deferredPrompt: any = null;

  useEffect(() => {
    // Check if PWA is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      deferredPrompt = event;
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setCanInstall(false);
      console.log('✅ PWA installed successfully');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  /**
   * Trigger PWA installation
   */
  const installPWA = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to PWA install prompt: ${outcome}`);
    deferredPrompt = null;
    setCanInstall(false);
  };

  return {
    canInstall,
    isInstalled,
    installPWA
  };
}
