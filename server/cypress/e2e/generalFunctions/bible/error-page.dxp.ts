import { cypressBlockTesting } from "~cypress/apiFunctions/blockTesting/cypress-testing";
import { Test } from "~cypress/types/cypress-types";

export const test: Test = {
  name: `Error Pages`,
  tags: ["@error-page", "@bible"],
  pages: [
    [965, "Error 500", {}],
    // [2143, "Error 404 - Page Not Found", {}], // This page fails to laod because it has a unique page layout
    [2144, "Error 401", {}],
  ],
};

cypressBlockTesting(test);
