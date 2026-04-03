/* ========================================================================
   Role Middleware — Role-based access control
   ======================================================================== */

import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const roleMiddleware = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
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
