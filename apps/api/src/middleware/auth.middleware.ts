/* ========================================================================
   Auth Middleware — Verify JWT & attach user to request
   ======================================================================== */

import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import prisma from "../prisma/client";
import { ApiError } from "../utils/ApiError";

export interface AuthPayload {
  userId: string;
  role: string;
  email: string;
}

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const authMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw ApiError.unauthorized("Missing or invalid authorization header");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthPayload;

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true, email: true, isActive: true },
    });

    if (!user || !user.isActive) {
      throw ApiError.unauthorized("User account is inactive or deleted");
    }

    req.user = { userId: user.id, role: user.role, email: user.email };
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(ApiError.unauthorized("Invalid or expired token"));
    } else {
      next(error);
    }
  }
};
