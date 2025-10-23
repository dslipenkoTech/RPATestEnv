import express from "express";
import { Run } from "../models/run";

const router = express.Router();

// Constants
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Types
interface TimePeriod {
  name: "all" | "week" | "month" | "year";
  days: number | null;
}

interface AnalyticsStats {
  totalSessions: number;
  totalTests: number;
  totalPassedTests: number;
  totalFailedTests: number;
  totalPassed: number;
  totalFailed: number;
}

interface AnalyticsResponse {
  [key: string]: AnalyticsStats;
}

// Cache
let cachedAnalytics: AnalyticsResponse | null = null;
let cacheTimestamp: number = 0;

// Configuration
const TIME_PERIODS: TimePeriod[] = [
  { name: "all", days: null },
  { name: "week", days: 7 },
  { name: "month", days: 30 },
  { name: "year", days: 365 },
];

// Helper functions
const isCacheValid = (): boolean => {
  return cachedAnalytics !== null && Date.now() - cacheTimestamp < CACHE_DURATION;
};

const createMatchStage = (days: number | null) => {
  return days ? { createdAt: { $gt: new Date(Date.now() - days * MS_PER_DAY) } } : {};
};

const createAggregationPipeline = (matchStage: any) => [
  { $match: matchStage },
  {
    $facet: {
      sessionStats: [
        {
          $group: {
            _id: null,
            totalSessions: { $sum: 1 },
            totalPassed: { $sum: { $cond: [{ $eq: ["$result", "passed"] }, 1, 0] } },
            totalFailed: { $sum: { $cond: [{ $eq: ["$result", "failed"] }, 1, 0] } },
          },
        },
      ],
      testStats: [
        { $unwind: "$specs" },
        { $unwind: "$specs.tests" },
        {
          $match: {
            "specs.tests.state": { $nin: ["pending", "skipped"] },
            "specs.tests.description": { $ne: "Get website information" },
          },
        },
        {
          $group: {
            _id: null,
            totalTests: { $sum: 1 },
            totalPassedTests: { $sum: { $cond: [{ $eq: ["$specs.tests.state", "passed"] }, 1, 0] } },
            totalFailedTests: { $sum: { $cond: [{ $eq: ["$specs.tests.state", "failed"] }, 1, 0] } },
          },
        },
      ],
    },
  },
];

const processAggregationResult = (result: any[], periodName: string): { name: string; stats: AnalyticsStats } => {
  const sessionStats = result[0]?.sessionStats?.[0] || { totalSessions: 0, totalPassed: 0, totalFailed: 0 };
  const testStats = result[0]?.testStats?.[0] || { totalTests: 0, totalPassedTests: 0, totalFailedTests: 0 };

  return {
    name: periodName,
    stats: {
      totalSessions: sessionStats.totalSessions,
      totalTests: testStats.totalTests,
      totalPassedTests: testStats.totalPassedTests,
      totalFailedTests: testStats.totalFailedTests,
      totalPassed: sessionStats.totalPassed,
      totalFailed: sessionStats.totalFailed,
    },
  };
};

// GET sessions analytics
router.get("/", async (req, res) => {
  try {
    // Check cache first
    if (isCacheValid()) {
      return res.json(cachedAnalytics);
    }

    // Run aggregations for all time periods
    const aggregationResults = await Promise.all(
      TIME_PERIODS.map(async (period) => {
        const matchStage = createMatchStage(period.days);
        const pipeline = createAggregationPipeline(matchStage);
        const result = await Run.aggregate(pipeline);
        return processAggregationResult(result, period.name);
      })
    );

    // Transform to response format
    const analyticsData: AnalyticsResponse = aggregationResults.reduce((acc, { name, stats }) => {
      acc[name] = stats;
      return acc;
    }, {} as AnalyticsResponse);

    // Update cache
    cachedAnalytics = analyticsData;
    cacheTimestamp = Date.now();

    res.json(analyticsData);
  } catch (error) {
    console.error("Error fetching sessions analytics:", error);
    res.status(500).json({ error: "Failed to fetch sessions analytics" });
  }
});

export default router;
