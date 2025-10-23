import { Request, Response, NextFunction } from "express";

export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationMiddleware {
  // Validate bug threshold update request
  static validateBugThresholdUpdate(req: Request, res: Response, next: NextFunction): void {
    const errors: ValidationError[] = [];
    const { thresholdAmount, thresholdPercentage } = req.body;

    // Check if at least one field is provided
    if (thresholdAmount === undefined && thresholdPercentage === undefined) {
      errors.push({
        field: "request",
        message: "At least one threshold value must be provided",
      });
    }

    // Validate threshold percentage
    if (thresholdPercentage !== undefined) {
      if (typeof thresholdPercentage !== "number") {
        errors.push({ field: "thresholdPercentage", message: "Threshold percentage must be a number" });
      } else if (thresholdPercentage < 0 || thresholdPercentage > 100) {
        errors.push({ field: "thresholdPercentage", message: "Threshold percentage must be between 0 and 100" });
      }
    }

    // Validate threshold amount
    if (thresholdAmount !== undefined) {
      if (typeof thresholdAmount !== "number") {
        errors.push({ field: "thresholdAmount", message: "Threshold amount must be a number" });
      } else if (thresholdAmount < 0) {
        errors.push({ field: "thresholdAmount", message: "Threshold amount must be non-negative" });
      }
    }

    if (errors.length > 0) {
      res.status(400).json({
        error: "Validation failed",
        message: "Request validation failed",
        details: errors,
      });
      return;
    }

    next();
  }
}
