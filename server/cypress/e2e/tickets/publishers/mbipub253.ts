import { URLS } from "~cypress/environment";

const link = Cypress.env("Pub");

describe("MBIPUB253", { tags: ["@publishers", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Meta 'robots'", () => {
    const envType = Cypress.env("ENV_TYPE");

    if (envType === "production" || envType === "prod") {
      // Production should allow indexing
      cy.verifyMetaContent("name", "robots", "index");
    } else {
      // Non-production environments might prevent indexing
      cy.verifyMetaContent("name", "robots", "noindex, Nofollow");
    }
  });
});
