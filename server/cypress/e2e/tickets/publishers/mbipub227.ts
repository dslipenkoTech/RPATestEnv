import { URLS } from "~cypress/environment";

const link = Cypress.env("Pub") + "evangelism-discipleship-3da1ef69/";
const link2 = Cypress.env("Pub") + "commentaries//";

describe("MBIPUB227 - Test 1", { tags: ["@publishers", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Pop up", () => {
    cy.pressEsc;
  });

  it("Evangelism and discipleship", () => {
    for (let x = 0; x < 2; x++) {
      cy.pressEsc;
      var menu = ".filterHead > .col-md-12 > .pagination > :nth-child(7) > .more";
      cy.clickElement(menu);
      cy.url().should("include", `?page=${x + 2}`);
    }
  });
});

describe("MBIPUB227 - Test 2", { tags: ["@publishers", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link2));

  it("Biography and inspirational", () => {
    for (let i = 0; i < 4; i++) {
      cy.pressEsc;
      cy.clickElement(".filterHead > .col-md-12 > .pagination > :nth-child(7) > .more");
      cy.url().should("include", `?page=${i + 2}`);
    }
  });
});
