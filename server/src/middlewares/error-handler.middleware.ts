import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { ApiError } from "@/utils/api-error";
import { logger } from "@/utils/logger";

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Validation failed",
      errors: error.flatten()
    });
  }

  if (error && (error as any).name === "ApiError") {
    return res.status((error as ApiError).statusCode).json({ message: (error as ApiError).message });
  }

  logger.error(error);
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
}
