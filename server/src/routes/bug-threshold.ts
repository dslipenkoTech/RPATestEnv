import express from "express";
import { BugThresholdController } from "../controllers/bug-threshold-controller";
import { ValidationMiddleware } from "../middleware/validation";

const router = express.Router();

// GET bug threshold
router.get("/", BugThresholdController.getBugThreshold);

// PUT update bug threshold
router.put("/", ValidationMiddleware.validateBugThresholdUpdate, BugThresholdController.updateBugThreshold);

export default router;
