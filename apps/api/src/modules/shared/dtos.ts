/**
 * Shared DTOs for Phase 2 Backend Services
 * Provides type-safe request/response objects for all services
 */

// ============================================================================
// Authentication DTOs
// ============================================================================

export interface AuthRegisterRequest {
  email: string;
  password: string;
  name: string;
  role: "FARMER" | "BUYER";
  phone?: string;
  district?: string;
  state?: string;
}

export interface AuthLoginRequest {
  email?: string;
  phone?: string;
  password: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  district?: string;
  state?: string;
  kycStatus: string;
  createdAt: Date;
}

// ============================================================================
// Crop Management DTOs
// ============================================================================

export interface CreateCropRequest {
  name: string;
  category: "fruit" | "vegetable" | "grain";
  description?: string;
  price: number;
  quantity: number;
  unit: string;
  district?: string;
  state?: string;
  harvestDate?: string;
}

export interface UpdateCropRequest {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  unit?: string;
}

export interface CropResponse {
  id: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  quantity: number;
  unit: string;
  qualityGrade?: string;
  qualityScore?: number;
  imageUrls?: string[];
  farmerId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Order Management DTOs
// ============================================================================

export interface CreateOrderRequest {
  productId: string;
  quantity: number;
  notes?: string;
}

export interface UpdateOrderStatusRequest {
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "IN_TRANSIT" | "DELIVERED" | "COMPLETED" | "CANCELLED";
  notes?: string;
}

export interface AddTrackingUpdateRequest {
  status: string;
  location?: string;
  lat?: number;
  lng?: number;
  notes?: string;
  estimatedTime?: string;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  productId: string;
  farmerId: string;
  buyerId: string;
  quantity: number;
  totalPrice: number;
  status: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Chat / AgriChat DTOs
// ============================================================================

export interface SendMessageRequest {
  conversationId?: string;
  receiverId: string;
  content: string;
  type?: "TEXT" | "IMAGE" | "VOICE" | "FILE";
  attachmentUrl?: string;
  orderId?: string;
}

export interface MessageResponse {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: string;
  attachmentUrl?: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

export interface ConversationResponse {
  id: string;
  user1Id: string;
  user2Id: string;
  lastMessageAt?: Date;
  messages?: MessageResponse[];
}

// ============================================================================
// Payment DTOs
// ============================================================================

export interface InitiatePaymentRequest {
  orderId: string;
  amount: number;
  method: "UPI" | "CARD" | "NET_BANKING";
}

export interface VerifyPaymentRequest {
  paymentId: string;
  signature: string;
}

export interface PaymentResponse {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  invoiceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Trust & Rating DTOs
// ============================================================================

export interface SubmitRatingRequest {
  orderId: string;
  toUserId: string;
  stars: number;
  review?: string;
}

export interface RatingResponse {
  id: string;
  orderId: string;
  fromUserId: string;
  toUserId: string;
  stars: number;
  review?: string;
  createdAt: Date;
}

export interface ReputationProfileResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatarUrl?: string;
    reputationScore: number;
    createdAt: Date;
  };
  reputationScore: number;
  totalRatings: number;
  recentRatings: RatingResponse[];
  ratingDistribution: {
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
  };
}

// ============================================================================
// Notification DTOs
// ============================================================================

export interface CreateNotificationRequest {
  userId: string;
  type: "ORDER" | "MESSAGE" | "PAYMENT" | "QUALITY" | "RATING" | "SYSTEM";
  title: string;
  message: string;
  metadata?: Record<string, any>;
}

export interface NotificationResponse {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

export interface NotificationPreferencesRequest {
  orderNotifications: boolean;
  messageNotifications: boolean;
  paymentNotifications: boolean;
  qualityNotifications: boolean;
  ratingNotifications: boolean;
  systemNotifications: boolean;
}

// ============================================================================
// Analytics DTOs
// ============================================================================

export interface AnalyticsDashboardResponse {
  totalProducts?: number;
  activeProducts?: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  totalRevenue?: number;
  successRate?: number;
  recentOrders?: OrderResponse[];
  topSellingProducts?: CropResponse[];
  ordersByStatus?: Record<string, number>;
  recommendations?: CropResponse[];
  priceComparisons?: Record<string, number>;
  marketTrends?: Record<string, number>;
}

// ============================================================================
// Favorites DTOs
// ============================================================================

export interface AddFavoriteRequest {
  farmerId: string;
  notes?: string;
}

export interface UpdateFavoriteRequest {
  notes?: string;
}

export interface FavoriteResponse {
  id: string;
  buyerId: string;
  farmerId: string;
  farmer: {
    id: string;
    name: string;
    email: string;
    reputationScore: number;
    avatarUrl?: string;
  };
  notes?: string;
  recentProducts?: CropResponse[];
  createdAt: Date;
}

// ============================================================================
// Generic Response Wrappers
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ============================================================================
// Filter DTOs
// ============================================================================

export interface CropFilterRequest {
  category?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  qualityGrade?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface OrderFilterRequest {
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface AnalyticsFilterRequest {
  dateRange?: "7days" | "30days" | "90days" | "1year";
  startDate?: string;
  endDate?: string;
}
