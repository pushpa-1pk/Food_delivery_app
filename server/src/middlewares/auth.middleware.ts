import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { verifyAccessToken } from "@/utils/tokens";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = req.cookies.accessToken || (header?.startsWith("Bearer ") ? header.slice(7) : undefined);

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Authentication required" });
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid or expired token" });
  }
}
