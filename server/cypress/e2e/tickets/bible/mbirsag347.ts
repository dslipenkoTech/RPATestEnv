import { URLS } from "~cypress/environment";
let envType: string = Cypress.env("CYPRESS_ENV_TYPE") || "qa";

const link = Cypress.env("Bible");

describe.skip("MBIRSAG347", { tags: ["@bible", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Redirect", () => {
    let link;
    if (envType === "prod") {
      link = ".utility-btns > :nth-child(2) > .inline-flex";
    } else {
      link = ".donate > a";
    }

    cy.hrefExists(link);
  });
});
