'use client';

/**
 * Performance Optimization Service
 * Handles caching, compression, and performance enhancements
 */

interface CacheConfig {
  maxAge: number; // milliseconds
  maxSize: number; // bytes
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
}

class PerformanceOptimizer {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private metrics: PerformanceMetric[] = [];
  private cacheConfig: CacheConfig = {
    maxAge: 5 * 60 * 1000, // 5 minutes default
    maxSize: 50 * 1024 * 1024, // 50MB default
  };

  constructor() {
    this.initializePerformanceMonitoring();
  }

  /**
   * Initialize performance monitoring
   */
  private initializePerformanceMonitoring(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    try {
      // Monitor largest contentful paint
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('LCP', entry.renderTime || entry.loadTime, 'ms');
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Monitor first input delay
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('FID', entry.processingDuration, 'ms');
        }
      }).observe({ entryTypes: ['first-input'] });

      // Monitor cumulative layout shift
      new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        this.recordMetric('CLS', clsValue, 'unitless');
      }).observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('Performance monitoring not available:', error);
    }
  }

  /**
   * Record a performance metric
   */
  private recordMetric(name: string, value: number, unit: string): void {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
    };
    this.metrics.push(metric);

    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics.shift();
    }

    console.log(`📊 ${name}: ${value.toFixed(2)}${unit}`);
  }

  /**
   * Get Core Web Vitals
   */
  getWebVitals() {
    const lcp = this.metrics.find(m => m.name === 'LCP');
    const fid = this.metrics.find(m => m.name === 'FID');
    const cls = this.metrics.find(m => m.name === 'CLS');

    return {
      LCP: lcp?.value || null, // Largest Contentful Paint
      FID: fid?.value || null, // First Input Delay
      CLS: cls?.value || null, // Cumulative Layout Shift
    };
  }

  /**
   * Cache data with automatic expiration
   */
  set<T>(
    key: string,
    data: T,
    maxAge: number = this.cacheConfig.maxAge
  ): void {
    try {
      const size = JSON.stringify(data).length;
      
      if (size > this.cacheConfig.maxSize) {
        console.warn(`Cache entry too large: ${size} bytes`);
        return;
      }

      this.cache.set(key, {
        data,
        timestamp: Date.now(),
      });

      // Auto-expire after maxAge
      setTimeout(() => {
        this.cache.delete(key);
      }, maxAge);

      console.log(`✅ Cached: ${key}`);
    } catch (error) {
      console.error('Caching failed:', error);
    }
  }

  /**
   * Get cached data
   */
  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }

    // Check if expired
    if (Date.now() - cached.timestamp > this.cacheConfig.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  /**
   * Clear cache entry
   */
  clear(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clearAll(): void {
    this.cache.clear();
  }

  /**
   * Debounce function calls
   */
  debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }

  /**
   * Throttle function calls
   */
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  }

  /**
   * Preload images for better performance
   */
  preloadImages(urls: string[]): Promise<void[]> {
    return Promise.all(
      urls.map(
        url =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = url;
          })
      )
    );
  }

  /**
   * Lazy load images using Intersection Observer
   */
  lazyLoadImage(img: HTMLImageElement): void {
    if (!('IntersectionObserver' in window)) {
      img.src = img.dataset.src || '';
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const image = entry.target as HTMLImageElement;
          image.src = image.dataset.src || '';
          image.classList.add('loaded');
          observer.unobserve(image);
        }
      }
    });

    observer.observe(img);
  }

  /**
   * Get memory usage statistics
   */
  getMemoryStats() {
    if (!('memory' in performance)) {
      return null;
    }

    const memory = (performance as any).memory;
    return {
      usedJSHeapSize: (memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
      totalJSHeapSize: (memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
      jsHeapSizeLimit: (memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB',
    };
  }

  /**
   * Measure function execution time
   */
  async measureAsync<T>(
    label: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.recordMetric(label, duration, 'ms');
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`${label} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }

  /**
   * Optimize bundle size by code splitting
   */
  async loadChunk(chunkName: string): Promise<any> {
    try {
      const module = await import(
        /* webpackChunkName: "[request]" */
        `@/components/${chunkName}`
      );
      console.log(`✅ Loaded chunk: ${chunkName}`);
      return module;
    } catch (error) {
      console.error(`Failed to load chunk: ${chunkName}`, error);
      throw error;
    }
  }

  /**
   * Enable request batching to reduce network calls
   */
  private requestQueue: Map<string, Promise<any>> = new Map();

  async batchRequest<T>(
    key: string,
    request: () => Promise<T>,
    dedupeWindow: number = 100
  ): Promise<T> {
    // Return cached promise if within dedup window
    if (this.requestQueue.has(key)) {
      return this.requestQueue.get(key);
    }

    const promise = request();
    this.requestQueue.set(key, promise);

    // Remove from queue after dedup window
    setTimeout(() => {
      this.requestQueue.delete(key);
    }, dedupeWindow);

    return promise;
  }

  /**
   * Get performance report
   */
  getPerformanceReport() {
    const vitals = this.getWebVitals();
    const memory = this.getMemoryStats();

    return {
      vitals,
      memory,
      cacheSize: this.cache.size,
      metricsRecorded: this.metrics.length,
      metrics: this.metrics.slice(-20), // Last 20 metrics
    };
  }
}

// Create singleton instance
const performanceOptimizer = new PerformanceOptimizer();

export default performanceOptimizer;
