import { compileTicketTesting, regressionTesting } from "~cypress/apiFunctions/blockTesting/regression-testing";
import { ticketTest } from "~cypress/types/cypress-types";

const test: ticketTest = {
  name: `MBIDXP-246`,
  tags: ["@ticket", "titw"],
  pages: [[7242, "The Article Detail Page block should always be visible.", firstIssue, { tags: ["@test"] }]],
};

function firstIssue() {
  compileTicketTesting(7242).then(() => {
    cy.get(
      "#todayintheword-app > div > div > div.space-y-6 > section > div > div.epi-contentfragment > section > div > div > p > a > img.campaignRibbon.desktopRibbon"
    )
      .should("be.visible")
      .should("have.attr", "src")
      .and("not.be.empty");
  });
}

regressionTesting(test);
