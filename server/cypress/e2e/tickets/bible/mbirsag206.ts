import { URLS } from "~cypress/environment";

const link = Cypress.env("Bible");
describe("MBIRSAG206", { tags: ["@bible", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));
  it("License expired", () => {
    cy.wait(2000);

    //Making sure license isn't expired
    cy.contains("License has expired").should("not.exist");
  });
});
