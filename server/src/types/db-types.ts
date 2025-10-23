import { Document } from "mongoose";

// Schema Types
export enum Status {
  Active = "active",
  Pending = "pending",
  Completed = "completed",
  Failed = "failed",
}

export enum TestState {
  Failed = "failed",
  Passed = "passed",
  Skipped = "skipped",
  Pending = "pending",
}

export interface IBugThreshold extends Document {
  thresholdAmount: number;
  thresholdPercentage: number;
}

export interface IRun extends Document {
  _id: string;
  projectId: string;
  sessionId?: string;
  status: Status;
  result?: "passed" | "failed" | "accepted";
  runs: number;
  sessions: number;
  startedTestsAt: Date;
  totalDuration: number;
  totalFailed: number;
  totalPassed: number;
  totalPending: number;
  flagNotes?: string;
  totalSkipped: number;
  totalSuites: number;
  totalTests: number;
  testGroup: string;
  environment: "production" | "pre-production" | "integration";
  isFlagged?: boolean;
  specs: ISpec[];
  errorMessage?: string;
  notes?: string;
  resolved?: boolean;
  createdAt: Date;
}

export interface ITag {
  name: string;
}

export interface ISpec {
  _id: string;
  run: 0 | 1 | 2;
  fileName: string;
  fullPath: string;
  absolute: string;
  duration: number;
  totalTests: number;
  failedTests: number;
  passedTests: number;
  pendingTests: number;
  skippedTests: number;
  specTags: ITag[];
  tests: ITest[];
}

export interface ITest {
  _id: string;
  name: string;
  description: string;
  displayError?: string;
  duration: number;
  state: TestState;
  testTags: string[];
  error?: string;
  url?: string;
  isFlagged?: boolean;
  flagNotes?: string;
  resolved?: boolean;
}
