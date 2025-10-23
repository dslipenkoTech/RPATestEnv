import fs from "fs";
import path from "path";
import { getE2eRoot } from "../services/tests-file-service";

export const folderController = {
  create: async (req: any, res: any) => {
    try {
      const { parentPath = "", folderName } = req.body as { parentPath?: string; folderName?: string };

      if (!folderName || /[\\:*?"<>|]/.test(folderName)) return res.status(400).json({ error: "Invalid or missing folderName" });

      const e2eRoot = getE2eRoot();

      // Sanitize parent path
      const sanitizedParent = parentPath.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
      if (sanitizedParent.includes("..")) return res.status(400).json({ error: "Invalid parentPath" });

      const targetRelative = sanitizedParent ? `${sanitizedParent}/${folderName}` : folderName;
      const targetFull = path.join(e2eRoot, targetRelative);
      if (!targetFull.startsWith(e2eRoot)) return res.status(400).json({ error: "Invalid resolved path" });

      if (fs.existsSync(targetFull)) return res.status(409).json({ error: "Folder already exists" });
      fs.mkdirSync(targetFull, { recursive: true });

      return res.status(201).json({ message: "Folder created", relative: targetRelative });
    } catch (error) {
      console.error("Error creating folder:", error as Error);
      return res.status(500).json({ error: "Failed to create folder", details: error instanceof Error ? error.message : "Unknown error" });
    }
  },

  rename: async (req: any, res: any) => {
    try {
      const { oldPath, newName } = req.body as { oldPath?: string; newName?: string };
      if (!oldPath || !newName) return res.status(400).json({ error: "Missing oldPath or newName" });
      if (/[/\\]/.test(newName) || /[\\:*?"<>|]/.test(newName)) return res.status(400).json({ error: "Invalid newName" });
      if (oldPath.includes("..")) return res.status(400).json({ error: "Invalid oldPath" });

      const e2eRoot = getE2eRoot();

      const oldRel = oldPath.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
      const oldFull = path.join(e2eRoot, oldRel);

      if (!oldFull.startsWith(e2eRoot)) return res.status(400).json({ error: "Invalid path" });
      if (!fs.existsSync(oldFull) || !fs.statSync(oldFull).isDirectory()) return res.status(404).json({ error: "Folder not found" });

      const parentDir = path.dirname(oldFull);
      const newFull = path.join(parentDir, newName);
      if (fs.existsSync(newFull)) return res.status(409).json({ error: "A file/folder with the new name already exists" });

      fs.renameSync(oldFull, newFull);
      const newRelative = path.relative(e2eRoot, newFull).replace(/\\/g, "/");

      return res.status(200).json({ message: "Folder renamed", oldRelative: oldRel, newRelative });
    } catch (error) {
      console.error("Error renaming folder:", error as Error);

      return res.status(500).json({ error: "Failed to rename folder", details: error instanceof Error ? error.message : "Unknown error" });
    }
  },

  delete: async (req: any, res: any) => {
    try {
      const { folderRelative } = req.params as { folderRelative?: string };
      const { recursive } = req.query as { recursive?: string };
      if (!folderRelative) return res.status(400).json({ error: "Missing folderRelative" });

      const decoded = decodeURIComponent(folderRelative);
      if (decoded.includes("..")) return res.status(400).json({ error: "Invalid folderRelative" });

      const e2eRoot = getE2eRoot();
      const full = path.join(e2eRoot, decoded);
      if (!full.startsWith(e2eRoot)) return res.status(400).json({ error: "Invalid path" });
      if (!fs.existsSync(full)) return res.status(404).json({ error: "Folder not found" });
      if (!fs.statSync(full).isDirectory()) return res.status(400).json({ error: "Not a folder" });
      if (full === e2eRoot) return res.status(400).json({ error: "Cannot delete root" });

      const isEmpty = fs.readdirSync(full).length === 0;
      if (!isEmpty && recursive !== "true")
        return res.status(400).json({ error: "Folder not empty. Pass ?recursive=true to delete recursively." });

      if (recursive === "true") fs.rmSync(full, { recursive: true, force: true });
      else fs.rmdirSync(full);

      return res.status(200).json({ message: "Folder deleted", relative: decoded });
    } catch (error) {
      console.error("Error deleting folder:", error as Error);

      return res.status(500).json({ error: "Failed to delete folder", details: error instanceof Error ? error.message : "Unknown error" });
    }
  },
};
