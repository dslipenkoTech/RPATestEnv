import { cypressBlockTesting } from "~cypress/apiFunctions/blockTesting/cypress-testing";
import { Test } from "~cypress/types/cypress-types";

const test: Test = {
  name: `TITW Landing Page`,
  tags: ["@titw", "@landing-page"],
  pages: [
    [6651, "Family studies", {}],
    [6652, "Get the app", {}],
    [6653, "Grow", {}],
    [6655, "Subscribe", { tags: ["dxp-form"] }],
    [6649, "About", {}],
  ],
};

cypressBlockTesting(test);
