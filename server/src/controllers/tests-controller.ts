import fs from "fs";
import path from "path";
import { listTestFiles, generateTestFileContent, getE2eRoot } from "../services/tests-file-service";

export const testsController = {
  list: async (req: any, res: any) => {
    try {
      const environmentParam = (req.query?.env || req.query?.environment || "integration") as string;
      const result = await listTestFiles(environmentParam);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error listing tests:", error as Error);

      res.status(500).json({ error: "Failed to list tests", details: error instanceof Error ? error.message : "Unknown error" });
    }
  },

  create: async (req: any, res: any) => {
    try {
      const { specName, specTags, tests, filePath, selectedFolder } = req.body;

      // Validate required fields
      if (!specName || !tests || !filePath || !selectedFolder) {
        return res.status(400).json({ error: "Missing required fields: specName, tests, filePath, and selectedFolder are required" });
      }

      const e2eRoot = getE2eRoot();
      const fullFilePath = path.join(e2eRoot, filePath);
      const dirPath = path.dirname(fullFilePath);

      // Ensure directory exists
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Check if file already exists
      if (fs.existsSync(fullFilePath)) {
        return res.status(409).json({ error: "File already exists at the specified path" });
      }

      // Generate the test file content
      const fileContent = generateTestFileContent(specName, specTags, tests);

      // Write the file
      fs.writeFileSync(fullFilePath, fileContent, "utf-8");

      res.status(201).json({ message: "Test file created successfully", filePath, fullPath: fullFilePath });
    } catch (error) {
      console.error("Error creating test file:", error as Error);
      res.status(500).json({ error: "Failed to create test file", details: error instanceof Error ? error.message : "Unknown error" });
    }
  },

  update: async (req: any, res: any) => {
    try {
      const { relative, specName, specTags, tests } = req.body as {
        relative?: string;
        specName?: string;
        specTags?: string[];
        tests?: Array<{ testName: string; testId: string; parsedTags: string[] }>;
      };

      if (!relative) return res.status(400).json({ error: "Missing relative path of spec file" });
      if (!specName || !tests) return res.status(400).json({ error: "Missing specName or tests" });

      const e2eRoot = getE2eRoot();
      const fullPath = path.join(e2eRoot, relative);

      if (!fullPath.startsWith(e2eRoot)) return res.status(400).json({ error: "Invalid path" });
      if (!fs.existsSync(fullPath)) return res.status(404).json({ error: "File not found" });

      // Only allow updating .dxp.ts specs
      if (!/\.dxp\.ts$/i.test(fullPath)) {
        return res.status(400).json({ error: "Only .dxp.ts specs can be updated" });
      }
      if (!/\.dxp\.ts$/i.test(fullPath)) {
        return res.status(400).json({ error: "Only .dxp.ts specs can be updated" });
      }

      const content = generateTestFileContent(specName, specTags || [], tests);
      fs.writeFileSync(fullPath, content, "utf-8");

      return res.status(200).json({ message: "Spec updated", relative });
    } catch (error) {
      console.error("Error updating test file:", error);
      return res
        .status(500)
        .json({ error: "Failed to update test file", details: error instanceof Error ? error.message : "Unknown error" });
    }
  },

  delete: async (req: any, res: any) => {
    try {
      // encoded relative path with slashes replaced
      const { relative } = req.params;
      if (!relative) return res.status(400).json({ error: "Missing relative path" });

      // Reconstruct relative path (client should encode using encodeURIComponent)
      const relDecoded = decodeURIComponent(relative);
      const e2eRoot = getE2eRoot();
      const full = path.join(e2eRoot, relDecoded);

      if (!full.startsWith(e2eRoot)) return res.status(400).json({ error: "Invalid path" });

      if (!fs.existsSync(full)) return res.status(404).json({ error: "File not found" });

      // Only allow deleting .ts / .tsx test files
      if (!/\.(t|j)sx?$/i.test(full)) return res.status(400).json({ error: "Can only delete test source files" });

      fs.unlinkSync(full);
      return res.status(200).json({ message: "Deleted", relative: relDecoded });
    } catch (error) {
      console.error("Error deleting test file:", error as Error);

      return res
        .status(500)
        .json({ error: "Failed to delete test file", details: error instanceof Error ? error.message : "Unknown error" });
    }
  },
};
