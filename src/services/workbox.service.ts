import { OfflineRequest, WorkboxConfig } from '../types/chat';

export class WorkboxService {
  private offlineRequests: Map<string, OfflineRequest> = new Map();
  private config: WorkboxConfig;

  constructor(config?: Partial<WorkboxConfig>) {
    this.config = {
      cacheName: 'ecomstudy-offline-cache',
      maxEntries: 100,
      maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      strategies: {
        api: 'networkFirst',
        assets: 'cacheFirst'
      },
      ...config
    };
  }

  // Store offline request
  public storeOfflineRequest(request: Omit<OfflineRequest, 'id' | 'timestamp' | 'retryCount'>): string {
    const id = this.generateRequestId();
    const offlineRequest: OfflineRequest = {
      ...request,
      id,
      timestamp: Date.now(),
      retryCount: 0
    };

    this.offlineRequests.set(id, offlineRequest);
    this.persistOfflineRequests();
    return id;
  }

  // Get all offline requests
  public getOfflineRequests(): OfflineRequest[] {
    return Array.from(this.offlineRequests.values());
  }

  // Get offline request by ID
  public getOfflineRequest(id: string): OfflineRequest | undefined {
    return this.offlineRequests.get(id);
  }

  // Remove offline request
  public removeOfflineRequest(id: string): boolean {
    const removed = this.offlineRequests.delete(id);
    if (removed) {
      this.persistOfflineRequests();
    }
    return removed;
  }

  // Update retry count
  public updateRetryCount(id: string): boolean {
    const request = this.offlineRequests.get(id);
    if (request) {
      request.retryCount += 1;
      this.persistOfflineRequests();
      return true;
    }
    return false;
  }

  // Clear old offline requests
  public clearOldRequests(): number {
    const now = Date.now();
    const maxAge = this.config.maxAgeSeconds * 1000;
    let clearedCount = 0;

    for (const [id, request] of this.offlineRequests.entries()) {
      if (now - request.timestamp > maxAge) {
        this.offlineRequests.delete(id);
        clearedCount++;
      }
    }

    if (clearedCount > 0) {
      this.persistOfflineRequests();
    }

    return clearedCount;
  }

  // Retry all offline requests
  public async retryOfflineRequests(): Promise<{ success: number; failed: number }> {
    const requests = Array.from(this.offlineRequests.values());
    let successCount = 0;
    let failedCount = 0;

    for (const request of requests) {
      try {
        const success = await this.retryRequest(request);
        if (success) {
          this.removeOfflineRequest(request.id);
          successCount++;
        } else {
          failedCount++;
        }
      } catch (error) {
        console.error(`Failed to retry request ${request.id}:`, error);
        failedCount++;
      }
    }

    return { success: successCount, failed: failedCount };
  }

  // Retry single request
  private async retryRequest(request: OfflineRequest): Promise<boolean> {
    try {
      const response = await fetch(request.url, {
        method: request.method,
        headers: {
          'Content-Type': 'application/json',
          ...request.headers
        },
        body: request.data ? JSON.stringify(request.data) : undefined
      });

      if (response.ok) {
        return true;
      } else {
        console.warn(`Request ${request.id} failed with status: ${response.status}`);
        return false;
      }
    } catch (error) {
      console.error(`Request ${request.id} failed:`, error);
      return false;
    }
  }

  // Generate unique request ID
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Persist offline requests to localStorage
  private persistOfflineRequests(): void {
    if (typeof window !== 'undefined') {
      try {
        const requests = Array.from(this.offlineRequests.values());
        localStorage.setItem('offline_requests', JSON.stringify(requests));
      } catch (error) {
        console.error('Failed to persist offline requests:', error);
      }
    }
  }

  // Load offline requests from localStorage
  public loadOfflineRequests(): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('offline_requests');
        if (stored) {
          const requests: OfflineRequest[] = JSON.parse(stored);
          this.offlineRequests.clear();
          requests.forEach(request => {
            this.offlineRequests.set(request.id, request);
          });
        }
      } catch (error) {
        console.error('Failed to load offline requests:', error);
      }
    }
  }

  // Get configuration
  public getConfig(): WorkboxConfig {
    return { ...this.config };
  }

  // Update configuration
  public updateConfig(newConfig: Partial<WorkboxConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Get statistics
  public getStats(): {
    totalRequests: number;
    pendingRequests: number;
    oldestRequest: Date | null;
    newestRequest: Date | null;
  } {
    const requests = Array.from(this.offlineRequests.values());
    const timestamps = requests.map(r => r.timestamp);

    return {
      totalRequests: requests.length,
      pendingRequests: requests.length,
      oldestRequest: timestamps.length > 0 ? new Date(Math.min(...timestamps)) : null,
      newestRequest: timestamps.length > 0 ? new Date(Math.max(...timestamps)) : null
    };
  }
}

// Workbox configuration for service worker
export const workboxConfig = {
  // Cache strategies
  strategies: {
    // Network first for API calls
    api: {
      strategy: 'networkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 3,
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },
    // Cache first for static assets
    assets: {
      strategy: 'cacheFirst',
      options: {
        cacheName: 'assets-cache',
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },
    // Stale while revalidate for images
    images: {
      strategy: 'staleWhileRevalidate',
      options: {
        cacheName: 'images-cache',
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    }
  },

  // Precaching
  precache: [
    '/',
    '/static/js/bundle.js',
    '/static/css/main.css',
    '/manifest.json'
  ],

  // Runtime caching
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\./,
      handler: 'networkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 3,
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },
    {
      urlPattern: /\.(js|css)$/,
      handler: 'cacheFirst',
      options: {
        cacheName: 'static-cache',
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },
    {
      urlPattern: /\.(png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'staleWhileRevalidate',
      options: {
        cacheName: 'images-cache',
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    }
  ],

  // Background sync
  backgroundSync: {
    queueName: 'offline-requests',
    maxRetentionTime: 24 * 60 // 24 hours
  },

  // Navigation fallback
  navigationFallback: '/index.html'
}; 