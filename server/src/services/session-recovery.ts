import { dbConnect } from "../lib/mongodb";
import { Run } from "../models/run";
import { Status } from "../types/db-types";
import { cypressService } from "./cypress-service";
import Pusher from "pusher";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.PUSHER_KEY || !process.env.PUSHER_SECRET) throw new Error("PUSHER_KEY and PUSHER_SECRET must be set");

const pusher = new Pusher({
  appId: "1964268",
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: "us2",
  useTLS: true,
});

export const sessionRecoveryService = {
  /**
   * Finds and resumes all active or pending sessions
   * This should be called when the server starts up
   */
  resumeActiveSessions: async (): Promise<void> => {
    try {
      console.log("🔄 Checking for active sessions to resume...");

      await dbConnect();

      // Find all sessions that are currently active or pending
      const activeSessions = await Run.find({
        status: { $in: [Status.Active, Status.Pending] },
      }).select("sessionId testGroup environment status");

      if (activeSessions.length === 0) {
        console.log("✅ No active sessions found to resume");
        return;
      }

      // Remove duplicates by sessionId to prevent multiple resumptions of the same session
      const uniqueSessions = activeSessions.reduce((acc, session) => {
        if (!acc.find((s) => s.sessionId === session.sessionId)) {
          acc.push(session);
        } else {
          console.log(`⚠️ Skipping duplicate session: ${session.sessionId}`);
        }
        return acc;
      }, [] as typeof activeSessions);

      console.log(
        `🚀 Found ${uniqueSessions.length} unique active session(s) to resume:`,
        uniqueSessions.map((s) => ({ sessionId: s.sessionId, testGroup: s.testGroup, environment: s.environment }))
      );

      // Resume each session
      const resumePromises = uniqueSessions.map(async (session) => {
        try {
          // Validate that required fields exist
          if (!session.sessionId || !session.testGroup || !session.environment) {
            console.error(`❌ Session ${session.sessionId} missing required fields:`, {
              sessionId: session.sessionId,
              testGroup: session.testGroup,
              environment: session.environment,
            });
            return;
          }

          // Check if there's already an active process for this session
          // Note: This requires access to activeProcesses from cypress-service
          // For now, we'll add extra logging to track this
          console.log(`📋 Resuming session: ${session.sessionId} (${session.testGroup} - ${session.environment})`);
          console.log(`⏰ Recovery attempt at: ${new Date().toISOString()}`);

          // Add a small delay to prevent overwhelming the system
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Clear existing specs to avoid duplication and restart fresh
          await Run.findOneAndUpdate(
            { sessionId: session.sessionId },
            {
              $unset: { specs: "" },
              totalTests: 0,
              totalPassed: 0,
              totalFailed: 0,
              totalPending: 0,
              totalSkipped: 0,
              totalSuites: 0,
              totalDuration: 0,
            }
          );

          console.log(`🧹 Cleared existing specs for session ${session.sessionId} to avoid duplication`);

          // Resume the session using the existing cypress service
          return new Promise<void>(async (resolve, reject) => {
            await cypressService.run(session.testGroup, session.sessionId!, session.environment!, false, async (code, result) => {
              console.log(`✅ Session ${session.sessionId} recovery completed with code: ${code}`, result);

              // Update the session status
              if (code !== 0) {
                await cypressService.abortedSession(result);
              }

              const updatedSession = await Run.findOneAndUpdate(
                { sessionId: session.sessionId },
                {
                  status: result.status,
                  errorMessage: result.message,
                  result: result.result,
                }
              );

              console.log(`📊 Session ${session.sessionId} updated:`, updatedSession?.status);

              // Notify via pusher
              await pusher.trigger("session-updates", "session-update", {
                data: session.sessionId,
                status: result.status,
              });

              resolve();
            });
          });
        } catch (error) {
          console.error(`❌ Failed to resume session ${session.sessionId}:`, error);

          // Mark the session as failed if we can't resume it
          await Run.findOneAndUpdate(
            { sessionId: session.sessionId },
            {
              status: Status.Failed,
              errorMessage: `Failed to resume session after server restart: ${(error as Error).message}`,
            }
          );

          // Notify via pusher about the failure
          await pusher.trigger("session-updates", "session-update", {
            data: session.sessionId,
            status: "failed",
            message: `Session failed to resume after server restart: ${(error as Error).message}`,
          });
        }
      });

      // Wait for all sessions to start resuming (not necessarily complete)
      await Promise.allSettled(resumePromises);

      console.log("🎯 All active sessions have been queued for resumption");
    } catch (error) {
      console.error("❌ Error during session recovery:", error);
    }
  },
};
