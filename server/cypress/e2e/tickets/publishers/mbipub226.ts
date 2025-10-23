import { URLS } from "~cypress/environment";

const link = Cypress.env("Pub") + "bible-study/";

describe("MBIPUB226", { tags: ["@publishers", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Issue", () => {
    cy.pressEsc;
    cy.clickElement('.Category-filtercol > [data-drop-down-id="sort"] > :nth-child(1) > .options-toggle');
    cy.pressEsc;
    var link2 = '.Category-filtercol > [data-drop-down-id="sort"] > :nth-child(1) > .options > :nth-child(5) > a';
    cy.pressEsc;
    cy.verifyHref(link2, "?sort=HighToLow&page=1");
  });
});
