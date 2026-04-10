/**
 * Type definitions for AI Features
 */

// Quality Analysis Types
export interface QualityAnalysisResult {
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C';
  score: number; // 0-100
  defects: number;
  freshness: number; // 0-100
  color: number; // 0-100
  size: number; // 0-100
  recommendations?: string[];
}

export interface QualityScanRequest {
  imageUrl: string; // Base64 or URL
  cropId?: string;
}

export interface QualityScanResponse extends QualityAnalysisResult {
  id?: string;
  createdAt?: Date;
}

export interface QualityScanHistory {
  scans: QualityScan[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface QualityScan {
  id: string;
  farmerId: string;
  productId?: string;
  imageUrl: string;
  grade: string;
  score: number;
  defects: number;
  freshness: number;
  color: number;
  size: number;
  createdAt: Date;
  product?: {
    id: string;
    name: string;
    category: string;
  };
}

// Chat Types
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ChatRequest {
  message: string;
  userRole: 'farmer' | 'buyer' | 'fpo';
  userName?: string;
  context?: Record<string, any>;
}

export interface ChatResponse {
  response: string;
  suggestions?: string[];
  metadata?: Record<string, any>;
}

export interface FloatingChatbotProps {
  userRole: 'FARMER' | 'BUYER' | 'FPO';
  userName?: string;
  initialMessage?: string;
}

// N8N Configuration Types
export interface N8nConfig {
  webhookUrl: string;
  label: string;
  description: string;
  openOnStart: boolean;
  colors?: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    surfaceColor: string;
    borderColor: string;
    successColor: string;
    warningColor: string;
    errorColor: string;
  };
}

// API Configuration Types
export interface ApiConfig {
  BASE_URL: string;
  QUALITY_SCAN_URL: string;
  QUALITY_SHIELD_URL: string;
  TIMEOUT: {
    SHORT: number;
    MEDIUM: number;
    LONG: number;
    SOCKET: number;
  };
  RETRY: {
    MAX_ATTEMPTS: number;
    INITIAL_DELAY: number;
    MAX_DELAY: number;
    BACKOFF_MULTIPLIER: number;
  };
  ENDPOINTS: {
    QUALITY_SCAN: string;
    QUALITY_SHIELD_SCAN: string;
    ESCROW: string;
    AGGREGATION_LOTS: string;
    CHAT: string;
    N8N_CHAT: string;
    HEALTH: string;
  };
  CACHE_DURATION: number;
}

// Component Props Types
export interface AIQualityShieldProps {
  onAnalysisComplete?: (result: QualityAnalysisResult) => void;
  onError?: (error: Error) => void;
}

export interface MetricBarProps {
  label: string;
  value: number;
  color: string;
}

// Service Status Types
export interface ServiceStatus {
  available: boolean;
  timestamp: number;
}

export type ServiceType = 'main' | 'quality' | 'shield';

// Error Types
export interface ApiError {
  error: string;
  message: string;
  statusCode?: number;
}
