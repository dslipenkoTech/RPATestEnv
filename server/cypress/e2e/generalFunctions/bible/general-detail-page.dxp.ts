import { cypressBlockTesting } from "~cypress/apiFunctions/blockTesting/cypress-testing";
import { Test } from "~cypress/types/cypress-types";

export const test: Test = {
  name: `General Detail Page`,
  tags: ["@general-detail-page", "@bible"],
  pages: [
    [1251, "Moody Believes", {}],
    [607, "Careers", {}],
    [629, "Sitemap", {}],
  ],
};

cypressBlockTesting(test);
