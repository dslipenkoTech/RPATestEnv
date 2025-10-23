import { URLS } from "~cypress/environment";
let envType: string = Cypress.env("CYPRESS_ENV_TYPE") || "qa";

const link = Cypress.env("Edu") + "alumni/connect/news/";

describe.skip("MBIRSAEDU145", { tags: ["@education", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  const pages = [
    { path: "", name: "page 1" },
    { path: "2019/finding-your-roots/", name: "page 2" },
  ];

  it(`Image is visible page 1`, () => {
    cy.visible("#Page-banner > .container");
  });

  it(`Image is visible page 2`, () => {
    cy.visit(`https://${envType}.${link}/2019/finding-your-roots/`);
    cy.visible("#Page-banner > .container");
  });
});
