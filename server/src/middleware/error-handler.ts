import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class ErrorHandler {
  // Centralized error handling middleware
  static handleError(err: AppError, req: Request, res: Response, next: NextFunction): void {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log error details
    console.error(`Error ${statusCode}: ${message}`);
    console.error(`Stack: ${err.stack}`);
    console.error(`Request URL: ${req.method} ${req.url}`);
    console.error(`Request Body:`, req.body);

    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV === "development";

    const errorResponse = {
      error: statusCode === 500 ? "Internal Server Error" : "Request Failed",
      message: isDevelopment ? message : "An unexpected error occurred",
      ...(isDevelopment && { stack: err.stack }),
    };

    res.status(statusCode).json(errorResponse);
  }

  // Handle 404 errors
  static handleNotFound(req: Request, res: Response, next: NextFunction): void {
    const error: AppError = new Error(`Route ${req.originalUrl} not found`);
    error.statusCode = 404;
    error.isOperational = true;
    next(error);
  }

  // Create operational errors
  static createError(message: string, statusCode: number = 500): AppError {
    const error: AppError = new Error(message);
    error.statusCode = statusCode;
    error.isOperational = true;
    return error;
  }

  // Handle async errors
  static catchAsync(fn: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}
