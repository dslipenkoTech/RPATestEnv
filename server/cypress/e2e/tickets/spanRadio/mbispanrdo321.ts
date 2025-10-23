import { URLS } from "~cypress/environment";

const link = Cypress.env("Spanradio");
let envType: string = Cypress.env("CYPRESS_ENV_TYPE") || "qa";

describe("MBISPANRDO321", { tags: ["@radio-moody", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Header | Nav bar", () => {
    if (envType === "www" || envType === "stage") return;
    cy.checkCssValue("#radio-body > div.default-page > header", "border-bottom", "1px solid rgb(231, 229, 228)");
  });
});
