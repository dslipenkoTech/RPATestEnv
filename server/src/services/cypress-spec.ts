import fs from "fs";
import ts from "typescript";

import { dbConnect } from "../lib/mongodb";
import { Run } from "../models/run";
import { IRun, ISpec, ITest } from "../types/db-types";
import { CypressTestResult } from "../types/cypress-types";

import specUrlService from "./spec-url-service";
import cypressConfig from "../../cypress.config";
import { getUrlEnvironment } from "../utils/environment";

interface SpecResults {
  runId: string;
  spec: { fileName: string; relative: string; name: string };
  reporterStats: {
    tests: number;
    passes: number;
    pending: number;
    failures: number;
    duration: number;
  };
  tests: { title: string | string[]; state: string; duration: number; displayError?: string }[];
  specTags?: string[];
  testTags?: string[][];
  specUrls?: { index: number; id: string | number; url: string }[];
  specId?: string;
}

export function extractPagesFromTest(filePath: string): { id: number; title: string }[] {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const sourceFile = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const result: { id: number; title: string }[] = [];

    function visit(node: ts.Node) {
      if (ts.isPropertyAssignment(node) && node.name.getText() === "pages" && ts.isArrayLiteralExpression(node.initializer)) {
        for (const element of node.initializer.elements) {
          if (ts.isArrayLiteralExpression(element)) {
            const [idNode, titleNode] = element.elements;
            if (ts.isNumericLiteral(idNode) && ts.isStringLiteral(titleNode)) {
              result.push({
                id: parseInt(idNode.text, 10),
                title: titleNode.text,
              });
            }
          }
        }
      }
      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return result;
  } catch (error) {
    console.error(`EXTRACT PAGES ERROR: Error extracting pages from test file ${filePath}:`, error);
    return [];
  }
}

export const captureSpecs = async (results: SpecResults) => {
  try {
    await dbConnect();

    const specResults = {
      totalTests: results.reporterStats.tests,
      passedTests: results.reporterStats.passes,
      pendingTests: results.reporterStats.pending,
      failedTests: results.reporterStats.failures,
      duration: results.reporterStats.duration,
      fileName: results.spec.fileName,
      fullPath: results.spec.relative,
      specTags: results.specTags && results.specTags.length > 0 ? results.specTags : [],
      tests: results.tests.map((test, index) => ({
        name: Array.isArray(test.title) ? test.title[0] : test.title,
        description: Array.isArray(test.title) ? test.title.slice(1).join(" - ") : "",
        displayError: test.displayError ? test.displayError.split("\n")[0] : undefined,
        duration: test.duration,
        state: test.state,
        testTags: results.testTags && results.testTags[index] ? results.testTags[index] : [],
        error: test.displayError ? test.displayError.split("\n")[0] : "",
        url: results.specUrls && results.specUrls[index] ? results.specUrls[index].url : "",
      })),
    };

    const currentSession = (await Run.findOne({ sessionId: results.runId })) as IRun | null;

    if (results.specId) {
      const spec = currentSession?.specs.find((spec: ISpec) => spec._id === results.specId);
      if (spec) {
        spec.tests = specResults.tests as ITest[];
        await currentSession?.save();
      } else {
        throw new Error(`Spec ${results.specId} not found`);
      }
    } else {
      await Run.findOneAndUpdate({ sessionId: results.runId }, { $push: { specs: specResults } }, { new: true });
    }
    return;
  } catch (error) {
    console.error("Error adding specs", error);
    return { message: `Error adding specs for session ${results.runId}: ${(error as Error).message}` };
  }
};

export const getSpecTags = async (spec: ISpec) => {
  try {
    const fileContent = fs.readFileSync(spec.absolute, "utf8");
    const tags = new Set<string>();

    // Check if file has .dxp.ts extension and add "dxp" tag
    if (spec.absolute.endsWith(".dxp.ts") || spec.fullPath?.endsWith(".dxp.ts")) tags.add("@dxp");

    const testObjectRegex = /tags:\s*\[(.*?)\]/;
    const testObjectMatch = fileContent.match(testObjectRegex);
    if (testObjectMatch) {
      const tagArray = testObjectMatch[1].match(/"([^"]+)"|'([^']+)'/g);
      if (tagArray) {
        tagArray.forEach((tag) => {
          const cleanTag = tag.replace(/['"]/g, "");
          tags.add(cleanTag);
        });
      }
    }

    const describeRegex = /describe\([^,]+,\s*{[^}]*tags:\s*\[(.*?)\]/g;
    let describeMatch;

    while ((describeMatch = describeRegex.exec(fileContent)) !== null) {
      const tagArray = describeMatch[1].match(/"([^"]+)"|'([^']+)'/g);
      if (tagArray) {
        tagArray.forEach((tag) => {
          const cleanTag = tag.replace(/['"]/g, "");
          tags.add(cleanTag);
        });
      }
    }

    const cypressTestingRegex = /\btags:\s*\[\.\.\.(?:[^,\]]*),\s*"([^"]+)"\]/;
    const cypressMatch = fileContent.match(cypressTestingRegex);
    if (cypressMatch) tags.add(cypressMatch[1]);

    return Array.from(tags);
  } catch (error) {
    console.error(`Error reading spec file ${spec.absolute}:`, error as Error);
    return [];
  }
};

export const getTestTags = async (spec: ISpec, results: CypressTestResult) => {
  try {
    const testTagsMap: { [index: number]: string[] } = {};

    // Initialize an empty array for each test in the results.
    results.tests.forEach((_, index) => (testTagsMap[index] = []));

    if (results.spec.name.toLowerCase().includes("dxp")) {
      try {
        const fileContent = fs.readFileSync(spec.absolute, "utf8");

        const extractPagesArray = (src: string): string | null => {
          const pagesIdx = src.indexOf("pages");
          if (pagesIdx === -1) return null;

          const firstBracket = src.indexOf("[", pagesIdx);
          if (firstBracket === -1) return null;

          let depth = 0;
          for (let i = firstBracket; i < src.length; i++) {
            const ch = src[i];
            if (ch === "[") depth++;
            else if (ch === "]") {
              depth--;
              if (depth === 0) return src.slice(firstBracket, i + 1);
            }
          }
          return null;
        };

        const rawPagesArray = extractPagesArray(fileContent);

        if (rawPagesArray) {
          // Sanitise → JSON-parsable string
          let pagesArrayString = rawPagesArray
            .replace(/\/\/.*$/gm, "") // strip line comments
            .replace(/\/\*[\s\S]*?\*\//g, "") // strip block comments
            .replace(/(\w+):/g, '"$1":') // quote object keys
            .replace(/'/g, '"') // single ➜ double quote
            .replace(/,\s*([\]}])/g, "$1"); // trailing comma

          try {
            const pagesArray = JSON.parse(pagesArrayString);

            pagesArray.forEach((page: any, pageIdx: number) => {
              let tags: string[] = [];

              if (Array.isArray(page)) tags = page[2]?.tags ?? [];
              else if (page && typeof page === "object") tags = page.tags ?? [];

              if (pageIdx + 1 < results.tests.length) testTagsMap[pageIdx + 1] = tags;
            });
          } catch (parseError) {
            console.error(`Failed to parse pages array for ${results.spec.name}:`, parseError as Error);
          }
        } else {
          console.error("No pages array found in the spec file – defaulting to empty test tag mapping");
        }
      } catch (error) {
        console.error(`ERROR processing DXP test tags for ${results.spec.name}:`, error as Error);
      }
    } else {
      try {
        const fileContent = fs.readFileSync(spec.absolute, "utf8");

        const lines = fileContent.split("\n");
        let currentTestIndex = -1;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];

          const itMatch = line.match(/it\(\s*["']([^"']+)["']/);
          if (itMatch) {
            currentTestIndex++;

            if (line.includes("tags:")) {
              const tagsMatch = line.match(/{\s*tags:\s*(\[[^\]]*\]|["'][^"']*["'])\s*}/);
              if (tagsMatch) {
                const tagsText = tagsMatch[1];
                const tags: string[] = [];

                if (tagsText.startsWith("[")) {
                  const tagArray = tagsText.match(/["']([^"']+)["']/g);
                  if (tagArray) {
                    tagArray.forEach((tag) => {
                      const cleanTag = tag.replace(/["']/g, "");
                      tags.push(cleanTag);
                    });
                  }
                } else {
                  const singleTag = tagsText.replace(/["']/g, "");
                  tags.push(singleTag);
                }

                if (currentTestIndex < results.tests.length) testTagsMap[currentTestIndex] = tags;
              }
            }
          }
        }
      } catch (error) {
        console.error(`Error reading spec file ${spec.absolute}:`, error as Error);
      }
    }
    return testTagsMap;
  } catch (error) {
    console.error(`Error getting test tags:`, error as Error);

    const emptyTagsMap: { [index: number]: string[] } = {};
    results.tests.forEach((_, index) => (emptyTagsMap[index] = []));

    return emptyTagsMap;
  }
};

export const captureTestUrl = async (spec: ISpec, results: CypressTestResult, environment: string) => {
  try {
    const specUrlsMap: { [index: number]: { index: number; id: string | number; url: string } } = {};

    results.tests.forEach((_, index) => (specUrlsMap[index] = { index, id: "", url: "" }));

    if (results.spec.name.toLowerCase().includes("dxp")) {
      try {
        const pages = extractPagesFromTest(spec.absolute);

        // Extract IDs in declaration order
        // Note: DXP tests have a "Get website information" test at index 0,
        // so page-specific tests start at index 1
        pages.forEach((page, idx) => {
          const testIndex = idx + 1; // Offset by 1 to skip the "Get website information" test
          if (testIndex < results.tests.length) specUrlsMap[testIndex].id = page.id;
        });

        // Fetch URLs in parallel with error handling
        await Promise.all(
          Object.values(specUrlsMap).map(async (row) => {
            if (row.id) {
              try {
                row.url = await specUrlService.fetchSpecUrl(String(row.id), environment);
              } catch (error) {
                console.error(`Failed to fetch URL for spec ID ${row.id}:`, error);
                row.url = ""; // Set empty URL on error
              }
            }
          })
        );

        return specUrlsMap;
      } catch (error) {
        console.error(`ERROR DXP TESTS: ${results.spec.name}:`, error as Error);
      }
    } else {
      try {
        const fileContent = fs.readFileSync(spec.absolute, "utf8");
        const linkMatch = fileContent.match(/link\s*=\s*Cypress\.env\(['"](.*?)['"]\)(?:\s*\+\s*['"](.*?)['"])?/);

        environment = getUrlEnvironment(environment);
        let link: string | null = null;

        if (linkMatch && linkMatch[1]) {
          const envVarName = linkMatch[1];
          const pathSegment = linkMatch[2] || "";
          link = "https://" + environment + "." + (cypressConfig.env as Record<string, string>)[envVarName] + pathSegment;

          if (link) {
            Object.keys(specUrlsMap).forEach((index) => (specUrlsMap[parseInt(index)].url = link!));
          }
        } else {
          console.error("No link found in the spec file");
        }
      } catch (error) {
        console.error(`Error reading spec file for URL capture: ${spec.fileName}`, error as Error);
      }
    }

    return Object.values(specUrlsMap);
  } catch (error) {
    console.error(`Error getting spec URLs:`, error as Error);

    const emptyUrlsMap: { [index: number]: { index: number; id: string | number; url: string } } = {};
    results.tests.forEach((_, index) => (emptyUrlsMap[index] = { index, id: "", url: "" }));

    return emptyUrlsMap;
  }
};
