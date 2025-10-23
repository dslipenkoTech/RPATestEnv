import { compileTicketTesting, regressionTesting } from "~cypress/apiFunctions/blockTesting/regression-testing";
import { ticketTest } from "~cypress/types/cypress-types";

const test: ticketTest = {
  name: `MBIDXP-256`,
  tags: ["@ticket", "education"],
  pages: [[12794, "While on the screen view you can scroll all the way down to the bottom of the page", firstIssue, {}]],
};

function firstIssue() {
  compileTicketTesting(12794).then(() => {
    // step 1 switch to mobile view
    cy.viewport(375, 667);

    // step 2 click on this btn #mobile-nav > div > button
    cy.get("#mobile-nav > div > button").click();

    // step 3 check that while on the screen view you can scroll all the way down to the bottom of the page
    cy.scrollTo("bottom");
    cy.window().then((win) => {
      cy.get("body").then(($body) => {
        const scrollHeight = $body[0].scrollHeight;
        const windowHeight = win.innerHeight;
        const scrollTop = win.scrollY;
        expect(scrollHeight - (scrollTop + windowHeight)).to.be.lessThan(10);
      });
    });
  });
}

regressionTesting(test);
