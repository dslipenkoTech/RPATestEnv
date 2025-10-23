import { compileTicketTesting, regressionTesting } from "~cypress/apiFunctions/blockTesting/regression-testing";
import { ticketTest } from "~cypress/types/cypress-types";

const test: ticketTest = {
  name: `MBIDXP-246`,
  tags: ["@ticket", "titw"],
  pages: [[2982, "The footer logo, which is an SVG image, should be displaying at the bottom of the page", firstIssue, {}]],
};

function firstIssue() {
  compileTicketTesting(2982).then(() => {
    cy.get("#Layer_1").should("be.visible").should("have.attr", "xmlns");
  });
}

regressionTesting(test);
