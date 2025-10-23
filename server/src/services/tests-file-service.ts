import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { extractPagesFromTest } from "./cypress-service";
import specUrlService from "./spec-url-service";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type TestItem = {
  fileName: string;
  name: string;
  relative: string;
  group: "tickets" | "general" | "other";
  pageIds?: number[];
  pageIdToName?: Record<number, string>;
  dxp?: {
    name?: string;
    tags?: string[];
    pages?: { id: number; title: string; url?: string }[];
    pageIds?: number[];
    pageIdToName?: Record<number, string>;
    pageIdToUrl?: Record<number, string>;
  };
};

// Recursively walks through a directory and returns all file and folder paths
export function walk(dir: string): string[] {
  const out: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const e of entries) {
    const full = path.join(dir, e.name);

    if (e.isDirectory()) {
      // push a marker path with trailing slash to identify folder presence
      out.push(full + path.sep); // folder marker
      out.push(...walk(full));
    } else out.push(full);
  }
  return out;
}

// Generates test file content based on spec name, tags, and tests
export function generateTestFileContent(
  specName: string,
  specTags: string[],
  tests: Array<{ testName: string; testId: string; parsedTags: string[] }>
): string {
  const tagsString = specTags.map((tag) => `"${tag}"`).join(", ");

  const pagesString = tests
    .map((test) => {
      const testTags = test.parsedTags.length > 0 ? `{ tags: [${test.parsedTags.map((tag) => `"${tag}"`).join(", ")}] }` : "{}";
      return `    [${test.testId}, "${test.testName}", ${testTags}],`;
    })
    .join("\n");

  return `import { cypressBlockTesting } from "~cypress/apiFunctions/blockTesting/cypress-testing";
import { Test } from "~cypress/types/cypress-types";

export const test: Test = {
  name: \`${specName}\`,
  tags: [${tagsString}],
  pages: [
${pagesString}
  ],
};

cypressBlockTesting(test);
`;
}

// Extracts test tags from a .dxp.ts file source code
export function extractTestTagsFromDxpFile(src: string): string[][] {
  // Looks for lines like: [123, "Test name", { tags: ["tag1", "tag2"] }],
  // and extracts the tags array for each test
  const testTagRegex = /\[\s*\d+\s*,\s*([`"']).*?\1\s*,\s*\{[^}]*tags\s*:\s*\[([^\]]*)\][^}]*\}\s*\]/g;
  const simpleTestRegex = /\[\s*\d+\s*,\s*([`"']).*?\1\s*,\s*\{[^}]*\}\s*\]/g;
  const lines = src.split(/\r?\n/);
  const tagsArr: string[][] = [];
  for (const line of lines) {
    let match = testTagRegex.exec(line);
    if (match) {
      const tagsRaw = match[2];
      const tags = tagsRaw
        .split(/,/) // split by comma
        .map((s) => s.replace(/\s+/g, " ").trim())
        .map((s) => {
          const m = s.match(/^[`"'](.*?)[`"']$/);
          return m ? m[1] : s;
        })
        .filter((s) => s.length > 0);
      tagsArr.push(tags);
    } else if (simpleTestRegex.test(line)) {
      tagsArr.push([]); // test with no tags
    }
    testTagRegex.lastIndex = 0;
    simpleTestRegex.lastIndex = 0;
  }
  return tagsArr;
}

// Gets the e2e root directory, handling different working directories (dev/prod)
export function getE2eRoot(): string {
  const candidates = [path.resolve(process.cwd(), "server/cypress/e2e"), path.resolve(__dirname, "../../cypress/e2e")];
  return candidates.find((p) => fs.existsSync(p)) || candidates[0];
}

// Parses a test file and extracts metadata
export async function parseTestFile(abs: string, e2eRoot: string, environmentParam: string): Promise<TestItem> {
  const relative = path.relative(e2eRoot, abs).replace(/\\/g, "/");
  const fileName = path.basename(abs);
  const name = fileName.replace(/\.(cy\.)?(t|j)sx?$/i, "");
  const relLower = relative.toLowerCase();

  let group: TestItem["group"] = "other";
  if (relLower.startsWith("tickets/")) group = "tickets";
  else if (relLower.startsWith("generalfunctions/")) group = "general";

  const item: TestItem = { fileName, name, relative, group };

  // If it's a .dxp.ts file, attempt to extract metadata (name, tags, pages, testTags)
  if (/\.dxp\.ts$/i.test(fileName)) {
    try {
      const src = fs.readFileSync(abs, "utf-8");

      // Remove block comments and keep line comments for page parsing filtering
      const withoutBlockComments = src.replace(/\/\*[\s\S]*?\*\//g, "");

      // Name: support backticks or quotes
      const nameMatch = withoutBlockComments.match(/\bname\s*:\s*([`"'])([\s\S]*?)\1/);
      const dxpName = nameMatch ? nameMatch[2].trim() : undefined;

      // Tags: extract string literals inside array
      let dxpTags: string[] | undefined = undefined;
      const tagsMatch = withoutBlockComments.match(/\btags\s*:\s*\[([\s\S]*?)\]/);
      if (tagsMatch) {
        const inside = tagsMatch[1]
          .split(/,/) // split by comma
          .map((s) => s.replace(/\s+/g, " ").trim())
          .filter((s) => !!s && !s.startsWith("//"))
          .map((s) => {
            const m = s.match(/^[`"'](.*?)[`"']$/);
            return m ? m[1] : s;
          })
          .filter((s) => s.length > 0);
        if (inside.length) dxpTags = inside as string[];
      }

      // Use robust AST-based extractor for pages
      const extracted = extractPagesFromTest(abs);
      let dxpPages: { id: number; title: string; url?: string }[] | undefined =
        extracted && extracted.length ? extracted.map((p) => ({ ...p })) : undefined;

      // Extract testTags for each test (if present)
      const testTags = extractTestTagsFromDxpFile(src);

      if (dxpName || dxpTags || dxpPages || testTags) {
        const pageIds = dxpPages?.map((p) => p.id) ?? [];
        const pageIdToName =
          dxpPages?.reduce<Record<number, string>>((acc, p) => {
            acc[p.id] = p.title;
            return acc;
          }, {}) ?? {};

        // Fetch URLs for each page id in parallel (best-effort)
        const pageIdToUrl: Record<number, string> = {};
        if (pageIds.length) {
          try {
            await Promise.all(
              pageIds.map(async (id) => {
                try {
                  const url = await specUrlService.fetchSpecUrl(String(id), environmentParam);
                  if (url) pageIdToUrl[id] = url;
                } catch (error) {
                  console.error("Error while fetching page URLs in tests-file-service:", error);
                }
              })
            );
          } catch (error) {
            console.error("Error while fetching page URLs in tests-file-service:", error as Error);
          }
        }

        // Attach URLs to pages
        if (dxpPages) dxpPages = dxpPages.map((p) => ({ ...p, url: pageIdToUrl[p.id] }));

        item.dxp = { name: dxpName, tags: dxpTags, pages: dxpPages, pageIds, pageIdToName, pageIdToUrl };
        item.pageIds = pageIds;
        item.pageIdToName = pageIdToName;

        // Attach testTags array to the item (for client use)
        if (testTags && testTags.length) (item as any).testTags = testTags;
      }
    } catch (error) {
      console.error(`Failed to parse .dxp.ts file (${relative}):`, error as Error);
    }
  }

  return item;
}

// Lists all test files in the e2e directory with their metadata
export async function listTestFiles(environmentParam: string): Promise<{
  tickets: TestItem[];
  general: TestItem[];
  other: TestItem[];
  folders: string[];
  total: number;
}> {
  const e2eRoot = getE2eRoot();

  let files: string[] = [];
  try {
    files = walk(e2eRoot);
  } catch (error) {
    console.error("Error while walking through the e2e directory in tests-file-service:", error as Error);
    return { tickets: [], general: [], other: [], folders: [], total: 0 };
  }

  const folderMarkers = files.filter((p) => p.endsWith(path.sep));
  const filePaths = files.filter((p) => !p.endsWith(path.sep));

  const all = await Promise.all(
    filePaths.filter((p) => /\.(ts|tsx|js|jsx)$/.test(p)).map((abs) => parseTestFile(abs, e2eRoot, environmentParam))
  );

  const tickets = all.filter((t) => t.group === "tickets");
  const general = all.filter((t) => t.group === "general");
  const other = all.filter((t) => t.group === "other");

  // Provide folder list excluding root and convert markers to relative without trailing slash
  const folders = folderMarkers
    .map((abs) => path.relative(e2eRoot, abs).replace(/\\/g, "/"))
    .filter((r) => r !== "")
    .map((r) => r.replace(/\/$/, ""));

  return { tickets, general, other, folders, total: all.length };
}
