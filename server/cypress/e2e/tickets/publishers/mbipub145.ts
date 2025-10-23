import { URLS } from "~cypress/environment";

const link = Cypress.env("Pub") + "bestsellers-new-releases/";

describe("MBIPUB145", { tags: ["@publishers", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Rounding", () => {
    cy.pressEsc();
    //Add to cart
    for (let i = 1; i < 3; i++) {
      cy.get("body").type("{esc}");
      cy.get(`:nth-child(${i + 8}) > .resultcontent > .form-inline > #add-to-cart`).click();

      cy.wait(2000);
      cy.go("back");
    }
    cy.get("body").type("{esc}");
    cy.get(".Cart").click();

    //Putting prices in a variable
    var price1: string;
    cy.get("body").type("{esc}");
    cy.get(`.row.\\39 78-0-8024-2919-3 > .col-md-9 > .cartcontent > .bookPrice`).should(($div) => {
      price1 = $div.text();
    });

    var price2: string;
    cy.get(`.row.\\39 78-0-8024-2919-3 > .col-md-3 > .itemTotal`).should(($div) => {
      price2 = $div.text();
    });

    //Making sure that the prices don't change when the amount of other books increase
    var price11: string;
    cy.get(`.row.\\39 78-0-8024-2919-3 > .col-md-9 > .cartcontent > .bookPrice`).should(($div) => {
      price11 = $div.text();
      expect(price1).to.equal(price11);
    });
    var price22: string;
    cy.get(`.row.\\39 78-0-8024-2919-3 > .col-md-3 > .itemTotal`).should(($div) => {
      price22 = $div.text();
      expect(price2).to.equal(price22);
    });
  });
});
