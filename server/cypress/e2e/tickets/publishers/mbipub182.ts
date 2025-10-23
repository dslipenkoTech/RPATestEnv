import { URLS } from "~cypress/environment";

const link = Cypress.env("Pub") + "bestsellers-new-releases/";

describe("MBIPUB182", { tags: ["@publishers", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Prices", () => {
    for (let i = 2; i < 3; i++) {
      cy.get("body").type("{esc}");
      cy.wait(2000);
      cy.clickElement(`:nth-child(${i}) > .resultcontent > .bookTitle > a`);

      cy.get("body").type("{esc}");
      cy.get(".selected > .price")
        .invoke("text")
        .then((price1: string) => {
          cy.get("body").type("{esc}");
          cy.get("div.Main > div.ProductDetail-main > div > div.row > div.summary > div.summaryPrice > div.yourPrice > span.value")
            .invoke("text")
            .should("equal", price1);
        });
      cy.get("body").type("{esc}");
      cy.go("back");
    }
  });
});
