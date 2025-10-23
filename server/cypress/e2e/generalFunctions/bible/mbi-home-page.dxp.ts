import { cypressBlockTesting } from "../../../apiFunctions/blockTesting/cypress-testing";
import { Test } from "~cypress/types/cypress-types";

export const test: Test = {
  name: `MBI Home Page`,
  tags: ["@home-page", "@bible"],
  pages: [[8, "Home Page", {}]],
};

cypressBlockTesting(test);
