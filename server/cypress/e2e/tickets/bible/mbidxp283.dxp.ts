import { compileTicketTesting, regressionTesting } from "~cypress/apiFunctions/blockTesting/regression-testing";
import { ticketTest } from "~cypress/types/cypress-types";

const test: ticketTest = {
  name: `MBIDXP-283`,
  tags: ["@ticket", "bible"],
  pages: [[12794, "All h3 should have font-proxima", firstIssue, { tags: ["@test"] }]],
};

function firstIssue() {
  compileTicketTesting(12794).then((content: any) => {
    cy.get("h3").each(($h3) => {
      cy.wrap($h3).should("have.class", "font-proxima");
    });
  });
}

regressionTesting(test);
