'use client';

import { db } from '@/lib/db';

/**
 * Offline Sync Manager
 * Handles syncing offline data when connection is restored
 */

interface SyncEvent {
  type: 'sync-start' | 'sync-progress' | 'sync-complete' | 'sync-error';
  itemsRemaining?: number;
  totalItems?: number;
  error?: string;
}

class OfflineSyncManager {
  private isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private syncInProgress = false;
  private listeners: Set<(event: SyncEvent) => void> = new Set();
  private syncInterval: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleOnline());
      window.addEventListener('offline', () => this.handleOffline());
    }
  }

  /**
   * Subscribe to sync events
   */
  subscribe(listener: (event: SyncEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Emit sync event to all listeners
   */
  private emit(event: SyncEvent): void {
    this.listeners.forEach(listener => listener(event));
  }

  /**
   * Handle online event
   */
  private handleOnline(): void {
    console.log('📶 Connection restored');
    this.isOnline = true;
    this.startSync();
  }

  /**
   * Handle offline event
   */
  private handleOffline(): void {
    console.log('📡 Connection lost - switching to offline mode');
    this.isOnline = false;
  }

  /**
   * Check if online
   */
  getIsOnline(): boolean {
    return this.isOnline;
  }

  /**
   * Start syncing offline data
   */
  async startSync(): Promise<void> {
    if (this.syncInProgress || !this.isOnline) {
      return;
    }

    this.syncInProgress = true;
    this.emit({ type: 'sync-start' });

    try {
      const pendingRequests = await db.getPendingRequests();
      const total = pendingRequests.length;

      console.log(`🔄 Starting sync: ${total} pending requests`);

      for (let i = 0; i < pendingRequests.length; i++) {
        const request = pendingRequests[i];

        try {
          const response = await this.executePendingRequest(request);

          if (response.ok) {
            // Request succeeded - remove from queue
            if (request.id) {
              await db.removePendingRequest(request.id);
            }
            console.log(`✅ Synced: ${request.endpoint}`);
          } else if (response.status >= 500) {
            // Server error - retry later
            if (request.id && request.retryCount < 3) {
              await db.incrementRetryCount(request.id);
            }
          } else {
            // Client error - remove from queue
            if (request.id) {
              await db.removePendingRequest(request.id);
            }
          }
        } catch (error) {
          console.error(`❌ Sync error for ${request.endpoint}:`, error);
          if (request.id && request.retryCount < 3) {
            await db.incrementRetryCount(request.id);
          }
        }

        // Emit progress
        this.emit({
          type: 'sync-progress',
          itemsRemaining: total - i - 1,
          totalItems: total
        });
      }

      // Update sync state
      await db.updateOfflineState({
        isOnline: true,
        lastSyncTime: Date.now(),
        pendingChanges: 0
      });

      this.emit({ type: 'sync-complete' });
      console.log('✨ Sync complete');
    } catch (error) {
      this.emit({
        type: 'sync-error',
        error: error instanceof Error ? error.message : 'Unknown sync error'
      });
      console.error('Sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Execute a pending request
   */
  private async executePendingRequest(request: any): Promise<Response> {
    const options: RequestInit = {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (request.data && (request.method === 'POST' || request.method === 'PUT')) {
      options.body = JSON.stringify(request.data);
    }

    return fetch(request.endpoint, options);
  }

  /**
   * Add an offline request
   */
  async addOfflineRequest(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: Record<string, any>,
    priority: 'low' | 'normal' | 'high' = 'normal'
  ): Promise<number> {
    const requestId = await db.addPendingRequest({
      endpoint,
      method,
      data,
      priority,
      timestamp: Date.now(),
      retryCount: 0
    });

    // Update pending changes count
    const state = await db.getOfflineState();
    await db.updateOfflineState({
      pendingChanges: (state?.pendingChanges || 0) + 1
    });

    return requestId;
  }

  /**
   * Enable auto-sync (every 30 seconds when online)
   */
  enableAutoSync(interval: number = 30000): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      if (this.isOnline && !this.syncInProgress) {
        this.startSync();
      }
    }, interval);

    console.log('🔄 Auto-sync enabled');
  }

  /**
   * Disable auto-sync
   */
  disableAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('🔄 Auto-sync disabled');
    }
  }

  /**
   * Get sync statistics
   */
  async getSyncStats() {
    return db.getSyncStats();
  }
}

// Create singleton instance
const syncManager = new OfflineSyncManager();

export default syncManager;
