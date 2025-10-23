import { URLS } from "~cypress/environment";

const link = Cypress.env("Edu");
let envType: string = Cypress.env("CYPRESS_ENV_TYPE");

describe.skip("MBISPANRDO161", { tags: ["@education", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Testing if iframe exists", () => {
    cy.get("body > noscript:nth-child(1)").should("exist");
  });
});
