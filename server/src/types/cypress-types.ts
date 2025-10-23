// Types
export interface CypressTestResult {
  error: null | string;
  reporter: string;
  reporterStats: {
    suites: number;
    tests: number;
    passes: number;
    pending: number;
    failures: number;
    start: string;
    end: string;
    duration: number;
  };
  screenshots: any[];
  spec: {
    absolute: string;
    fileExtension: string;
    fileName: string;
    name: string;
    relative: string;
  };
  stats: {
    duration: number;
    endedAt: string;
    failures: number;
    passes: number;
    pending: number;
    skipped: number;
    startedAt: string;
    suites: number;
    tests: number;
  };
  tests: {
    attempts: any[];
    displayError: null | string;
    duration: number;
    state: "passed" | "failed" | "pending" | "skipped";
    title: string[];
  }[];
  video: null | string;
}
