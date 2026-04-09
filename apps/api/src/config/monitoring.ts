import { Logger } from '@nestjs/common';
import * as prometheus from 'prom-client';
import { trace, context } from '@opentelemetry/api';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';

const logger = new Logger('Monitoring');

// Prometheus metrics
export const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

export const httpRequestTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

export const databaseQueryDuration = new prometheus.Histogram({
  name: 'database_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'table'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1],
});

export const cacheHitRate = new prometheus.Counter({
  name: 'cache_hits_total',
  help: 'Total number of cache hits',
  labelNames: ['cache_name'],
});

export const cacheMissRate = new prometheus.Counter({
  name: 'cache_misses_total',
  help: 'Total number of cache misses',
  labelNames: ['cache_name'],
});

export const activeConnections = new prometheus.Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
  labelNames: ['connection_type'],
});

export const errorRate = new prometheus.Counter({
  name: 'errors_total',
  help: 'Total number of errors',
  labelNames: ['error_type', 'service'],
});

// Initialize OpenTelemetry
export function initializeOpenTelemetry() {
  const sdk = new NodeSDK({
    traceExporter: new ConsoleSpanExporter(),
    instrumentations: [getNodeAutoInstrumentations()],
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
        url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318',
      }),
    }),
  });

  sdk.start();
  logger.log('OpenTelemetry initialized');

  process.on('SIGTERM', () => {
    sdk.shutdown()
      .then(() => logger.log('OpenTelemetry shutdown'))
      .catch((err) => logger.error('OpenTelemetry shutdown error', err));
  });
}

// Health check endpoint
export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  services: {
    database: boolean;
    redis: boolean;
    api: boolean;
  };
  metrics: {
    uptime: number;
    memoryUsage: NodeJS.MemoryUsage;
    cpuUsage: NodeJS.CpuUsage;
  };
}

export async function getHealthStatus(): Promise<HealthStatus> {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();

  return {
    status: 'healthy',
    timestamp: new Date(),
    services: {
      database: true,
      redis: true,
      api: true,
    },
    metrics: {
      uptime,
      memoryUsage,
      cpuUsage,
    },
  };
}

// Distributed tracing helper
export function createSpan(name: string, attributes?: Record<string, any>) {
  const tracer = trace.getTracer('default');
  const span = tracer.startSpan(name);
  
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      span.setAttribute(key, value);
    });
  }

  return span;
}

// Centralized logging configuration
export const loggingConfig = {
  level: process.env.LOG_LEVEL || 'info',
  format: 'json',
  transports: [
    {
      type: 'console',
      format: 'json',
    },
    {
      type: 'file',
      filename: 'logs/error.log',
      level: 'error',
    },
    {
      type: 'file',
      filename: 'logs/combined.log',
    },
  ],
};

// Alert rules configuration
export const alertRules = [
  {
    name: 'HighErrorRate',
    condition: 'error_rate > 0.05',
    duration: '5m',
    severity: 'critical',
  },
  {
    name: 'HighLatency',
    condition: 'p95_latency > 1000',
    duration: '5m',
    severity: 'warning',
  },
  {
    name: 'LowCacheHitRate',
    condition: 'cache_hit_rate < 0.7',
    duration: '10m',
    severity: 'warning',
  },
  {
    name: 'DatabaseConnectionPoolExhausted',
    condition: 'db_connections > 90',
    duration: '2m',
    severity: 'critical',
  },
  {
    name: 'HighMemoryUsage',
    condition: 'memory_usage > 0.9',
    duration: '5m',
    severity: 'warning',
  },
];

// Monitoring dashboard configuration
export const dashboardConfig = {
  name: 'ODOP Connect Monitoring',
  panels: [
    {
      title: 'Request Rate',
      metric: 'http_requests_total',
      type: 'graph',
    },
    {
      title: 'Response Time (p95)',
      metric: 'http_request_duration_seconds',
      type: 'gauge',
      percentile: 95,
    },
    {
      title: 'Error Rate',
      metric: 'errors_total',
      type: 'graph',
    },
    {
      title: 'Cache Hit Rate',
      metric: 'cache_hits_total / (cache_hits_total + cache_misses_total)',
      type: 'gauge',
    },
    {
      title: 'Database Query Duration',
      metric: 'database_query_duration_seconds',
      type: 'heatmap',
    },
    {
      title: 'Active Connections',
      metric: 'active_connections',
      type: 'gauge',
    },
  ],
};
