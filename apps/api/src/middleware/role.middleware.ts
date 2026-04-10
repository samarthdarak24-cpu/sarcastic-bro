/* ========================================================================
   Role Middleware — Role-based access control
   ======================================================================== */

import type { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { ApiError } from "../utils/ApiError";

export const roleMiddleware = (...allowedRoles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized("Authentication required"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Access denied. Required roles: ${allowedRoles.join(", ")}. Your role: ${req.user.role}`
        )
      );
    }

    next();
  };
};

// Helper function for cleaner route definitions
export const requireRole = (roles: string[]) => roleMiddleware(...roles);

// Specific role helpers
export const requireFarmer = roleMiddleware('FARMER');
export const requireBuyer = roleMiddleware('BUYER');
export const requireFPO = roleMiddleware('FPO');
export const requireAdmin = roleMiddleware('ADMIN');
