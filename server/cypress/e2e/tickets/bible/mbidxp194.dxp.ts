import { compileTicketTesting, regressionTesting } from "~cypress/apiFunctions/blockTesting/regression-testing";
import { ticketTest } from "~cypress/types/cypress-types";

const test: ticketTest = {
  name: `MBIDXP-194`,
  tags: ["@ticket", "bible"],
  pages: [[281, "Devotional Detail Page should properly pull image from card tab view", firstIssue, {}]],
};

function firstIssue() {
  compileTicketTesting(281).then(() => {
    cy.get("#search-input")
      .type("marriage")
      .type("{enter}")
      .wait(2000)
      .then(() => {
        for (let i = 1; i <= 3; i++) {
          cy.get(`section > div > div > div:nth-child(${i}) > a > div.w-full.flex-grow > picture > img`)
            .should("exist")
            .should("be.visible");
        }
      });
  });
}

regressionTesting(test);
