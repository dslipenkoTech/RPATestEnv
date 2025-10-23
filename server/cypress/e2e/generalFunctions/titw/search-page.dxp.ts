import { cypressBlockTesting } from "~cypress/apiFunctions/blockTesting/cypress-testing";
import { Test } from "~cypress/types/cypress-types";

const test: Test = {
  name: `TITW Search Page`,
  tags: ["@titw", "@search-page"],
  pages: [[5634, "Titw search page", {}]],
};

cypressBlockTesting(test);
