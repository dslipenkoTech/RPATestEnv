import { URLS } from "~cypress/environment";

const link = Cypress.env("Pub") + "bestsellers-new-releases/";

describe("MBIPUB242", { tags: ["@publishers", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Type 'images' in a search field", () => {
    cy.get(".text").type("images");
    cy.clickElement(`#\\#Search`);
    cy.wait(5000);
  });
});
