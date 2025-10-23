import { Request, Response } from "express";
import { BugThresholdService } from "../services/bug-threshold-service";

export class BugThresholdController {
  // Get the current bug threshold
  static async getBugThreshold(req: Request, res: Response): Promise<void> {
    try {
      const threshold = await BugThresholdService.getBugThreshold();
      res.json(threshold);
    } catch (error) {
      console.error("Controller error - getBugThreshold:", error);
      res.status(500).json({ error: "Failed to fetch bug threshold", message: error instanceof Error ? error.message : "Unknown error" });
    }
  }

  // Update bug threshold and recalculate run outcomes
  static async updateBugThreshold(req: Request, res: Response): Promise<void> {
    try {
      const { thresholdAmount, thresholdPercentage } = req.body;

      // Validate request body
      if (thresholdAmount === undefined && thresholdPercentage === undefined) {
        res.status(400).json({
          error: "Bad Request",
          message: "At least one threshold value must be provided",
        });
        return;
      }

      const result = await BugThresholdService.updateBugThreshold({ thresholdAmount, thresholdPercentage });

      res.json(result);
    } catch (error) {
      console.error("Controller error - updateBugThreshold:", error as Error);

      if (error instanceof Error && error.message.includes("must be")) {
        res.status(400).json({ error: "Bad Request", message: error.message });
      } else {
        res
          .status(500)
          .json({ error: "Failed to update bug threshold", message: error instanceof Error ? error.message : "Unknown error" });
      }
    }
  }
}
