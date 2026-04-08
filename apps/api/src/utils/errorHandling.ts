// ============================================================================
// API Error Handling & Validation Framework
// File: apps/api/src/utils/errorHandling.ts
// ============================================================================

import { Request, Response, NextFunction } from 'express';

// ──────────────────────────────────────────────────────────────────────────
// 1. CUSTOM ERROR CLASSES
// ──────────────────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message: string, code = 'BAD_REQUEST', details?: any) {
    return new ApiError(400, message, code, details);
  }

  static unauthorized(message = 'Unauthorized', code = 'UNAUTHORIZED', details?: any) {
    return new ApiError(401, message, code, details);
  }

  static forbidden(message = 'Forbidden', code = 'FORBIDDEN', details?: any) {
    return new ApiError(403, message, code, details);
  }

  static notFound(message = 'Not Found', code = 'NOT_FOUND', details?: any) {
    return new ApiError(404, message, code, details);
  }

  static conflict(message = 'Conflict', code = 'CONFLICT', details?: any) {
    return new ApiError(409, message, code, details);
  }

  static tooManyRequests(message = 'Too Many Requests', code = 'RATE_LIMITED', details?: any) {
    return new ApiError(429, message, code, details);
  }

  static internalError(message = 'Internal Server Error', code = 'INTERNAL_ERROR', details?: any) {
    return new ApiError(500, message, code, details);
  }

  static validationError(errors: Record<string, string>) {
    return new ApiError(422, 'Validation failed', 'VALIDATION_ERROR', errors);
  }
}

// ──────────────────────────────────────────────────────────────────────────
// 2. ASYNC HANDLER WRAPPER
// ──────────────────────────────────────────────────────────────────────────

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// ──────────────────────────────────────────────────────────────────────────
// 3. VALIDATION UTILITIES
// ──────────────────────────────────────────────────────────────────────────

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\d{10,15}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const validateQuantity = (quantity: any): boolean => {
  const num = Number(quantity);
  return !isNaN(num) && num > 0;
};

export const validatePrice = (price: any): boolean => {
  const num = Number(price);
  return !isNaN(num) && num >= 0;
};

export const validateDate = (date: any): boolean => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

export const validateString = (str: any, minLength = 1, maxLength = 500): boolean => {
  return typeof str === 'string' && 
         str.trim().length >= minLength && 
         str.length <= maxLength;
};

export const validateEnum = (value: any, allowedValues: any[]): boolean => {
  return allowedValues.includes(value);
};

export const validateId = (id: any): boolean => {
  return typeof id === 'string' && id.trim().length > 0 && id.length <= 36;
};

// ──────────────────────────────────────────────────────────────────────────
// 4. REQUEST VALIDATION SCHEMAS
// ──────────────────────────────────────────────────────────────────────────

export interface ValidationSchema {
  [key: string]: {
    required?: boolean;
    type?: string;
    validate?: (value: any) => boolean;
    message?: string;
  };
}

export const validateRequest = (data: any, schema: ValidationSchema): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  for (const [key, rules] of Object.entries(schema)) {
    const value = data[key];

    if (rules.required && (value === undefined || value === null || value === '')) {
      errors[key] = rules.message || `${key} is required`;
      continue;
    }

    if (value === undefined || value === null) continue;

    if (rules.type && typeof value !== rules.type) {
      errors[key] = `${key} must be a ${rules.type}`;
    }

    if (rules.validate && !rules.validate(value)) {
      errors[key] = rules.message || `${key} is invalid`;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

// ──────────────────────────────────────────────────────────────────────────
// 5. BUYER API VALIDATION SCHEMAS
// ──────────────────────────────────────────────────────────────────────────

export const BuyerValidationSchemas = {
  // Supplier filters
  listSuppliers: {
    district: { type: 'string', validate: (v) => v.length > 0 && v.length <= 50 },
    category: { type: 'string', validate: (v) => v.length > 0 && v.length <= 50 },
    minRating: { type: 'number', validate: (v) => v >= 0 && v <= 5 },
    page: { type: 'number', validate: (v) => v > 0 },
    limit: { type: 'number', validate: (v) => v > 0 && v <= 100 }
  },

  // Create inquiry
  createInquiry: {
    productId: { required: true, type: 'string', validate: validateId },
    quantity: { required: true, type: 'number', validate: validateQuantity, message: 'Quantity must be greater than 0' },
    desiredPrice: { type: 'number', validate: validatePrice },
    deliveryDate: { type: 'string', validate: validateDate }
  },

  // Create review
  createReview: {
    supplierId: { required: true, type: 'string', validate: validateId },
    rating: { required: true, type: 'number', validate: (v) => v >= 1 && v <= 5, message: 'Rating must be between 1 and 5' },
    comment: { type: 'string', validate: (v) => validateString(v, 0, 1000) }
  },

  // Place bid
  placeBid: {
    productId: { required: true, type: 'string', validate: validateId },
    quantity: { required: true, type: 'number', validate: validateQuantity },
    bidPrice: { required: true, type: 'number', validate: validatePrice },
    expiresInDays: { type: 'number', validate: (v) => v > 0 && v <= 90 }
  },

  // Create escrow
  createEscrow: {
    orderId: { required: true, type: 'string', validate: validateId },
    amount: { required: true, type: 'number', validate: validatePrice },
    deliveryDeadline: { required: true, type: 'string', validate: validateDate }
  },

  // Send chat message
  sendChatMessage: {
    message: { required: true, type: 'string', validate: (v) => validateString(v, 1, 5000) },
    context: { type: 'string', validate: (v) => validateString(v, 0, 100) }
  },

  // Create pre-booking
  createPreBooking: {
    productId: { required: true, type: 'string', validate: validateId },
    quantity: { required: true, type: 'number', validate: validateQuantity },
    desiredDeliveryDate: { required: true, type: 'string', validate: validateDate }
  },

  // Update pre-booking
  updatePreBooking: {
    quantity: { type: 'number', validate: validateQuantity },
    desiredDeliveryDate: { type: 'string', validate: validateDate }
  },

  // Create blockchain transaction
  createBlockchainTx: {
    orderId: { required: true, type: 'string', validate: validateId },
    txType: { required: true, type: 'string', validate: (v) => ['PURCHASE', 'VERIFICATION', 'TRANSFER'].includes(v) },
    metadata: { type: 'object' }
  }
};

// ──────────────────────────────────────────────────────────────────────────
// 6. ERROR RESPONSE FORMATTER
// ──────────────────────────────────────────────────────────────────────────

export const formatErrorResponse = (error: any) => {
  if (error instanceof ApiError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        statusCode: error.statusCode
      }
    };
  }

  // Handle Prisma errors
  if (error.code === 'P2002') {
    return {
      success: false,
      error: {
        code: 'UNIQUE_CONSTRAINT',
        message: `${error.meta?.target?.[0] || 'Field'} already exists`,
        statusCode: 409
      }
    };
  }

  if (error.code === 'P2025') {
    return {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Resource not found',
        statusCode: 404
      }
    };
  }

  // Generic error
  return {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred'
        : error.message,
      statusCode: 500
    }
  };
};

// ──────────────────────────────────────────────────────────────────────────
// 7. PERMISSION CHECKING UTILITIES
// ──────────────────────────────────────────────────────────────────────────

export const checkUserRole = (userRole: string, allowedRoles: string[]) => {
  if (!allowedRoles.includes(userRole)) {
    throw ApiError.forbidden(`This action is only available for ${allowedRoles.join(', ')} users`);
  }
};

export const checkUserOwnership = (resourceUserId: string, requestUserId: string) => {
  if (resourceUserId !== requestUserId) {
    throw ApiError.forbidden('You do not have permission to access this resource');
  }
};

export const checkBuyerRole = (userRole: string) => {
  if (userRole !== 'BUYER') {
    throw ApiError.forbidden('This feature is only available for buyers');
  }
};

// ──────────────────────────────────────────────────────────────────────────
// 8. MIDDLEWARE FOR ERROR HANDLING
// ──────────────────────────────────────────────────────────────────────────

export const errorMiddleware = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Error]', {
    message: err.message,
    code: err.code,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  const errorResponse = formatErrorResponse(err);
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json(errorResponse);
};

// ──────────────────────────────────────────────────────────────────────────
// 9. RESPONSE FORMATTER
// ──────────────────────────────────────────────────────────────────────────

export const formatSuccessResponse = (data: any, message = 'Success') => {
  return {
    success: true,
    message,
    data
  };
};

export const sendSuccess = (res: Response, statusCode: number, data: any, message = 'Success') => {
  res.status(statusCode).json(formatSuccessResponse(data, message));
};

export const sendError = (res: Response, error: ApiError) => {
  const errorResponse = formatErrorResponse(error);
  res.status(error.statusCode).json(errorResponse);
};

// ──────────────────────────────────────────────────────────────────────────
// 10. EXAMPLE USAGE IN CONTROLLER
// ──────────────────────────────────────────────────────────────────────────

/*
EXAMPLE USAGE:

import { ApiError, asyncHandler, validateRequest, BuyerValidationSchemas } from '@/utils/errorHandling';

export const createBid = asyncHandler(async (req: Request, res: Response) => {
  // Validate request
  const { valid, errors } = validateRequest(req.body, BuyerValidationSchemas.placeBid);
  if (!valid) {
    throw ApiError.validationError(errors);
  }

  // Check authorization
  checkBuyerRole(req.user.role);

  // Business logic
  const bid = await BidService.createBid({
    buyerId: req.user.id,
    ...req.body
  });

  // Success response
  res.status(201).json({ success: true, data: bid });
});
*/
