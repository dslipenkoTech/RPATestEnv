import { Router } from "express";
import { testsController } from "../controllers/tests-controller";
import { folderController } from "../controllers/folder-controller";

const router = Router();

// Test file operations
router.get("/list", testsController.list);
router.post("/create", testsController.create);
router.post("/update", testsController.update);
router.delete("/delete/:relative", testsController.delete);

// Folder management
router.post("/folder/create", folderController.create);
router.post("/folder/rename", folderController.rename);
router.delete("/folder/delete/:folderRelative", folderController.delete);

export default router;
