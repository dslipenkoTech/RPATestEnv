import { cypressBlockTesting } from "~cypress/apiFunctions/blockTesting/cypress-testing";
import { Test } from "~cypress/types/cypress-types";

// Spec
export const test: Test = {
  name: `Home Page`,
  tags: ["@home-page", "@education"],
  pages: [[12794, "Testing main blocks on home page", {}]],
};

cypressBlockTesting(test);
