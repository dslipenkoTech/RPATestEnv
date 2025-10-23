import { cypressBlockTesting } from "~cypress/apiFunctions/blockTesting/cypress-testing";
import { Test } from "~cypress/types/cypress-types";

export const test: Test = {
  name: `Faculty Directory Page`,
  tags: ["@faculty-directory-page", "@education"],
  pages: [[14003, "Testing main blocks on faculty directory page", {}]],
};

cypressBlockTesting(test);
