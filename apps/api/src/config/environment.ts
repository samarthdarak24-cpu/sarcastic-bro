import { Logger } from '../utils/logger';

const logger = new Logger('EnvironmentConfig');

interface EnvironmentConfig {
  // Server
  port: number;
  nodeEnv: string;
  apiUrl: string;
  frontendUrl: string;

  // Database
  databaseUrl: string;

  // JWT
  jwtSecret: string;
  jwtExpiresIn: string;
  jwtRefreshSecret: string;
  jwtRefreshExpiresIn: string;

  // Redis
  redisUrl: string;

  // WebSocket
  websocketPort: number;
  websocketCorsOrigin: string;

  // S3 Storage
  s3Endpoint: string;
  s3AccessKeyId: string;
  s3SecretAccessKey: string;
  s3BucketName: string;
  s3Region: string;
  s3UsePathStyleUrl: boolean;
  s3PublicUrl: string;

  // File Upload
  maxFileSize: number;
  maxImageSize: number;

  // Payment Gateway
  razorpayKeyId: string;
  razorpayKeySecret: string;
  razorpayWebhookSecret: string;

  // AI Service
  aiServiceUrl: string;
  aiServiceTimeout: number;
  aiQualityAnalysisEnabled: boolean;

  // Voice Service
  voiceServiceProvider: string;

  // Email Service
  emailProvider: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  emailFrom: string;
  emailFromName: string;

  // Logging
  logLevel: string;
  logFormat: string;

  // Security
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  corsOrigin: string;
  corsCredentials: boolean;

  // Feature Flags
  featureRealTimeEnabled: boolean;
  featureAiQualityEnabled: boolean;
  featureVoiceEnabled: boolean;
  featurePaymentEnabled: boolean;
  featureNotificationsEnabled: boolean;

  // Marketplace Configuration
  defaultCurrency: string;
  taxRate: number;
  commissionRate: number;
  minOrderValue: number;
  maxOrderValue: number;

  // Quality Grades
  qualityGradeAPlusMin: number;
  qualityGradeAMin: number;
  qualityGradeBPlusMin: number;
  qualityGradeBMin: number;

  // Notification Settings
  notificationRetentionDays: number;

  // Analytics
  analyticsEnabled: boolean;
  analyticsRetentionDays: number;

  // Development
  debug: boolean;
  seedDatabase: boolean;
}

class EnvironmentConfigService {
  private config: EnvironmentConfig;

  constructor() {
    this.config = this.loadConfig();
    this.validateConfig();
  }

  private loadConfig(): EnvironmentConfig {
    return {
      // Server
      port: parseInt(process.env.PORT || '3001', 10),
      nodeEnv: process.env.NODE_ENV || 'development',
      apiUrl: process.env.API_URL || 'http://localhost:3001',
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

      // Database
      databaseUrl: process.env.DATABASE_URL || '',

      // JWT
      jwtSecret: process.env.JWT_SECRET || '',
      jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
      jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || '',
      jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

      // Redis
      redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

      // WebSocket
      websocketPort: parseInt(process.env.WEBSOCKET_PORT || '3002', 10),
      websocketCorsOrigin: process.env.WEBSOCKET_CORS_ORIGIN || 'http://localhost:3000',

      // S3 Storage
      s3Endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
      s3AccessKeyId: process.env.S3_ACCESS_KEY_ID || 'minioadmin',
      s3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY || 'minioadmin',
      s3BucketName: process.env.S3_BUCKET_NAME || 'marketplace',
      s3Region: process.env.S3_REGION || 'us-east-1',
      s3UsePathStyleUrl: process.env.S3_USE_PATH_STYLE_URL === 'true',
      s3PublicUrl: process.env.S3_PUBLIC_URL || 'http://localhost:9000/marketplace',

      // File Upload
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
      maxImageSize: parseInt(process.env.MAX_IMAGE_SIZE || '5242880', 10),

      // Payment Gateway
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
      razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
      razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',

      // AI Service
      aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8001',
      aiServiceTimeout: parseInt(process.env.AI_SERVICE_TIMEOUT || '15000', 10),
      aiQualityAnalysisEnabled: process.env.AI_QUALITY_ANALYSIS_ENABLED !== 'false',

      // Voice Service
      voiceServiceProvider: process.env.VOICE_SERVICE_PROVIDER || 'google',

      // Email Service
      emailProvider: process.env.EMAIL_PROVIDER || 'smtp',
      smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
      smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
      smtpUser: process.env.SMTP_USER || '',
      smtpPassword: process.env.SMTP_PASSWORD || '',
      emailFrom: process.env.EMAIL_FROM || 'noreply@marketplace.com',
      emailFromName: process.env.EMAIL_FROM_NAME || 'Marketplace',

      // Logging
      logLevel: process.env.LOG_LEVEL || 'info',
      logFormat: process.env.LOG_FORMAT || 'json',

      // Security
      rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
      rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
      corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      corsCredentials: process.env.CORS_CREDENTIALS === 'true',

      // Feature Flags
      featureRealTimeEnabled: process.env.FEATURE_REAL_TIME_ENABLED !== 'false',
      featureAiQualityEnabled: process.env.FEATURE_AI_QUALITY_ENABLED !== 'false',
      featureVoiceEnabled: process.env.FEATURE_VOICE_ENABLED !== 'false',
      featurePaymentEnabled: process.env.FEATURE_PAYMENT_ENABLED !== 'false',
      featureNotificationsEnabled: process.env.FEATURE_NOTIFICATIONS_ENABLED !== 'false',

      // Marketplace Configuration
      defaultCurrency: process.env.DEFAULT_CURRENCY || 'INR',
      taxRate: parseFloat(process.env.TAX_RATE || '0.18'),
      commissionRate: parseFloat(process.env.COMMISSION_RATE || '0.05'),
      minOrderValue: parseFloat(process.env.MIN_ORDER_VALUE || '100'),
      maxOrderValue: parseFloat(process.env.MAX_ORDER_VALUE || '1000000'),

      // Quality Grades
      qualityGradeAPlusMin: parseFloat(process.env.QUALITY_GRADE_A_PLUS_MIN || '90'),
      qualityGradeAMin: parseFloat(process.env.QUALITY_GRADE_A_MIN || '75'),
      qualityGradeBPlusMin: parseFloat(process.env.QUALITY_GRADE_B_PLUS_MIN || '60'),
      qualityGradeBMin: parseFloat(process.env.QUALITY_GRADE_B_MIN || '40'),

      // Notification Settings
      notificationRetentionDays: parseInt(process.env.NOTIFICATION_RETENTION_DAYS || '30', 10),

      // Analytics
      analyticsEnabled: process.env.ANALYTICS_ENABLED !== 'false',
      analyticsRetentionDays: parseInt(process.env.ANALYTICS_RETENTION_DAYS || '365', 10),

      // Development
      debug: process.env.DEBUG === 'true',
      seedDatabase: process.env.SEED_DATABASE === 'true',
    };
  }

  private validateConfig(): void {
    const requiredFields = [
      'databaseUrl',
      'jwtSecret',
      'jwtRefreshSecret',
    ];

    const missingFields = requiredFields.filter((field) => !this.config[field as keyof EnvironmentConfig]);

    if (missingFields.length > 0) {
      logger.warn(`Missing required environment variables: ${missingFields.join(', ')}`);
      if (this.config.nodeEnv === 'production') {
        throw new Error(`Missing required environment variables: ${missingFields.join(', ')}`);
      }
    }

    logger.info('Environment configuration validated');
  }

  getConfig(): EnvironmentConfig {
    return this.config;
  }

  get(key: keyof EnvironmentConfig): any {
    return this.config[key];
  }

  isDevelopment(): boolean {
    return this.config.nodeEnv === 'development';
  }

  isProduction(): boolean {
    return this.config.nodeEnv === 'production';
  }

  isStaging(): boolean {
    return this.config.nodeEnv === 'staging';
  }
}

export const environmentConfig = new EnvironmentConfigService();
