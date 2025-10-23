import { URLS } from "~cypress/environment";

const link = Cypress.env("Edu") + "academics/program-finder/master-of-divinity/";

describe.skip("MBIRSAEDU182", { tags: ["@education", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Image URLS Broken", () => {
    cy.get(".featured > img").should("be.visible");
  });
});
