import { URLS } from "~cypress/environment";

const link = Cypress.env("Spanradio");

describe("MBISPANRDO322", { tags: ["@radio-moody", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Podcast block", () => {
    cy.wait(2000);
    cy.url().then((initialUrl) => {
      cy.get(".active > .EPiLink").first().click();
      cy.url().should("not.equal", initialUrl);
    });
  });
});
