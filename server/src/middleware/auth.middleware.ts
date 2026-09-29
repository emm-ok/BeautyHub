// server/src/middleware/require-authentication.ts

import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { getAuth } from "@clerk/express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        clerkId: string;
      };
    }
  }
}

export function requireAuthentication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const auth = getAuth(req);

    if (!auth.isAuthenticated || !auth.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    req.user = {
      clerkId: auth.userId,
    };

    return next();
  } catch (error) {
    console.error("Authentication middleware error:", error);

    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }
}

export {};