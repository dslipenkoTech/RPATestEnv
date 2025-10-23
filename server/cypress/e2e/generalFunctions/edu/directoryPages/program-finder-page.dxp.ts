import { cypressBlockTesting } from "~cypress/apiFunctions/blockTesting/cypress-testing";
import { Test } from "~cypress/types/cypress-types";

export const test: Test = {
  name: `Program Finder Page`,
  tags: ["@program-finder-page", "@education"],
  pages: [[14006, "Testing main blocks on program finder page", {}]],
};

cypressBlockTesting(test);
