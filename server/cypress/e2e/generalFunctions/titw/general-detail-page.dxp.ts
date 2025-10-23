import { cypressBlockTesting } from "~cypress/apiFunctions/blockTesting/cypress-testing";
import { Test } from "~cypress/types/cypress-types";

const test: Test = {
  name: `TITW Detail Page`,
  tags: ["@titw", "@general-detail-page"],
  pages: [
    [6873, "Contact us page", { tags: ["form"] }],
    [6654, "Site map page", {}],
  ],
};

cypressBlockTesting(test);
