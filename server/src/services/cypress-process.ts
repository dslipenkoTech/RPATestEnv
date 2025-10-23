import treeKill from "tree-kill";
import path from "path";
import fs from "fs";

import { IRun, ISpec, ITest } from "../types/db-types";
import { dbConnect } from "../lib/mongodb";
import { Run } from "../models/run";
import { ChildProcess, spawn, SpawnOptionsWithoutStdio } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFilePath = path.resolve(__dirname, "../../cypress.env.json");
const envConfig = JSON.parse(fs.readFileSync(envFilePath, "utf8"));
const recordKey = envConfig.env.CYPRESS_RECORD_KEY;

interface ProcessInfo {
  process: ChildProcess;
  hasProcessGroup: boolean;
}

interface RunResult {
  sessionId: string;
  status: string;
  result: "passed" | "failed" | "accepted";
  errorCode?: number;
  message?: string;
}

const activeProcesses = new Map<string, ProcessInfo>();

export const getSpawnOptions = (): SpawnOptionsWithoutStdio => ({
  stdio: ["pipe"],
  detached: true,
  shell: false,
  windowsHide: true,
  env: {
    ...process.env,
    FORCE_COLOR: "1",
  },
});

export const run = async (
  testGroup: string,
  sessionId: string,
  environment: string,
  custom: boolean = false,
  callback?: (code: number, result: RunResult) => void
): Promise<RunResult> => {
  return new Promise((resolve) => {
    let command: string;
    let hasResponded = false;
    let lastResponse: { code: number; result: RunResult } | null = null;
    let responseTimeout: NodeJS.Timeout | null = null;

    // Helper function to handle responses with prioritization for successful ones
    const sendResponse = (code: number, result: RunResult) => {
      console.log(`📝 Response received for session ${sessionId}: code ${code}, status: ${result.status}`);

      // Store this response
      const newResponse = { code, result };

      // If we haven't stored any response yet, or this is a successful response (code 0), use it
      if (!lastResponse || (code === 0 && lastResponse.code !== 0)) {
        lastResponse = newResponse;
        console.log(`✅ Accepting response for session ${sessionId}: code ${code} (${code === 0 ? "SUCCESS" : "FAILURE"})`);
      } else {
        console.log(`⚠️ Ignoring response for session ${sessionId}: code ${code} (keeping previous: ${lastResponse.code})`);
      }

      // Clear any existing timeout
      if (responseTimeout) clearTimeout(responseTimeout);

      // Set a timeout to send the final response (allows time for better responses to come in)
      responseTimeout = setTimeout(() => {
        if (lastResponse && !hasResponded) {
          hasResponded = true;
          activeProcesses.delete(sessionId);
          callback?.(lastResponse.code, lastResponse.result);
          resolve(lastResponse.result);
          console.log(`🎯 Final response sent for session ${sessionId}: code ${lastResponse.code}`);
        }
      }, 1000);
    };

    switch (testGroup) {
      case "All":
        command = `cypress run --record --key ${recordKey} --config screenshotOnRunFailure=false --env runId=${sessionId},envType=${environment}`;
        break;

      case "DXP":
        command = `cypress run --record --key ${recordKey} --config screenshotOnRunFailure=false --env runId=${sessionId},envType=${environment},grepTags=@dxp`;
        break;

      case "Publishers":
        command = `cypress run --record --key ${recordKey} --config screenshotOnRunFailure=false --env runId=${sessionId},envType=${environment},grepTags=@publishers`;
        break;

      case "Premise":
        command = `cypress run --record --key ${recordKey} --config screenshotOnRunFailure=false --env runId=${sessionId},envType=${environment},grepTags=@premise`;
        break;

      case "Premise Forms":
        command = `cypress run --record --key ${recordKey} --config screenshotOnRunFailure=false --env runId=${sessionId},envType=${environment},grepTags=@premise-form`;
        break;

      case "DXP Forms":
        command = `cypress run --record --key ${recordKey} --config screenshotOnRunFailure=false --env runId=${sessionId},envType=${environment},grepTags=@dxp-form`;
        break;

      default:
        resolve({ message: `Invalid test group: ${testGroup}`, status: "invalid", sessionId, result: "failed" });
        return;
    }

    const cmdParts = command.split(" ");
    const executable = cmdParts[0];
    const args = cmdParts.slice(1);

    const spawnOptions = {
      ...getSpawnOptions(),
      env: {
        ...process.env,
        FORCE_COLOR: "1",
        CYPRESS_ENV_TYPE: environment,
      },
    };

    const cypressProcess = spawn(executable, args, spawnOptions);

    // Add this console log to show the session starting
    console.log(`
--
🚀 Starting Cypress session ${sessionId}
--
      `);

    // This code tests whether the Cypress process was successfully put into a process group (on Unix systems)
    // so it can later kill all related processes together instead of one by one.
    if (process.platform !== "win32" && cypressProcess.pid) {
      try {
        process.kill(-cypressProcess.pid, 0);
        console.log(`
  --
  Process group established for ${sessionId} with PID ${cypressProcess.pid}
  --
          `);
      } catch (error) {
        console.error(`Process group not established for ${sessionId}, signals will be sent directly to process`, error as Error);
      }
    }

    activeProcesses.set(sessionId, {
      process: cypressProcess,
      hasProcessGroup: process.platform !== "win32" && Boolean(cypressProcess.pid),
    });

    cypressProcess.on("exit", (code, signal) => {
      console.log(`Process ${sessionId} exited with code ${code || 0} and signal ${signal || "none"}`);
      activeProcesses.delete(sessionId);
    });

    cypressProcess.stdout?.on("data", async (data: Buffer) => {
      const output = data.toString();
      console.log(output);

      if (output.includes("Can't run because no spec files were found.") && !hasResponded) {
        console.log("NO SPECS FOUND");
        const result = { sessionId, status: "failed", result: "failed" as const, errorCode: 2, message: "No spec files found" };
        sendResponse(2, result);
        return;
      } else if (output.includes("Run Finished") && !hasResponded) {
        console.log("RUN FINISHED");
        const currentSession = await Run.findOne({ sessionId });
        const outcome: "passed" | "failed" | "accepted" = currentSession?.result || "passed";

        const result: RunResult = {
          sessionId,
          status: "completed",
          result: outcome,
        };

        sendResponse(0, result);
        return;
      }
    });

    cypressProcess.stderr?.on("data", (data: Buffer) => {
      const output = data.toString();
      console.error(`[${sessionId}] STDERR:`, output);
    });

    cypressProcess.on("close", async (code: number) => {
      if (hasResponded) {
        console.log("🔄 Response already sent, skipping");
        return;
      }

      if (code === 0) {
        const currentSession = await Run.findOne({ sessionId });
        const outcome: "passed" | "failed" | "accepted" = currentSession?.result || "passed";

        const result: RunResult = { sessionId, status: "completed", result: outcome };
        sendResponse(0, result);
      } else {
        const result: RunResult = { sessionId, status: "failed", result: "failed", errorCode: code };
        sendResponse(code, result);
      }
    });
  });
};

export const cancelProcess = async (sessionId: string) => {
  const processInfo = activeProcesses.get(sessionId);

  if (processInfo) {
    return new Promise<boolean>((resolve) => {
      const { process: targetProcess } = processInfo;

      const pid = targetProcess.pid;
      if (!pid) {
        console.log("🚨 No PID found for process", sessionId);
        activeProcesses.delete(sessionId);
        resolve(false);
        return;
      } else {
        console.log("🔄 PID found for process", sessionId);
      }

      console.log(`Attempting to terminate process tree for session ${sessionId} (PID: ${pid})`);

      let isTerminated = false;

      const cleanup = () => {
        if (!isTerminated) {
          isTerminated = true;
          activeProcesses.delete(sessionId);
          resolve(true);
        }
      };

      if (process.platform !== "win32") {
        try {
          process.kill(-pid, "SIGTERM");
          console.log(`Sent SIGTERM to process group ${-pid}`);
        } catch (error) {
          console.error(`Could not terminate process group directly, falling back to tree-kill`, error as Error);
        }
      }

      treeKill(pid, "SIGTERM", (error) => {
        if (error) {
          console.error(`Tree-kill SIGTERM failed for ${sessionId}:`, error as Error);

          if (process.platform !== "win32") {
            try {
              process.kill(-pid, "SIGTERM");
              console.log(`Retried SIGTERM to process group ${-pid}`);
            } catch (error) {
              console.error(`Process group SIGTERM retry failed`, error as Error);
            }
          }

          treeKill(pid, "SIGKILL", (killErr) => {
            if (killErr) {
              console.error(`Tree-kill SIGKILL failed for ${sessionId}:`, killErr as Error);

              try {
                if (process.platform !== "win32") {
                  process.kill(-pid, "SIGKILL");
                  console.log(`Sent SIGKILL to process group ${-pid}`);
                } else {
                  process.kill(pid, "SIGKILL");
                  console.log(`Sent SIGKILL to process ${pid}`);
                }
              } catch (finalErr) {
                console.error(`Final kill attempt failed for ${sessionId}:`, finalErr as Error);
              }
            }
            cleanup();
          });
        } else {
          console.log(`🏁 Successfully terminated process tree for session ${sessionId}`);
          cleanup();
        }
      });

      setTimeout(() => {
        if (!isTerminated) {
          console.error(`🚨 Process termination timed out for session ${sessionId}`);
          try {
            if (process.platform !== "win32") {
              process.kill(-pid, "SIGKILL");
            } else {
              process.kill(pid, "SIGKILL");
            }
          } catch (error) {
            console.error(`Final timeout-based kill attempt failed:`, error as Error);
          }
          cleanup();
        }
      }, 5000);
    }).catch((error) => {
      console.error("🚨 Process termination failed:", error as Error);
      activeProcesses.delete(sessionId);
      return false;
    });
  }

  console.log(`🚨 No active Cypress process found for session ${sessionId}`);
  return Promise.resolve(false);
};

export const reRunFailedTests = async (sessionId: string) => {
  try {
    await dbConnect();
    console.log("🔄 Re-running failed tests for session", sessionId);

    const currentSession = (await Run.findOne({ sessionId })) as IRun | null;
    if (!currentSession || currentSession.runs >= 2) return;

    currentSession.runs++;
    await currentSession.save();

    const failedSpecs = currentSession.specs.filter((spec: ISpec) =>
      spec.tests?.some((test: ITest) => test.state === "failed" || test.state === "pending")
    );

    console.log("🔄 Failed specs", failedSpecs);

    await Promise.all(
      failedSpecs.map(async (spec: ISpec) => {
        console.log("🔄 Updating run for spec", spec._id);
        await Run.findOneAndUpdate({ sessionId, "specs._id": spec._id }, { $set: { "specs.$.run": 2 } }, { new: true });
      })
    );

    await Promise.all(
      failedSpecs.map(async (spec: ISpec) => {
        console.log("🔄 Running spec", spec.fullPath);

        const command = `cypress run --record --key ${recordKey} --env runId=${sessionId},specId=${spec._id} --spec ${spec.fullPath}`;
        const cmdParts = command.split(" ");
        const executable = cmdParts[0];
        const args = cmdParts.slice(1);

        return new Promise<void>((resolve, reject) => {
          const cypressProcess = spawn(executable, args, getSpawnOptions());
          const rerunId = `${sessionId}-rerun-${spec._id}`;

          activeProcesses.set(rerunId, {
            process: cypressProcess,
            hasProcessGroup: process.platform !== "win32" && Boolean(cypressProcess.pid),
          });

          let hasCleanedUp = false;
          const cleanup = () => {
            if (!hasCleanedUp) {
              hasCleanedUp = true;
              console.log("🔄 Cleaning up process", rerunId);

              const processInfo = activeProcesses.get(rerunId);
              if (processInfo?.process.pid) {
                console.log(`Cleaning up process ${rerunId} (PID: ${processInfo.process.pid})`);

                if (processInfo.hasProcessGroup) {
                  try {
                    process.kill(-processInfo.process.pid, "SIGTERM");
                    console.log(`Sent SIGTERM to process group for ${rerunId}`);
                  } catch (error) {
                    console.error(`Failed to terminate process group for ${rerunId}, falling back to tree-kill`, error as Error);

                    treeKill(processInfo.process.pid, "SIGTERM", (error) => {
                      if (error) {
                        console.error(`Tree-kill SIGTERM failed for ${rerunId}, trying SIGKILL`, error as Error);
                        try {
                          if (processInfo && processInfo.process && processInfo.process.pid)
                            process.kill(-processInfo.process.pid, "SIGKILL");
                        } catch (error) {
                          console.error(`Process group SIGKILL failed, attempting direct process termination`, error as Error);
                          try {
                            processInfo.process.kill("SIGKILL");
                          } catch (finalError) {
                            console.error(`All termination attempts failed for ${rerunId}`, finalError as Error);
                          }
                        }
                      }
                    });
                  }
                } else {
                  treeKill(processInfo.process.pid, "SIGTERM", (error) => {
                    if (error) {
                      console.error(`Tree-kill failed for ${rerunId}, attempting direct termination`, error as Error);
                      try {
                        processInfo.process.kill("SIGKILL");
                      } catch (error) {
                        console.error(`Failed to terminate process ${rerunId}`, error as Error);
                      }
                    }
                  });
                }
              }

              activeProcesses.delete(rerunId);
              resolve();
            }
          };

          const terminationTimeout = setTimeout(() => {
            if (!hasCleanedUp) {
              console.error(`Process termination timed out for ${rerunId}`);
              cleanup();
            }
          }, 5000);

          cypressProcess.once("exit", (code, signal) => {
            console.log(`Rerun process ${rerunId} exited with codes ${code || 0} and signal ${signal || "none"}`);
            clearTimeout(terminationTimeout);
            cleanup();
          });

          cypressProcess.stdout?.on("data", (data: Buffer) => {
            console.log("STDOUT Rerun", data.toString());
            if (data.toString().includes("(Run Finished)")) {
              clearTimeout(terminationTimeout);
              cleanup();
            }
          });

          cypressProcess.stderr?.on("data", (data: Buffer) => {
            console.error("STDERR Rerun", data.toString());
          });

          cypressProcess.once("error", (error) => {
            console.error(`Error during re-run of spec ${spec.fullPath}:`, error as Error);
            clearTimeout(terminationTimeout);
            cleanup();
            reject(error);
          });

          cypressProcess.once("close", (code: number) => {
            if (code === 0) {
              console.log(`Re-run of spec ${spec.fullPath} completed successfully.`);
            } else {
              console.error(`Re-run of spec ${spec.fullPath} failed with code ${code}.`);
              if (!hasCleanedUp) {
                reject(new Error(`Re-run failed with code ${code}`));
              }
            }
            cleanup();
          });
        });
      })
    );
    return;
  } catch (error) {
    console.error(`Error re-running failed tests: ${error as Error}`);
    return;
  }
};
