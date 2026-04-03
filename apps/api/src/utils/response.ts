/* ========================================================================
   Response Helper — Standardized API response format
   ======================================================================== */

import type { Response } from "express";

interface SuccessResponse {
  success: true;
  data: any;
  message?: string;
  meta?: Record<string, any>;
}

export function sendSuccess(res: Response, data: any, message?: string, statusCode = 200, meta?: Record<string, any>) {
  const response: SuccessResponse = { success: true, data };
  if (message) response.message = message;
  if (meta) response.meta = meta;
  return res.status(statusCode).json(response);
}

export function sendCreated(res: Response, data: any, message = "Created successfully") {
  return sendSuccess(res, data, message, 201);
}

export function sendPaginated(res: Response, data: any[], total: number, page: number, limit: number) {
  return sendSuccess(res, data, undefined, 200, {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}
