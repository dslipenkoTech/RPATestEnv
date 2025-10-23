import { Request, Response } from "express";
import { cypressService } from "../services/cypress-service";
import { Run } from "../models/run";
import { dbConnect } from "../lib/mongodb";
import { pusher } from "../lib/pusher";
import { normalizeEnvironment } from "../utils/environment";

export const startSession = async (req: Request, res: Response) => {
  try {
    await dbConnect();

    const { sessionId, testGroup, environment } = req.body;
    const environmentToUse = normalizeEnvironment(environment);

    return new Promise<void>(async (resolve, reject) => {
      await cypressService.run(testGroup, sessionId, environmentToUse, false, async (code, result) => {
        console.log("Session Controller: Session completed", code, result);

        if (code !== 0) cypressService.abortedSession(result);

        await Run.findOneAndUpdate(
          { sessionId: sessionId },
          { status: result.status, errorMessage: result.message, result: result.result }
        );
        await pusher.trigger("session-updates", "session-update", { data: sessionId, status: result.status });
        resolve();
      });
    });
  } catch (error) {
    console.error("Error in startSession:", error);
    await pusher.trigger("session-updates", "session-update", {
      data: req.body.sessionId,
      status: "failed",
      message: `Session failed due to an unexpected error: ${(error as Error).message}`,
    });
    res.status(500).json({ error: (error as Error).message });
  }
};

export const addActiveSession = async (req: Request, res: Response) => {
  const { sessionId, title, environment } = req.body;

  const environmentToUse = normalizeEnvironment(environment);

  try {
    await dbConnect();

    const activeSession = await Run.create({
      environment: environmentToUse,
      projectId: "none",
      sessionId: sessionId,
      testGroup: title,
      status: "active",
      sessions: 0,
      runs: 1,
      specs: [],
      startedTestsAt: new Date(),
      totalDuration: 0,
      totalFailed: 0,
      totalPassed: 0,
      totalPending: 0,
      totalSkipped: 0,
      totalSuites: 0,
      totalTests: 0,
    });
    return res.status(200).json({ activeSession });
  } catch (error) {
    console.error("Error in addActiveSession:", error);
    res.status(404).json({ error: (error as Error).message });
  }
};

export const cancelSession = async (req: Request, res: Response) => {
  const { sessionId } = req.body;
  try {
    await dbConnect();

    const processTerminated = await cypressService.cancelProcess(sessionId);

    const sessionToCancel = await Run.findOne({ sessionId: sessionId });
    if (!sessionToCancel) {
      return res.status(200).json({ message: "Session not found" });
    }

    await Run.deleteOne({ sessionId: sessionId });
    return res.status(200).json({
      message: processTerminated ? "Session cancelled and process terminated" : "Session cancelled (no active process found)",
    });
  } catch (error) {
    console.error("Error in cancelSession:", error);
    return res.status(500).json({ error: `Failed at cancelSession: ${(error as Error).message}` });
  }
};

export const deleteSession = async (req: Request, res: Response) => {
  const { sessionId } = req.body;
  await dbConnect();

  try {
    await Run.deleteOne({ sessionId: sessionId });
    return res.status(200).json({ message: "Session deleted" });
  } catch (error) {
    throw new Error(`Failed at deleteSession: ${(error as Error).message}`);
  }
};
