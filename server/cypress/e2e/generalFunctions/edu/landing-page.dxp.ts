import { cypressBlockTesting } from "~cypress/apiFunctions/blockTesting/cypress-testing";
import { Test } from "~cypress/types/cypress-types";

export const test: Test = {
  name: `Landing Page`,
  tags: ["@landing-page", "@education"],
  pages: [
    [13971, "About page", {}],
    [13983, "Academics", {}],
    [13985, "Admissions and Aid", {}],
    [14142, "Student Services", {}],
    [28914, "Visit Campus", {}],
    [14145, "Request Info", { tags: ["dxp-form"] }],
  ],
};

cypressBlockTesting(test);
