import { cypressBlockTesting } from "~cypress/apiFunctions/blockTesting/cypress-testing";
import { Test } from "~cypress/types/cypress-types";

export const test: Test = {
  name: `Search Page`,
  tags: ["@search-page", "@bible"],
  pages: [[281, "Search page", {}]],
};

cypressBlockTesting(test);
