import { URLS } from "~cypress/environment";

const link = Cypress.env("Edu");

describe.skip("MBIRSAEDU93", { tags: ["@education", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));
  it("Arrows", () => {
    //Arrows testing
    for (let i = 0; i < 3; i++) {
      cy.get(".slick-next").click();
      cy.wait(1000);
    }
    for (let i = 0; i < 3; i++) {
      cy.clickElement(".slick-prev");
      cy.wait(1000);
    }
  });
});
