import { URLS, viewport } from "~cypress/environment";

const link = Cypress.env("Edu") + "alumni/connect/news/";

describe.skip("MBIRSAEDU179", { tags: ["@education", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it(`Testing page banner on Connect News page`, () => {
    cy.get("#Page-banner").should(($el) => {
      const height = parseFloat($el.css("height"));
      expect(height).to.be.closeTo(400, 1); // Allow 1px difference
    });
    viewport(true);
    cy.get("#Page-banner").should(($el) => {
      const height = parseFloat($el.css("height"));
      expect(height).to.be.closeTo(310, 1); // Allow 1px difference
    });
  });
});
