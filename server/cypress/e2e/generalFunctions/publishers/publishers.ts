import { URLS } from "~cypress/environment";
import { header, footer, branch } from "~cypress/components/headerFooterComponents/publishers";

const link = Cypress.env("Pub");

describe("Publishers", { tags: ["@publishers", "@premise"] }, () => {
  beforeEach(() => URLS(link));

  it("Pop up", () => cy.pressEsc());

  branch();

  header();

  it("Subscribe", () => {
    //Btn
    cy.visible(".row > div > a > img");
  });

  it("Featured author", () => {
    cy.visible("h1");
  });

  it("New releases", () => {
    cy.pressEsc();
    var bookLink = [
      "ul > :nth-child(1) > a > img",
      "ul > :nth-child(2) > a > img",
      "ul > :nth-child(3) > a > img",
      "ul > :nth-child(4) > a > img",
    ];
    cy.loopVisible(bookLink);
  });

  footer();
});
