import { Request, Response } from "express";
import { Run } from "../models/run";
import { dbConnect } from "../lib/mongodb";

export const flagSession = async (req: Request, res: Response) => {
  const { sessionId, notes } = req.body;

  console.log("flagSession", sessionId, notes);
  try {
    await dbConnect();

    const sessionToFlag = await Run.findOne({ sessionId: sessionId });

    if (!sessionToFlag) return res.status(404).json({ message: "Session not found" });

    if (!sessionToFlag.isFlagged) {
      sessionToFlag.isFlagged = true;
    }

    if (typeof notes !== "undefined") {
      sessionToFlag.notes = notes;
    }

    await sessionToFlag.save();
    const message = sessionToFlag.isFlagged ? "Session flagged" : "Session already flagged";
    return res.status(200).json({ message });
  } catch (error) {
    console.error("Error in flagSession:", error);
    res.status(500).json({ error: `Failed at flagSession: ${(error as Error).message}` });
  }
};

export const resolveFlaggedSession = async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  try {
    await dbConnect();

    const sessionToResolve = await Run.findOne({ sessionId: sessionId });
    if (!sessionToResolve) return res.status(404).json({ message: "Session not found" });

    sessionToResolve.isFlagged = true;
    sessionToResolve.resolved = !sessionToResolve.resolved;
    await sessionToResolve.save();

    const message = sessionToResolve.resolved ? "Session resolved" : "Session unresolved";
    return res.status(200).json({ message });
  } catch (error) {
    throw new Error(`Failed at resolveFlaggedSession: ${(error as Error).message}`);
  }
};

export const updateSessionNotes = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const { notes } = req.body;

  try {
    await dbConnect();

    const sessionToUpdate = await Run.findOne({ sessionId: sessionId });
    if (!sessionToUpdate) return res.status(404).json({ message: "Session not found" });

    sessionToUpdate.notes = notes;
    await sessionToUpdate.save();

    return res.status(200).json({ message: "Session notes updated" });
  } catch (error) {
    throw new Error(`Failed at updateSessionNotes: ${(error as Error).message}`);
  }
};

export const updateSessionSettings = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const { result, environment } = req.body;

  try {
    await dbConnect();

    const sessionToUpdate = await Run.findOne({ sessionId: sessionId });
    if (!sessionToUpdate) return res.status(404).json({ message: "Session not found" });

    if (result && (result === "passed" || result === "failed" || result === "accepted")) {
      sessionToUpdate.result = result;
    }

    if (environment && ["production", "pre-production", "integration"].includes(environment)) {
      sessionToUpdate.environment = environment;
    }

    await sessionToUpdate.save();

    return res.status(200).json({
      message: "Session settings updated successfully",
      session: {
        sessionId: sessionToUpdate.sessionId,
        result: sessionToUpdate.result,
        environment: sessionToUpdate.environment,
      },
    });
  } catch (error) {
    console.error("Error in updateSessionSettings:", error);
    res.status(500).json({ error: `Failed at updateSessionSettings: ${(error as Error).message}` });
  }
};

export const flagTest = async (req: Request, res: Response) => {
  const { sessionId, testId, notes } = req.body;

  try {
    await dbConnect();

    const session = await Run.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({
        message: "Session not found",
        details: `No session found with ID: ${sessionId}`,
      });
    }

    let testFound = false;
    let updatedTest: any = null;

    for (const spec of session.specs) {
      for (const test of spec.tests) {
        if (test._id && test._id.toString() === testId) {
          testFound = true;
          if (notes === "" && test.isFlagged) {
            test.resolved = !test.resolved;
            test.isFlagged = true;
          } else {
            test.isFlagged = true;
            if (notes && notes.trim() !== "") {
              test.flagNotes = notes;
            }
            if (!test.resolved) {
              test.resolved = false;
            }
          }
          updatedTest = test;
          break;
        }
      }
      if (testFound) break;
    }

    if (!testFound) {
      return res.status(404).json({
        message: "Test not found",
        details: `No test found with ID: ${testId}`,
      });
    }

    if (!session.isFlagged) {
      session.isFlagged = true;
    }

    await session.save();

    return res.status(200).json({
      message: "Test updated successfully",
      test: {
        isFlagged: updatedTest?.isFlagged,
        flagNotes: updatedTest?.flagNotes,
        resolved: updatedTest?.resolved,
      },
    });
  } catch (error) {
    console.error("Error in flagTest:", error);
    res.status(500).json({
      message: "Failed to update test",
      details: (error as Error).message,
    });
  }
};
