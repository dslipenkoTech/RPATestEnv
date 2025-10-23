import { compileTicketTesting, regressionTesting } from "~cypress/apiFunctions/blockTesting/regression-testing";
import { ticketTest } from "~cypress/types/cypress-types";

let envType: string = Cypress.env("ENV_TYPE");

const test: ticketTest = {
  name: `MEDU926`,
  tags: ["@ticket", "education"],
  skip: envType !== "production",
  pages: [[30119, "Issue 1", firstIssue, { tags: ["@bug"] }]],
};

function firstIssue() {
  compileTicketTesting(30119).then((content: any) => {});
}

regressionTesting(test);
