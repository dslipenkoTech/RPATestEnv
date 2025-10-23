import { defineConfig } from "cypress";
import { cypressService } from "./src/services/cypress-service";
import { ISpec } from "./src/types/db-types";
import { CypressTestResult } from "./src/types/cypress-types";

export default defineConfig({
  video: false,
  viewportHeight: 1900,
  viewportWidth: 1920,
  projectId: "wij42o",
  env: {
    grepFilterSpecs: true,
    Edu: "moody.edu/",
    Bible: "moodybible.org/",
    TW: "todayintheword.org/",
    Radio: "moodyradio.org/",
    Spanradio: "radiomoody.org/",
    Conf: "moodyconferences.com/",
    Pub: "moodypublishers.com/",
    CYPRESS_RECORD_KEY: process.env.CYPRESS_RECORD_KEY,
  },
  retries: { runMode: 2, openMode: 0 },
  e2e: {
    setupNodeEvents(on, config) {
      config.env = config.env || {};
      // ENV_TYPE can come from either --env flag or process environment
      config.env.ENV_TYPE = config.env.ENV_TYPE || process.env.CYPRESS_ENV_TYPE;
      console.log(`🌍 Cypress Environment Type: ${config.env.ENV_TYPE || "not set (will default to int)"}`);
      console.log(`🔗 Base API URL: ${config.env.API_BASE_URL}`);
      on("before:run", async (results) => {
        const runId = config.env.runId;
        await cypressService.beforeRun({ ...results, runId });
      });

      on("before:spec", async (spec) => {});

      on("after:spec", async (spec, results) => {
        const specTags = await cypressService.getSpecTags(spec as unknown as ISpec);
        const testTags = await cypressService.getTestTags(spec as unknown as ISpec, results as unknown as CypressTestResult);

        console.log("specTags", specTags);

        const environment: string = config.env.ENV_TYPE;
        if (!environment) throw new Error("ENV_TYPE is not set");

        const specUrls = await cypressService.captureTestUrl(
          spec as unknown as ISpec,
          results as unknown as CypressTestResult,
          environment
        );

        const runId = config.env.runId;
        const specId = config.env.specId;

        await cypressService.captureSpecs({
          ...results,
          runId,
          specId,
          specTags,
          testTags,
          specUrls,
        } as unknown as Parameters<typeof cypressService.captureSpecs>[0]);
      });

      on("after:run", async (results) => {
        const runId = config.env.runId;
        const specId = config.env.specId;

        "runs" in results &&
          (await cypressService.captureSessionResults({ ...results, runId, specId, envType: config.env.ENV_TYPE || "integration" }));
      });
    },
    testIsolation: true,
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    excludeSpecPattern: ["**/Api-Functions/**/*", "**/Bible-Api-Functions/**/*", "**/Titw-Api-Functions/**/*"],
  },
});
