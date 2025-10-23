import { URLS } from "~cypress/environment";

const link = Cypress.env("Edu") + "consumer-information/#academics";

describe.skip("MBIRSAEDU118", { tags: ["@education", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Verifying if url works", () => {
    cy.wait(5000);
    cy.get("#Example1 > div:nth-child(3)").should("have.attr", "aria-hidden");
  });
});
