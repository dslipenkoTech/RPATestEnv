import mongoose, { Model } from "mongoose";
const Schema = mongoose.Schema;

import { IRun, Status, TestState } from "../types/db-types";

const testSchema = new Schema<IRun>(
  {
    projectId: {
      type: String,
      required: true,
    },
    sessionId: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(Status),
    },
    result: {
      type: String,
      required: false,
      enum: ["passed", "failed", "accepted"],
    },
    runs: {
      type: Number,
      required: true,
      enum: [1, 2, 3],
      default: 1,
    },
    environment: {
      type: String,
      required: true,
      enum: ["production", "pre-production", "integration"],
    },
    errorMessage: {
      type: String,
      required: false,
    },
    sessions: {
      type: Number,
      required: true,
    },
    startedTestsAt: {
      type: Date,
      required: true,
    },
    totalDuration: {
      type: Number,
      required: true,
    },
    totalFailed: {
      type: Number,
      required: true,
    },
    totalPassed: {
      type: Number,
      required: true,
    },
    totalPending: {
      type: Number,
      required: true,
    },
    totalSkipped: {
      type: Number,
      required: true,
    },
    totalSuites: {
      type: Number,
      required: true,
    },
    totalTests: {
      type: Number,
      required: true,
    },
    testGroup: {
      type: String,
      required: false,
    },
    isFlagged: {
      type: Boolean,
      required: false,
      default: false,
    },
    flagNotes: {
      type: String,
      required: false,
    },
    notes: {
      type: String,
      required: false,
    },
    resolved: {
      type: Boolean,
      required: false,
      default: false,
    },
    specs: [
      {
        fileName: {
          type: String,
          required: true,
        },
        run: {
          type: Number,
          required: false,
          enum: [0, 1, 2],
        },
        specTags: [String],
        fullPath: {
          type: String,
          required: true,
        },
        duration: {
          type: Number,
          required: true,
        },
        totalTests: {
          type: Number,
          required: true,
        },
        failedTests: {
          type: Number,
          required: true,
        },
        passedTests: {
          type: Number,
          required: true,
        },
        pendingTests: Number,
        skippedTests: Number,
        tests: [
          {
            name: String,
            description: String,
            displayError: String,
            duration: Number,
            state: {
              type: String,
              enum: Object.values(TestState),
            },
            testTags: [String],
            error: String,
            url: String,
            isFlagged: {
              type: Boolean,
              required: false,
              default: false,
            },
            flagNotes: {
              type: String,
              required: false,
            },
            resolved: {
              type: Boolean,
              required: false,
              default: false,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add index for performance
testSchema.index({ createdAt: -1 });

export const Run: Model<IRun> = mongoose.model<IRun>("Run", testSchema);
