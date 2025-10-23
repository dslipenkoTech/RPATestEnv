import { URLS } from "~cypress/environment";

const link = Cypress.env("Edu") + "online/";

describe.skip("MBIRSAEDU162", { tags: ["@education", "@premise", "@ticket"] }, () => {
  beforeEach(() => URLS(link));

  it("'Apply' button class", () => {
    const link = ".desktop-cta > .Cta-icons > .list > :nth-child(3) > .ctaApply";
    const classs = "ctaApply";
    cy.verifyClass(link, classs);
  });

  it("'Apply' Button Class (phone)", () => {
    cy.viewport("iphone-x");
    cy.clickElement(".menu-btn");
    cy.visible(".main > .Edu-submenu-navbar > .link-container > :nth-child(3) > .gold");
  });
});
