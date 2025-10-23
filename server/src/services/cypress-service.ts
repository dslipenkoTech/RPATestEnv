import * as processModule from "./cypress-process";
import * as sessionModule from "./cypress-session";
import * as specModule from "./cypress-spec";

export { extractPagesFromTest } from "./cypress-spec";

export const cypressService = {
  // Process-related functions
  run: processModule.run,
  cancelProcess: processModule.cancelProcess,
  reRunFailedTests: processModule.reRunFailedTests,

  // Session-related functions
  beforeRun: sessionModule.beforeRun,
  captureResults: sessionModule.captureSessionResults,
  captureSessionResults: sessionModule.captureSessionResults,
  getResults: sessionModule.getSessionResults,
  getAllSessions: sessionModule.getAllSessionsResults,
  sessionResults: sessionModule.sessionResults,
  abortedSession: sessionModule.abortedSession,

  // Spec-related functions
  captureSpecs: specModule.captureSpecs,
  getSpecTags: specModule.getSpecTags,
  getTestTags: specModule.getTestTags,
  captureTestUrl: specModule.captureTestUrl,
};
