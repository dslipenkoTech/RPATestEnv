import { cypressBlockTesting } from "~cypress/apiFunctions/blockTesting/cypress-testing";
import { Test } from "~cypress/types/cypress-types";

export const test: Test = {
  name: `Directory Landing Page`,
  tags: ["@directory-landing-page", "@education"],
  pages: [
    [13986, "Alumni", {}],
    [13987, "Aviation", {}],
    [14152, "Continuing Education", {}],
    [13988, "Graduate", {}],
    [14143, "Undergraduate", {}],
    [13993, "Title IX", {}],
    [13989, "Online", { isolate: true }],
  ],
};

cypressBlockTesting(test);
