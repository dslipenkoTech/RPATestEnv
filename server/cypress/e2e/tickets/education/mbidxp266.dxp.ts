import { compileTicketTesting, regressionTesting } from "~cypress/apiFunctions/blockTesting/regression-testing";
import { ticketTest } from "~cypress/types/cypress-types";

const test: ticketTest = {
  name: `MBIDXP-266`,
  tags: ["@ticket", "education"],
  pages: [[12794, "Standard paragraph text renders at 18px", firstIssue, { tags: ["@test"] }]],
};

function firstIssue() {
  compileTicketTesting(12794).then(() => {
    cy.get("p").should("have.css", "font-size", "18px");
  });
}

regressionTesting(test);
