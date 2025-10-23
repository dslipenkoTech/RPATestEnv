import { cypressBlockTesting } from "~cypress/apiFunctions/blockTesting/cypress-testing";
import { Test } from "~cypress/types/cypress-types";

export const test: Test = {
  name: `Search Result Page`,
  tags: ["@search-results-page", "@education"],
  pages: [[13994, "Search", {}]],
};

cypressBlockTesting(test);
