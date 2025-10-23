import { BugThreshold } from "../models/bug-threshold";
import { Run } from "../models/run";
import { IBugThreshold } from "../types/db-types";

export interface BugThresholdUpdateResult {
  threshold: IBugThreshold;
  updatedRuns: number;
  message: string;
}

export class BugThresholdService {
  // Get the current bug threshold, creating default if it doesn't exist
  static async getBugThreshold(): Promise<IBugThreshold> {
    try {
      let threshold = await BugThreshold.findOne();

      if (!threshold) {
        threshold = new BugThreshold({
          thresholdAmount: 50,
          thresholdPercentage: 80,
        });
        await threshold.save();
      }

      return threshold;
    } catch (error) {
      console.error("Error fetching bug threshold:", error);
      throw new Error("Failed to fetch bug threshold");
    }
  }

  //Calculate test outcome based on failed tests and threshold
  static calculateOutcome(totalFailed: number, totalPassed: number, threshold: IBugThreshold): "passed" | "failed" | "accepted" {
    if (totalFailed === 0) return "passed";

    const totalExecutedTests = totalPassed + totalFailed;
    const failedPercentage = totalExecutedTests > 0 ? (totalFailed / totalExecutedTests) * 100 : 0;

    if (failedPercentage <= threshold.thresholdPercentage) return "accepted";
    else return "failed";
  }

  // Update bug threshold and recalculate all existing run outcomes
  static async updateBugThreshold(data: { thresholdAmount?: number; thresholdPercentage?: number }): Promise<BugThresholdUpdateResult> {
    try {
      // Validate input data
      if (data.thresholdPercentage !== undefined && (data.thresholdPercentage < 0 || data.thresholdPercentage > 100)) {
        console.error("Threshold percentage must be between 0 and 100");
        throw new Error("Threshold percentage must be between 0 and 100");
      }

      if (data.thresholdAmount !== undefined && data.thresholdAmount < 0) {
        console.error("Threshold amount must be non-negative");
        throw new Error("Threshold amount must be non-negative");
      }

      let threshold = await BugThreshold.findOne();
      if (!threshold) {
        // Create new threshold
        threshold = new BugThreshold({
          thresholdAmount: data.thresholdAmount ?? 50,
          thresholdPercentage: data.thresholdPercentage ?? 80,
        });
      } else {
        // Update existing threshold
        if (data.thresholdAmount !== undefined) threshold.thresholdAmount = data.thresholdAmount;
        if (data.thresholdPercentage !== undefined) threshold.thresholdPercentage = data.thresholdPercentage;
      }
      await threshold.save();

      // Recalculate outcomes for all existing runs
      const runs = await Run.find({});
      let updatedCount = 0;

      for (const run of runs) {
        const newOutcome = this.calculateOutcome(run.totalFailed, run.totalPassed, threshold);

        if (run.result !== newOutcome) {
          run.result = newOutcome;
          await run.save();
          updatedCount++;
        }
      }

      console.log(`Recalculated outcomes: ${updatedCount} runs updated out of ${runs.length} total runs`);

      return {
        threshold,
        updatedRuns: updatedCount,
        message: `Threshold updated and ${updatedCount} runs recalculated`,
      };
    } catch (error) {
      console.error("Error updating bug threshold:", error as Error);
      throw error;
    }
  }
}
