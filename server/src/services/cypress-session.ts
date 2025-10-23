import { dbConnect } from "../lib/mongodb";
import { Run } from "../models/run";
import { BugThreshold } from "../models/bug-threshold";
import { IRun } from "../types/db-types";
import { PipelineStage } from "mongoose";

interface CypressResults {
  runId: string | null;
  envType: "integration" | "pre-production" | "production";
  config: { projectId: string | null };
  runs: unknown[];
  startedTestsAt: string;
  totalDuration: number;
  totalFailed: number;
  totalPassed: number;
  totalPending: number;
  totalSkipped: number;
  totalSuites: number;
  totalTests: number;
  specId?: string;
}

export const beforeRun = async (results: { runId: string }) => {
  console.log("runId", results.runId);
};

export const captureSessionResults = async (results: CypressResults) => {
  try {
    await dbConnect();

    const testResults = {
      projectId: results.config.projectId,
      sessions: results.runs.length,
      startedTestsAt: results.startedTestsAt,
      totalDuration: results.totalDuration,
      totalFailed: results.totalFailed,
      totalPassed: results.totalPassed,
      totalPending: results.totalPending,
      totalSkipped: results.totalSkipped,
      totalSuites: results.totalSuites,
      totalTests: results.totalTests,
      environment: results.envType,
      isActive: false,
    };

    if (results.specId) return;

    // Get bug threshold for percentage calculation
    let outcome: "passed" | "failed" | "accepted";
    let threshold = await BugThreshold.findOne();

    if (!threshold) {
      console.error("No bug threshold found, using default logic");
      if (results.totalFailed === 0) outcome = "passed";
      else outcome = "failed";
    } else {
      if (results.totalFailed === 0) outcome = "passed";
      else {
        const totalExecutedTests = results.totalPassed + results.totalFailed;
        const failedPercentage = totalExecutedTests > 0 ? (results.totalFailed / totalExecutedTests) * 100 : 0;

        if (failedPercentage <= threshold.thresholdPercentage) outcome = "accepted";
        else outcome = "failed";
      }
    }

    await Run.findOneAndUpdate({ sessionId: results.runId }, { $set: testResults, status: "completed", result: outcome }, { new: true });
    return;
  } catch (error) {
    console.error("Error capturing results", error as Error);
    return { message: `Error capturing results for session ${results.runId}: ${(error as Error).message}` };
  }
};

export const getSessionResults = async (sessionId: string) => {
  try {
    await dbConnect();

    const results = (await Run.findOne({ sessionId })) as IRun | null;
    return results;
  } catch (error) {
    console.error("Error getting results", error as Error);
    return { message: `Error getting results for session ${sessionId}: ${(error as Error).message}` };
  }
};

export const getAllSessionsResults = async (page?: number, limit?: number) => {
  await dbConnect();

  if (typeof page === "number" && typeof limit === "number") {
    // Use aggregation for efficient pagination with count
    const pipeline = [
      {
        $facet: {
          sessions: [
            { $sort: { createdAt: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
              $project: {
                projectId: 1,
                sessionId: 1,
                status: 1,
                result: 1,
                environment: 1,
                totalDuration: 1,
                totalFailed: 1,
                totalPassed: 1,
                totalPending: 1,
                totalSkipped: 1,
                totalSuites: 1,
                totalTests: 1,
                testGroup: 1,
                isFlagged: 1,
                flagNotes: 1,
                notes: 1,
                resolved: 1,
                runs: 1,
                startedTestsAt: 1,
                createdAt: 1,
                updatedAt: 1,
                specs: {
                  $map: {
                    input: "$specs",
                    as: "spec",
                    in: {
                      fileName: "$$spec.fileName",
                      specTags: "$$spec.specTags",
                      duration: "$$spec.duration",
                      totalTests: "$$spec.totalTests",
                      failedTests: "$$spec.failedTests",
                      passedTests: "$$spec.passedTests",
                      pendingTests: "$$spec.pendingTests",
                      skippedTests: "$$spec.skippedTests",
                      tests: {
                        $map: {
                          input: "$$spec.tests",
                          as: "test",
                          in: {
                            description: "$$test.description",
                            state: "$$test.state",
                            duration: "$$test.duration",
                            isFlagged: "$$test.isFlagged",
                            resolved: "$$test.resolved",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const [result] = await Run.aggregate(pipeline as PipelineStage[]);
    const sessions = result.sessions;
    const total = result.totalCount[0]?.count || 0;

    return { sessions, total };
  } else {
    // For non-paginated requests (dashboard)
    const sessions = await Run.find({})
      .sort({ createdAt: -1 })
      .select({
        projectId: 1,
        sessionId: 1,
        status: 1,
        result: 1,
        environment: 1,
        totalDuration: 1,
        totalFailed: 1,
        totalPassed: 1,
        totalPending: 1,
        totalSkipped: 1,
        totalSuites: 1,
        totalTests: 1,
        testGroup: 1,
        isFlagged: 1,
        flagNotes: 1,
        notes: 1,
        resolved: 1,
        runs: 1,
        startedTestsAt: 1,
        createdAt: 1,
        updatedAt: 1,
        "specs.fileName": 1,
        "specs.specTags": 1,
        "specs.duration": 1,
        "specs.totalTests": 1,
        "specs.failedTests": 1,
        "specs.passedTests": 1,
        "specs.pendingTests": 1,
        "specs.skippedTests": 1,
        "specs.tests.description": 1,
        "specs.tests.state": 1,
        "specs.tests.duration": 1,
        "specs.tests.isFlagged": 1,
        "specs.tests.resolved": 1,
      })
      .exec();

    return { sessions, total: sessions.length };
  }
};

export const sessionResults = async (sessionId: string) => {
  await dbConnect();

  await Run.findOneAndUpdate({ sessionId }, { status: "failed" }, { new: true });
  return;
};

export const abortedSession = async (result: { sessionId: string; status: string; result: string }) => {
  // This function is called when the Cypress process is aborted due to internet connection issues or other reasons. When the session is aborted
  // the session doesn't record. It updates the session with the total number of specs that have at
  // least 1 test with state failed, passed, pending, or skipped.
  try {
    await dbConnect();

    const session = await Run.findOne({ sessionId: result.sessionId });
    if (!session) throw new Error(`Session ${result.sessionId} not found`);

    // Count specs that have at least 1 test with state failed, passed, pending, or skipped
    session.totalFailed = session.specs.filter((spec) => spec.tests.some((test) => test.state === "failed")).length;
    session.totalPassed = session.specs.filter((spec) => spec.tests.some((test) => test.state === "passed")).length;
    session.totalPending = session.specs.filter(
      (spec) => spec.tests.length > 0 && spec.tests.every((test) => test.state === "pending")
    ).length;
    session.totalSkipped = session.specs.filter(
      (spec) => spec.tests.length > 0 && spec.tests.every((test) => test.state === "skipped")
    ).length;

    await session.save();
    return;
  } catch (error) {
    console.error(`Error updating session ${result.sessionId}:`, error);
    return;
  }
};
