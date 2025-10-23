import { URLS } from "~cypress/environment";

const link = Cypress.env("Pub") + "search/?page=1&mode=&tab=product&pageSize=8&q=bible&sort=";

describe("MBIPUB314", { tags: ["@publishers", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Check if the page updates when you sort by", () => {
    cy.clickElement(`.Category-filtercol > [data-drop-down-id="sort"] > :nth-child(1) > .options-toggle`);
    cy.clickElement('.Category-filtercol > [data-drop-down-id="sort"] > :nth-child(1) > .options > :nth-child(3) > a');
    cy.wait(2000);
    cy.url().should("not.eq", link);
  });
});
