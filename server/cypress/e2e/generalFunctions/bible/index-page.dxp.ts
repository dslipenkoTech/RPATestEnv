import { cypressBlockTesting } from "~cypress/apiFunctions/blockTesting/cypress-testing";
import { Test } from "~cypress/types/cypress-types";

export const test: Test = {
  name: `Index Page`,
  tags: ["@index-page", "@bible"],
  pages: [
    [9, "Stories", { tags: ["story-index-page"] }],
    [14, "News", { tags: ["news-index-page"] }],
  ],
};

cypressBlockTesting(test);
