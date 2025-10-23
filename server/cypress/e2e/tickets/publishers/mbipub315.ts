import { URLS } from "~cypress/environment";

const link = Cypress.env("Pub") + "bestsellers/";

describe("MBIPUB315", { tags: ["@publishers", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Evangelism and discipleship", () => {
    for (let i = 0; i < 2; i++) {
      cy.clickElement(":nth-child(3) > .col-md-12 > .pagination > :nth-child(7) > .more");
      cy.url().should("include", `?page=${i + 2}`);
    }
  });
});
