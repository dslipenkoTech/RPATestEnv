import { Router } from "express";
import { sessionController } from "../controllers/session-controller";

const router = Router();

router.post("/start", sessionController.startSession);
router.get("/getAll", sessionController.getAllSessions);
router.get("/flagged", sessionController.getFlaggedSessions);
router.post("/addActive", sessionController.addActiveSession);
router.post("/cancel", sessionController.cancelSession);
router.post("/delete", sessionController.deleteSession);
router.post("/flag", sessionController.flagSession);
router.post("/flag-test", sessionController.flagTest);
router.get("/:sessionId", sessionController.getSpecs);
router.post("/resolve/:sessionId", sessionController.resolveFlaggedSession);
router.post("/update-notes/:sessionId", sessionController.updateSessionNotes);
router.post("/update-settings/:sessionId", sessionController.updateSessionSettings);
// Charts
router.post("/testResultsTimeline", sessionController.getTestResultsTimeline);
export default router;
