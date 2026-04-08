/* ========================================================================
   Validation Middleware — Zod schema validation with sanitization
   ======================================================================== */

import type { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";
import sanitizeHtml from "sanitize-html";
import { ApiError } from "../utils/ApiError";

/**
 * Sanitize string inputs to prevent XSS attacks
 */
function sanitizeValue(value: any): any {
  if (typeof value === "string") {
    return sanitizeHtml(value, {
      allowedTags: [],
      allowedAttributes: {},
    });
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    const sanitized: any = {};
    for (const [key, val] of Object.entries(value)) {
      sanitized[key] = sanitizeValue(val);
    }
    return sanitized;
  }

  return value;
}

/**
 * Validate request body against Zod schema
 */
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Sanitize input first
      const sanitized = sanitizeValue(req.body);

      // Validate against schema
      const validated = schema.parse(sanitized);
      req.body = validated;

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
        }));

        return next(
          ApiError.badRequest("Validation failed", { errors })
        );
      }
      next(error);
    }
  };
};

/**
 * Validate request query parameters against Zod schema
 */
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.query);
      req.query = validated as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
        }));

        return next(
          ApiError.badRequest("Query validation failed", { errors })
        );
      }
      next(error);
    }
  };
};

/**
 * Validate request params against Zod schema
 */
export const validateParams = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.params);
      req.params = validated as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
        }));

        return next(
          ApiError.badRequest("Params validation failed", { errors })
        );
      }
      next(error);
    }
  };
};

/**
 * Common validation schemas
 */
export const commonSchemas = {
  id: z.object({
    id: z.string().uuid("Invalid ID format"),
  }),

  pagination: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),

  search: z.object({
    q: z.string().min(1).max(200).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  }),

  dateRange: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
};
