import mongoose, { Model, Schema } from "mongoose";
import { IBugThreshold } from "src/types/db-types";

const bugThresholdSchema = new Schema<IBugThreshold>({
  thresholdAmount: {
    type: Number,
    required: true,
  },
  thresholdPercentage: {
    type: Number,
    required: true,
  },
});

export const BugThreshold: Model<IBugThreshold> = mongoose.model<IBugThreshold>("BugThreshold", bugThresholdSchema);
