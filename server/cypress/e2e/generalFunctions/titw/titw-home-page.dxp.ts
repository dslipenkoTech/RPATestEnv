import { cypressBlockTesting } from "~cypress/apiFunctions/blockTesting/cypress-testing";
import { Test } from "~cypress/types/cypress-types";

const test: Test = {
  name: `TITW Home Page`,
  tags: ["@titw", "@home-page"],
  pages: [[2982, "Testing Home Page", { tags: ["@review"], skip: true }]],
};

cypressBlockTesting(test);
