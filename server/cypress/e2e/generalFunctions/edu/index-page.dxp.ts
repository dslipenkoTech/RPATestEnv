import { cypressBlockTesting } from "../../../apiFunctions/blockTesting/cypress-testing";
import { Test } from "../../../types/cypress-types";

export const test: Test = {
  name: `Index Page`,
  tags: ["@index-page", "@education"],
  pages: [[13990, "Stories", { tags: ["story-index-page"] }]],
};

cypressBlockTesting(test);
