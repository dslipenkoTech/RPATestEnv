import { cypressBlockTesting } from "~cypress/apiFunctions/blockTesting/cypress-testing";
import { Test } from "~cypress/types/cypress-types";

const env = Cypress.env("ENV_TYPE");

export const test: Test = {
  name: `Landing Page`,
  tags: ["@landing-page", "@bible"],
  pages: [
    [597, "How to Know Christ", { tags: ["dxp-form"] }],
    [577, "About", {}],
    [1293, "Pray for Moody", {}],
    [1663, "Visit Us", {}],
    [2109, "Subscribe to The Moody Connection", { tags: ["dxp-form"] }],
  ],
};

cypressBlockTesting(test);
