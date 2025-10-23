import { URLS } from "~cypress/environment";

const link = Cypress.env("Bible") + "/news/global/2019/chicago-campus-redevelopment/";

describe("MBIRSAG312", { tags: ["@bible", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("Link", () => {
    const links = "/news/global/2019/chicago-campus-redevelopment/";
    cy.get("a").should("not.have.attr", "href", "#undefined");

    cy.hrefExists('link[rel="canonical"]');
  });
});
