import { URLS } from "~cypress/environment";

const link = Cypress.env("Spanradio");

describe("MBISPANRDO270", { tags: ["@radio-moody", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Homepage hero banner | Font size", () => {
    cy.get(".on-air").should("have.css", "font-size", "22px");
    cy.get(".next-title").should("have.css", "font-size", "16px");
  });
});
