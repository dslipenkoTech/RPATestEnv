import { cypressBlockTesting } from "~cypress/apiFunctions/blockTesting/cypress-testing";
import { Test } from "~cypress/types/cypress-types";

export const test: Test = {
  name: `Departments & Offices Directory Page`,
  tags: ["@departments-offices-directory-page", "@education"],
  pages: [[26976, "Testing main blocks on departments & offices directory page", {}]],
};

cypressBlockTesting(test);
