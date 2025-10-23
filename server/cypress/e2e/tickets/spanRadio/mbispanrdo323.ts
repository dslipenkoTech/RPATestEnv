import { URLS } from "~cypress/environment";

const link = Cypress.env("Spanradio");

describe("MBISPANRDO323", { tags: ["@radio-moody", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Constant player live", () => {
    //Needs a top border to have contrast with the main content
    cy.checkCssValue("#radio-body > div > section", "border-top", "1px solid rgb(231, 229, 228)");
  });
});
