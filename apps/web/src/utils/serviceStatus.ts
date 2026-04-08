/**
 * Service Status Utility
 * 
 * Monitors and reports on the availability of backend services.
 * Provides real-time status information for UI components.
 */

import { API_CONFIG, isServiceAvailable, clearServiceCache } from '@/config/apiConfig';

export type ServiceName = 'main' | 'quality' | 'shield';

export interface ServiceStatus {
  name: ServiceName;
  available: boolean;
  lastChecked: number;
  url: string;
  responseTime?: number;
}

export interface SystemStatus {
  allServicesAvailable: boolean;
  services: ServiceStatus[];
  timestamp: number;
}

class ServiceStatusMonitor {
  private statusCache = new Map<ServiceName, ServiceStatus>();
  private listeners: Set<(status: SystemStatus) => void> = new Set();
  private monitoringInterval: NodeJS.Timeout | null = null;

  /**
   * Get current status of all services
   */
  async getSystemStatus(): Promise<SystemStatus> {
    const services: ServiceStatus[] = [];
    const serviceNames: ServiceName[] = ['main', 'quality', 'shield'];

    for (const service of serviceNames) {
      const startTime = Date.now();
      const available = await isServiceAvailable(service);
      const responseTime = Date.now() - startTime;

      const status: ServiceStatus = {
        name: service,
        available,
        lastChecked: Date.now(),
        url: this.getServiceUrl(service),
        responseTime,
      };

      services.push(status);
      this.statusCache.set(service, status);
    }

    const systemStatus: SystemStatus = {
      allServicesAvailable: services.every(s => s.available),
      services,
      timestamp: Date.now(),
    };

    // Notify listeners
    this.listeners.forEach(listener => listener(systemStatus));

    return systemStatus;
  }

  /**
   * Get status of a specific service
   */
  async getServiceStatus(service: ServiceName): Promise<ServiceStatus> {
    const startTime = Date.now();
    const available = await isServiceAvailable(service);
    const responseTime = Date.now() - startTime;

    const status: ServiceStatus = {
      name: service,
      available,
      lastChecked: Date.now(),
      url: this.getServiceUrl(service),
      responseTime,
    };

    this.statusCache.set(service, status);
    return status;
  }

  /**
   * Get cached status (without checking)
   */
  getCachedStatus(service: ServiceName): ServiceStatus | null {
    return this.statusCache.get(service) || null;
  }

  /**
   * Subscribe to status changes
   */
  subscribe(listener: (status: SystemStatus) => void): () => void {
    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Start monitoring services (polls every 30 seconds)
   */
  startMonitoring(intervalMs: number = 30000): void {
    if (this.monitoringInterval) {
      return; // Already monitoring
    }

    this.monitoringInterval = setInterval(() => {
      this.getSystemStatus().catch(error => {
        console.error('[ServiceMonitor] Error checking status:', error);
      });
    }, intervalMs);

    // Initial check
    this.getSystemStatus().catch(error => {
      console.error('[ServiceMonitor] Error checking status:', error);
    });
  }

  /**
   * Stop monitoring services
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  /**
   * Force refresh of service status
   */
  async refreshStatus(): Promise<SystemStatus> {
    clearServiceCache();
    return this.getSystemStatus();
  }

  /**
   * Get service URL
   */
  private getServiceUrl(service: ServiceName): string {
    const urls = {
      main: API_CONFIG.BASE_URL,
      quality: API_CONFIG.QUALITY_SCAN_URL,
      shield: API_CONFIG.QUALITY_SHIELD_URL,
    };
    return urls[service];
  }

  /**
   * Get human-readable service name
   */
  getServiceDisplayName(service: ServiceName): string {
    const names = {
      main: 'Main API',
      quality: 'Quality Scan Service',
      shield: 'AI Quality Shield',
    };
    return names[service];
  }

  /**
   * Get status summary
   */
  getSummary(status: SystemStatus): string {
    const available = status.services.filter(s => s.available).length;
    const total = status.services.length;

    if (available === total) {
      return 'All services operational';
    } else if (available === 0) {
      return 'All services offline';
    } else {
      return `${available}/${total} services operational`;
    }
  }
}

export const serviceStatusMonitor = new ServiceStatusMonitor();
