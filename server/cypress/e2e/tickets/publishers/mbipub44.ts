import { URLS } from "~cypress/environment";

const link = Cypress.env("Pub") + "bestsellers-new-releases/";

describe("MBIPUB44", { tags: ["@publishers", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("A discount", () => {
    cy.get("body").type("{esc}");
    for (let i = 0; i < 3; i++) {
      cy.get("body").type("{esc}");
      cy.get(`:nth-child(${i + 1}) > .resultcontent > .form-inline > #add-to-cart > .cartButton`).click();
      cy.wait(2000);
      cy.go("back");
    }
    cy.wait(2000);
    cy.get("body").type("{esc}");
    cy.get(".Cart").click();

    //Put price into variable
    var totalDiscount: string;
    cy.get("body").type("{esc}");
    cy.get("div.xShoppingCart > div > div.row > div.col-md-4 > p:nth-child(5) > span").should(($div) => {
      totalDiscount = $div.text();
    });

    //Apply the discount
    cy.get("body").type("{esc}");
    cy.get("#couponCode").type("CHALMERS");
    cy.get("body").type("{esc}");
    cy.get("#coupon > .Input-button").click();
    cy.wait(10000);

    //Compare the price
    cy.get("body").type("{esc}");
    cy.get("div.xShoppingCart > div > div.row > div.col-md-4 > h3 > span").should(($div) => {
      var totalPrice = $div.text();
      expect(totalDiscount).to.not.equal(totalPrice);
    });
  });
});
