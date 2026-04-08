'use client';

import Dexie, { Table } from 'dexie';

/**
 * Offline Database Schema for ODOP Connect
 * Provides local caching and offline-first functionality
 */

interface CachedProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  qualityScore: number;
  synced?: boolean;
  lastUpdated: number;
}

interface CachedOrder {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  status: string;
  synced?: boolean;
  createdAt: number;
  updatedAt: number;
}

interface CachedMessage {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  text: string;
  synced?: boolean;
  createdAt: number;
}

interface PendingRequest {
  id?: number;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: Record<string, any>;
  timestamp: number;
  retryCount: number;
  priority: 'low' | 'normal' | 'high';
}

interface OfflineState {
  id?: number;
  isOnline: boolean;
  lastSyncTime: number;
  pendingChanges: number;
}

export class OdopDatabase extends Dexie {
  products!: Table<CachedProduct>;
  orders!: Table<CachedOrder>;
  messages!: Table<CachedMessage>;
  pendingRequests!: Table<PendingRequest>;
  offlineState!: Table<OfflineState>;

  constructor() {
    super('odop-connect-db');
    this.version(1).stores({
      products: 'id, category, lastUpdated',
      orders: 'id, orderId, status, createdAt',
      messages: 'id, conversationId, senderId, createdAt',
      pendingRequests: '++id, endpoint, priority, timestamp',
      offlineState: 'id'
    });
  }

  /**
   * Cache a product locally
   */
  async cacheProduct(product: CachedProduct): Promise<void> {
    product.lastUpdated = Date.now();
    product.synced = false;
    await this.products.put(product);
  }

  /**
   * Get cached product by ID
   */
  async getProduct(id: string): Promise<CachedProduct | undefined> {
    return this.products.get(id);
  }

  /**
   * Get all cached products
   */
  async getAllProducts(category?: string): Promise<CachedProduct[]> {
    if (category) {
      return this.products.where('category').equals(category).toArray();
    }
    return this.products.toArray();
  }

  /**
   * Cache an order
   */
  async cacheOrder(order: CachedOrder): Promise<void> {
    order.synced = false;
    await this.orders.put(order);
  }

  /**
   * Get orders by status
   */
  async getOrdersByStatus(status: string): Promise<CachedOrder[]> {
    return this.orders.where('status').equals(status).toArray();
  }

  /**
   * Get all unsynced orders
   */
  async getUnsyncedOrders(): Promise<CachedOrder[]> {
    return this.orders.where('synced').equals(false).toArray();
  }

  /**
   * Cache a message
   */
  async cacheMessage(message: CachedMessage): Promise<void> {
    message.synced = false;
    await this.messages.put(message);
  }

  /**
   * Get messages for a conversation
   */
  async getConversationMessages(conversationId: string): Promise<CachedMessage[]> {
    return this.messages
      .where('conversationId')
      .equals(conversationId)
      .toArray();
  }

  /**
   * Add a pending API request for sync
   */
  async addPendingRequest(request: PendingRequest): Promise<number> {
    request.timestamp = Date.now();
    request.retryCount = 0;
    request.priority = request.priority || 'normal';
    return this.pendingRequests.add(request);
  }

  /**
   * Get pending requests sorted by priority
   */
  async getPendingRequests(limit?: number): Promise<PendingRequest[]> {
    let query = this.pendingRequests;
    const requests = await query.toArray();
    
    // Sort by priority and timestamp
    const priorityOrder = { high: 3, normal: 2, low: 1 };
    requests.sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return a.timestamp - b.timestamp;
    });

    return limit ? requests.slice(0, limit) : requests;
  }

  /**
   * Remove pending request after successful sync
   */
  async removePendingRequest(id: number): Promise<void> {
    await this.pendingRequests.delete(id);
  }

  /**
   * Increment retry count for a request
   */
  async incrementRetryCount(id: number): Promise<void> {
    const request = await this.pendingRequests.get(id);
    if (request) {
      request.retryCount += 1;
      await this.pendingRequests.put(request);
    }
  }

  /**
   * Get offline state
   */
  async getOfflineState(): Promise<OfflineState | undefined> {
    return this.offlineState.get(1);
  }

  /**
   * Update offline state
   */
  async updateOfflineState(state: Partial<OfflineState>): Promise<void> {
    const current = await this.offlineState.get(1) || { id: 1, isOnline: true, lastSyncTime: 0, pendingChanges: 0 };
    await this.offlineState.put({ ...current, ...state });
  }

  /**
   * Clear all offline data (when user logs out)
   */
  async clearOfflineData(): Promise<void> {
    await Promise.all([
      this.products.clear(),
      this.orders.clear(),
      this.messages.clear(),
      this.pendingRequests.clear()
    ]);
  }

  /**
   * Get sync statistics
   */
  async getSyncStats(): Promise<{
    totalProducts: number;
    totalOrders: number;
    totalMessages: number;
    pendingRequests: number;
    unsyncedItems: number;
  }> {
    const [totalProducts, totalOrders, totalMessages, pendingRequests] = await Promise.all([
      this.products.count(),
      this.orders.count(),
      this.messages.count(),
      this.pendingRequests.count()
    ]);

    const unsyncedOrders = await this.getUnsyncedOrders();
    const unsyncedItems = unsyncedOrders.length;

    return {
      totalProducts,
      totalOrders,
      totalMessages,
      pendingRequests,
      unsyncedItems
    };
  }
}

// Create singleton instance
export const db = new OdopDatabase();

// Export database for use in components
export default db;
