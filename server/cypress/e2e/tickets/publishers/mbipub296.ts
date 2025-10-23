import { URLS } from "~cypress/environment";

const link = Cypress.env("Pub") + "habakkuk";

describe("MBIPUB296", { tags: ["@publishers", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Habakkuk url is not loading", () => {
    cy.get("WE HAVE ENCOUNTERED AN ERROR").should("not.exist");
  });
});
