import { cypressBlockTesting } from "~cypress/apiFunctions/blockTesting/cypress-testing";
import { Test } from "~cypress/types/cypress-types";

export const test: Test = {
  name: `General Detail Page`,
  tags: ["@general-detail-page", "@education"],
  pages: [[14169, "About page", {}]],
};

cypressBlockTesting(test);
