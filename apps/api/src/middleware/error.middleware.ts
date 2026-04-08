/* ========================================================================
   Error Middleware — Global error handler
   ======================================================================== */

import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";
import { ZodError } from "zod";

export const errorMiddleware = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  // Generate request ID for tracking
  const requestId = req.headers["x-request-id"] || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Log error in development
  if (env.IS_DEV) {
    console.error("[ERROR]", {
      requestId,
      path: req.path,
      method: req.method,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Log only essential info in production
    console.error("[ERROR]", {
      requestId,
      path: req.path,
      method: req.method,
      message: err.message,
    });
  }

  // Zod validation error
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_FAILED",
        message: "Validation error",
        details: err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
          code: e.code,
        })),
        timestamp: new Date().toISOString(),
        requestId,
      },
    });
  }

  // Custom API error
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: getErrorCode(err.statusCode),
        message: err.message,
        ...(err.data && { details: err.data }),
        timestamp: new Date().toISOString(),
        requestId,
      },
    });
  }

  // Prisma known errors
  if ((err as any).code === "P2002") {
    return res.status(409).json({
      success: false,
      error: {
        code: "RESOURCE_CONFLICT",
        message: "A record with that unique field already exists",
        field: (err as any).meta?.target?.[0],
        timestamp: new Date().toISOString(),
        requestId,
      },
    });
  }

  if ((err as any).code === "P2025") {
    return res.status(404).json({
      success: false,
      error: {
        code: "RESOURCE_NOT_FOUND",
        message: "Record not found",
        timestamp: new Date().toISOString(),
        requestId,
      },
    });
  }

  if ((err as any).code === "P2003") {
    return res.status(400).json({
      success: false,
      error: {
        code: "FOREIGN_KEY_CONSTRAINT",
        message: "Foreign key constraint failed",
        timestamp: new Date().toISOString(),
        requestId,
      },
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: {
        code: "AUTH_TOKEN_INVALID",
        message: "Invalid authentication token",
        timestamp: new Date().toISOString(),
        requestId,
      },
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: {
        code: "AUTH_TOKEN_EXPIRED",
        message: "Authentication token has expired",
        timestamp: new Date().toISOString(),
        requestId,
      },
    });
  }

  // Unknown error
  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: env.IS_DEV ? err.message : "An unexpected error occurred",
      ...(env.IS_DEV && { stack: err.stack }),
      timestamp: new Date().toISOString(),
      requestId,
    },
  });
};

/**
 * Map status code to error code
 */
function getErrorCode(statusCode: number): string {
  const codeMap: Record<number, string> = {
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    409: "CONFLICT",
    422: "UNPROCESSABLE_ENTITY",
    429: "RATE_LIMIT_EXCEEDED",
    500: "INTERNAL_SERVER_ERROR",
    502: "BAD_GATEWAY",
    503: "SERVICE_UNAVAILABLE",
  };

  return codeMap[statusCode] || "UNKNOWN_ERROR";
}
