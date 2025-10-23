import { URLS } from "~cypress/environment";

const link = Cypress.env("Radio");

describe("MBIRSARDO162", { tags: ["@moody-radio", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Social media in the footer", () => {
    const links = [
      "body > footer > div.Wrap > div:nth-child(2) > p:nth-child(3) > a:nth-child(1)",
      "body > footer > div.Wrap > div:nth-child(2) > p:nth-child(3) > a:nth-child(2)",
      "body > footer > div.Wrap > div:nth-child(2) > p:nth-child(3) > a:nth-child(3)",
    ] as string[];

    cy.loopVisible(links);
    cy.loopHrefExists(links);
  });
});
