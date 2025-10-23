import { URLS } from "~cypress/environment";

const link = Cypress.env("Radio");

describe("MBIRSAG352", { tags: ["@bible", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Dropdown menu", () => {
    //Description
    cy.clickElement(":nth-child(2) > .toggle");
    cy.visible(".Dropdowns");

    cy.wait(4000);
    //Check dropdown class
    cy.visible(".dropdown.isActive");
  });
});
