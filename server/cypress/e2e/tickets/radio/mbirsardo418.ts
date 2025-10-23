import { URLS } from "~cypress/environment";

const link = Cypress.env("Spanradio");

describe("MBIRSARDO418", { tags: ["@radio-moody", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Search bar", () => {
    cy.clickElement(".search");
    cy.get("#search").type("Moody");
    cy.wait(4000);
    cy.clickElement(".results > :nth-child(2) > .EPiLink");
    cy.get(".results").should("not.be.visible");
  });
});
