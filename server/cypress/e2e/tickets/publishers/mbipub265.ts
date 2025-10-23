import { URLS } from "~cypress/environment";

const link = Cypress.env("Pub");

describe("MBIPUB265", { tags: ["@publishers", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Loading time", () => {
    cy.window().then((win) => {
      win.performance.mark("start-loading");
      const t0 = win.performance.now();
      console.log(`Page load started at: ${t0}`);
    });
  });
});
