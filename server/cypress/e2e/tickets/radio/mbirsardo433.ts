import { URLS } from "~cypress/environment";

const link = Cypress.env("Radio");

describe("MBIRSARDO433", { tags: ["@radio-moody", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it('"On Air" is saying "Up Next"', () => {
    cy.visible(".upNext > .programDetails > p");
  });
});
