/* ========================================================================
   Redis Service — Caching layer for performance optimization
   ======================================================================== */

import Redis from "ioredis";
import { env } from "../config/env";

class RedisService {
  private client: Redis | null = null;
  private isConnected = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      // Only initialize if REDIS_URL is provided
      if (!env.REDIS_URL) {
        console.log("[Redis] No REDIS_URL configured, caching disabled");
        return;
      }

      this.client = new Redis(env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) {
            console.error("[Redis] Max retries reached, giving up");
            return null;
          }
          return Math.min(times * 100, 3000);
        },
      });

      this.client.on("connect", () => {
        this.isConnected = true;
        console.log("[Redis] Connected successfully");
      });

      this.client.on("error", (error) => {
        console.error("[Redis] Connection error:", error.message);
        this.isConnected = false;
      });

      this.client.on("close", () => {
        this.isConnected = false;
        console.log("[Redis] Connection closed");
      });
    } catch (error) {
      console.error("[Redis] Initialization failed:", error);
    }
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.client || !this.isConnected) return null;

    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`[Redis] Get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set value in cache with TTL (in seconds)
   */
  async set(key: string, value: any, ttl: number = 300): Promise<boolean> {
    if (!this.client || !this.isConnected) return false;

    try {
      await this.client.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`[Redis] Set error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete key from cache
   */
  async del(key: string): Promise<boolean> {
    if (!this.client || !this.isConnected) return false;

    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error(`[Redis] Delete error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete multiple keys matching pattern
   */
  async delPattern(pattern: string): Promise<number> {
    if (!this.client || !this.isConnected) return 0;

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length === 0) return 0;
      
      await this.client.del(...keys);
      return keys.length;
    } catch (error) {
      console.error(`[Redis] Delete pattern error for ${pattern}:`, error);
      return 0;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    if (!this.client || !this.isConnected) return false;

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`[Redis] Exists error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Increment value
   */
  async incr(key: string): Promise<number> {
    if (!this.client || !this.isConnected) return 0;

    try {
      return await this.client.incr(key);
    } catch (error) {
      console.error(`[Redis] Incr error for key ${key}:`, error);
      return 0;
    }
  }

  /**
   * Set expiry on existing key
   */
  async expire(key: string, ttl: number): Promise<boolean> {
    if (!this.client || !this.isConnected) return false;

    try {
      await this.client.expire(key, ttl);
      return true;
    } catch (error) {
      console.error(`[Redis] Expire error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get cache or execute function and cache result
   */
  async getOrSet<T>(
    key: string,
    fn: () => Promise<T>,
    ttl: number = 300
  ): Promise<T> {
    // Try to get from cache
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Execute function and cache result
    const result = await fn();
    await this.set(key, result, ttl);
    return result;
  }

  /**
   * Disconnect from Redis
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.isConnected = false;
      console.log("[Redis] Disconnected");
    }
  }

  /**
   * Check if Redis is available
   */
  isAvailable(): boolean {
    return this.isConnected;
  }
}

// Export singleton instance
export const redis = new RedisService();
