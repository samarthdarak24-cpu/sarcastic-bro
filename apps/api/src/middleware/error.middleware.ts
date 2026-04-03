/* ========================================================================
   Error Middleware — Global error handler
   ======================================================================== */

import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";
import { ZodError } from "zod";

export const errorMiddleware = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  // Log error in development
  if (env.IS_DEV) {
    console.error("[ERROR]", err.message);
    if (err.stack) console.error(err.stack);
  }

  // Zod validation error
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // Custom API error
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Prisma known errors
  if ((err as any).code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "A record with that unique field already exists",
    });
  }

  if ((err as any).code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "Record not found",
    });
  }

  // Unknown error
  return res.status(500).json({
    success: false,
    message: env.IS_DEV ? err.message : "Internal server error",
  });
};
