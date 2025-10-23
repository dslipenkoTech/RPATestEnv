import { URLS } from "~cypress/environment";

const link = Cypress.env("Edu") + "academics/faculty/andrew-beaty/";

describe.skip("MBIRSAEDU171", { tags: ["@education", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Heading", () => {
    cy.checkText(":nth-child(9) > .label", `Professional / Personal Interests:`);
  });
});
